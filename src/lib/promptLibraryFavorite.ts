import type { PromptRecord } from "./promptLibraryApi";

export type PromptFavoritePatchResult = Pick<PromptRecord, "id" | "favorite"> & Partial<PromptRecord>;

export class PromptLibraryFavoriteError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "PromptLibraryFavoriteError";
    this.code = code;
    this.status = status;
  }
}

export function isPromptLibraryFavoriteAuthError(error: unknown): boolean {
  return error instanceof PromptLibraryFavoriteError && (error.status === 401 || error.status === 403);
}

type SavePromptFavoriteOptions<T extends PromptFavoritePatchResult> = {
  promptId: string;
  favorite: boolean;
  getFreshAuthToken: () => Promise<string | null>;
  patchFavorite: (token: string, promptId: string, favorite: boolean) => Promise<T>;
  onTokenAccepted?: (token: string) => void;
};

export async function savePromptFavoriteWithFreshAuth<T extends PromptFavoritePatchResult>(
  options: SavePromptFavoriteOptions<T>,
): Promise<T> {
  const firstToken = await options.getFreshAuthToken();
  if (!firstToken) {
    throw new PromptLibraryFavoriteError("not authenticated", "not_authenticated", 401);
  }

  try {
    const saved = await options.patchFavorite(firstToken, options.promptId, options.favorite);
    options.onTokenAccepted?.(firstToken);
    return saved;
  } catch (error) {
    if (!isPromptLibraryFavoriteAuthError(error)) throw error;
  }

  const retryToken = await options.getFreshAuthToken();
  if (!retryToken) {
    throw new PromptLibraryFavoriteError("not authenticated", "not_authenticated", 401);
  }

  const saved = await options.patchFavorite(retryToken, options.promptId, options.favorite);
  options.onTokenAccepted?.(retryToken);
  return saved;
}
