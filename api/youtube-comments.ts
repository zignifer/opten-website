import type { IncomingMessage, ServerResponse } from "node:http";
import { publicLearnLessons } from "../src/content/space/learn.js";

const MAX_COMMENTS = 20;
const UPSTREAM_TIMEOUT_MS = 8_000;

type YouTubeApiError = {
  error?: {
    errors?: Array<{ reason?: string }>;
  };
};

type YouTubeVideoListResponse = YouTubeApiError & {
  items?: Array<{
    statistics?: {
      commentCount?: string;
    };
  }>;
};

type YouTubeCommentThreadListResponse = YouTubeApiError & {
  items?: Array<{
    id?: string;
    snippet?: {
      totalReplyCount?: number;
      topLevelComment?: {
        id?: string;
        snippet?: YouTubeCommentSnippet;
      };
    };
    replies?: {
      comments?: Array<{
        id?: string;
        snippet?: YouTubeCommentSnippet;
      }>;
    };
  }>;
};

type YouTubeCommentSnippet = {
  authorDisplayName?: string;
  authorProfileImageUrl?: string;
  authorChannelUrl?: string;
  textDisplay?: string;
  textOriginal?: string;
  likeCount?: number;
  publishedAt?: string;
  updatedAt?: string;
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "method_not_allowed" });
  }

  const requestUrl = new URL(req.url ?? "/api/youtube-comments", "https://opten.space");
  const lessonSlug = requestUrl.searchParams.get("lesson")?.trim() ?? "";
  const lang = requestUrl.searchParams.get("lang") === "en" ? "en" : "ru";
  const lesson = publicLearnLessons.find((item) => item.slug === lessonSlug);
  const localizedVideo = lesson?.localizedVideo?.[lang];
  const youtubeId = localizedVideo?.youtubeId ?? lesson?.youtubeId;

  if (!lesson || !youtubeId) {
    return sendJson(res, 404, { error: "youtube_lesson_not_found" });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, { error: "youtube_comments_not_configured" });
  }

  const videoParams = new URLSearchParams({
    part: "statistics",
    id: youtubeId,
    key: apiKey,
  });
  const commentParams = new URLSearchParams({
    part: "snippet,replies",
    videoId: youtubeId,
    maxResults: String(MAX_COMMENTS),
    order: "relevance",
    textFormat: "plainText",
    key: apiKey,
  });

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), UPSTREAM_TIMEOUT_MS);

  let videoResponse: Response;
  let commentResponse: Response;
  try {
    [videoResponse, commentResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/youtube/v3/videos?${videoParams}`, {
        headers: { Accept: "application/json" },
        signal: abortController.signal,
      }),
      fetch(`https://www.googleapis.com/youtube/v3/commentThreads?${commentParams}`, {
        headers: { Accept: "application/json" },
        signal: abortController.signal,
      }),
    ]);
  } catch {
    clearTimeout(timeout);
    return sendJson(res, 502, { error: "youtube_comments_unavailable" });
  }
  clearTimeout(timeout);

  const [videoBody, commentBody] = await Promise.all([
    readJson<YouTubeVideoListResponse>(videoResponse),
    readJson<YouTubeCommentThreadListResponse>(commentResponse),
  ]);

  if (!videoResponse.ok) {
    return sendJson(res, 502, { error: "youtube_video_unavailable" });
  }

  const video = videoBody.items?.[0];
  if (!video) {
    return sendJson(res, 404, { error: "youtube_video_not_found" });
  }

  const totalCommentCount = parseCount(video.statistics?.commentCount);
  const upstreamReason = commentBody.error?.errors?.[0]?.reason;
  if (!commentResponse.ok) {
    if (upstreamReason === "commentsDisabled") {
      return sendSuccess(res, {
        enabled: false,
        totalCommentCount,
        youtubeUrl: getYoutubeWatchUrl(youtubeId),
        comments: [],
      });
    }
    return sendJson(res, 502, { error: "youtube_comments_unavailable" });
  }

  const comments = (commentBody.items ?? []).flatMap((thread) => {
    const comment = thread.snippet?.topLevelComment;
    const snippet = comment?.snippet;
    const id = comment?.id ?? thread.id;
    const mappedComment = mapYouTubeComment(id, snippet);
    if (!mappedComment) return [];

    return [{
      ...mappedComment,
      pinned: id === lesson.youtubePinnedCommentId,
      replyCount: parseCount(thread.snippet?.totalReplyCount),
      replies: (thread.replies?.comments ?? []).flatMap((reply) => {
        const mappedReply = mapYouTubeComment(reply.id, reply.snippet);
        return mappedReply ? [mappedReply] : [];
      }),
    }];
  }).sort((left, right) => Number(right.pinned) - Number(left.pinned));

  return sendSuccess(res, {
    enabled: true,
    totalCommentCount,
    youtubeUrl: getYoutubeWatchUrl(youtubeId),
    comments,
  });
}

function sendSuccess(res: ServerResponse, body: Record<string, unknown>) {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=3600");
  return sendJson(res, 200, body, false);
}

function sendJson(res: ServerResponse, status: number, body: Record<string, unknown>, noStore = true) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (noStore) res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readJson<T>(response: Response): Promise<T> {
  try {
    return await response.json() as T;
  } catch {
    return {} as T;
  }
}

function parseCount(value: unknown) {
  const count = typeof value === "number" ? value : Number.parseInt(String(value ?? "0"), 10);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

function mapYouTubeComment(id: string | undefined, snippet: YouTubeCommentSnippet | undefined) {
  const text = snippet?.textOriginal ?? snippet?.textDisplay;
  if (!id || !snippet?.authorDisplayName || !text) return null;

  return {
    id,
    authorName: snippet.authorDisplayName,
    authorAvatarUrl: getSafeHttpsUrl(snippet.authorProfileImageUrl),
    authorChannelUrl: getSafeHttpsUrl(snippet.authorChannelUrl),
    text,
    likeCount: parseCount(snippet.likeCount),
    publishedAt: getSafeIsoDate(snippet.publishedAt),
    updatedAt: getSafeIsoDate(snippet.updatedAt),
  };
}

function getSafeHttpsUrl(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function getSafeIsoDate(value: unknown) {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) return null;
  return value;
}

function getYoutubeWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}#comments`;
}
