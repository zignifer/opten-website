import type { LearnLang } from "../content/space/learn";

export type YouTubeLessonCommentReply = {
  id: string;
  authorName: string;
  authorAvatarUrl: string | null;
  authorChannelUrl: string | null;
  text: string;
  likeCount: number;
  publishedAt: string | null;
  updatedAt: string | null;
};

export type YouTubeLessonComment = YouTubeLessonCommentReply & {
  pinned: boolean;
  replyCount: number;
  replies: YouTubeLessonCommentReply[];
};

export type YouTubeLessonCommentsResponse = {
  enabled: boolean;
  totalCommentCount: number;
  youtubeUrl: string;
  comments: YouTubeLessonComment[];
};

export async function fetchYouTubeLessonComments(lessonSlug: string, lang: LearnLang, signal?: AbortSignal) {
  const params = new URLSearchParams({ lesson: lessonSlug, lang });
  const response = await fetch(`/api/youtube-comments?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) throw new Error(`youtube_comments_failed:${response.status}`);
  return await response.json() as YouTubeLessonCommentsResponse;
}
