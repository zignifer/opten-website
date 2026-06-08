import { SUPABASE_ANON_KEY } from "./optenAuth";

export const SUPABASE_REST_URL = "https://supabase.opten.space/rest/v1";
export const MAX_PROMPTS = 150;
export const MAX_BODY_CHARS = 12000;
export const MAX_TAGS = 8;
export const PROMPT_SELECT = "id,user_id,title,body,tags,favorite,source_host,source_url,source_title,body_hash,use_count,last_used_at,created_at,updated_at,archived_at";

export interface PromptRecord {
  id: string;
  user_id: string;
  title: string;
  body: string;
  tags: string[];
  favorite: boolean;
  source_host: string | null;
  source_url: string | null;
  source_title: string | null;
  body_hash?: string;
  use_count: number;
  last_used_at: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

export interface PromptLibraryPublicationSummary {
  id: string;
  slug: string;
  is_public: boolean;
  published_at: string;
  updated_at: string;
  unpublished_at: string | null;
  item_count: number;
}

export interface PublicPromptLibraryItem {
  item_id: string;
  title: string;
  body: string;
  tags: string[];
  source_host: string | null;
  source_url: string | null;
  source_title: string | null;
  source_created_at: string | null;
  source_updated_at: string | null;
  position: number;
}

export interface PublicPromptLibrarySnapshot {
  publication_id: string;
  slug: string;
  published_at: string;
  updated_at: string;
  item_count: number;
  items: PublicPromptLibraryItem[];
}

type PublicPromptLibraryRow = {
  publication_id: string;
  slug: string;
  published_at: string;
  updated_at: string;
  item_count: number;
  item_id: string | null;
  title: string | null;
  body: string | null;
  tags: string[] | null;
  source_host: string | null;
  source_url: string | null;
  source_title: string | null;
  source_created_at: string | null;
  source_updated_at: string | null;
  position: number | null;
};

export class PromptLibraryApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "PromptLibraryApiError";
    this.code = code;
    this.status = status;
  }
}

export function promptLibraryHeaders(accessToken?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  return headers;
}

export async function fetchPublicationSummary(accessToken: string): Promise<PromptLibraryPublicationSummary | null> {
  const rows = await callPromptLibraryRpc<PromptLibraryPublicationSummary[]>("prompt_library_publication_summary", {}, accessToken);
  return Array.isArray(rows) ? rows[0] ?? null : null;
}

export async function publishPromptLibrarySnapshot(accessToken: string): Promise<PromptLibraryPublicationSummary> {
  const rows = await callPromptLibraryRpc<PromptLibraryPublicationSummary[]>("prompt_library_publish_snapshot", {}, accessToken);
  const summary = Array.isArray(rows) ? rows[0] : null;
  if (!summary) throw new PromptLibraryApiError("missing publication summary", "missing_publication_summary", 500);
  return summary;
}

export async function unpublishPromptLibrary(accessToken: string): Promise<boolean> {
  return callPromptLibraryRpc<boolean>("prompt_library_unpublish", {}, accessToken);
}

export async function fetchPublicPromptLibrary(slug: string): Promise<PublicPromptLibrarySnapshot | null> {
  const rows = await callPromptLibraryRpc<PublicPromptLibraryRow[]>("prompt_library_get_public_snapshot", { p_slug: slug }, null);
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const first = rows[0];
  return {
    publication_id: first.publication_id,
    slug: first.slug,
    published_at: first.published_at,
    updated_at: first.updated_at,
    item_count: Number(first.item_count ?? 0),
    items: rows
      .filter((row): row is PublicPromptLibraryRow & { item_id: string; title: string; body: string } => Boolean(row.item_id && row.title && row.body))
      .map((row) => ({
        item_id: row.item_id,
        title: row.title,
        body: row.body,
        tags: row.tags ?? [],
        source_host: row.source_host,
        source_url: row.source_url,
        source_title: row.source_title,
        source_created_at: row.source_created_at,
        source_updated_at: row.source_updated_at,
        position: row.position ?? 0,
      })),
  };
}

export async function savePublicPromptToLibrary(itemId: string, accessToken: string): Promise<PromptRecord> {
  const row = await callPromptLibraryRpc<PromptRecord | PromptRecord[]>("prompt_library_save_public_prompt", { p_item_id: itemId }, accessToken);
  const saved = Array.isArray(row) ? row[0] : row;
  if (!saved) throw new PromptLibraryApiError("missing saved prompt", "missing_saved_prompt", 500);
  return saved;
}

async function callPromptLibraryRpc<T>(name: string, body: Record<string, unknown>, accessToken?: string | null): Promise<T> {
  const res = await fetch(`${SUPABASE_REST_URL}/rpc/${name}`, {
    method: "POST",
    headers: promptLibraryHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const code = data?.code || data?.message || String(res.status);
    const message = data?.message || data?.hint || code;
    throw new PromptLibraryApiError(message, code, res.status);
  }
  return data as T;
}
