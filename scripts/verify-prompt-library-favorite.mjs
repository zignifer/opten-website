import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const root = process.cwd();
const tempDir = path.join(root, '.tmp');
const outfile = path.join(tempDir, 'prompt-library-favorite-test.mjs');

await mkdir(tempDir, { recursive: true });

await build({
  entryPoints: [path.join(root, 'src/lib/promptLibraryFavorite.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile,
  logLevel: 'silent',
});

const {
  PromptLibraryFavoriteError,
  savePromptFavoriteWithFreshAuth,
} = await import(pathToFileURL(outfile));

async function testRetriesFavoritePatchWithFreshToken() {
  const patchCalls = [];
  const acceptedTokens = [];
  let tokenCalls = 0;

  const saved = await savePromptFavoriteWithFreshAuth({
    promptId: 'prompt-1',
    favorite: true,
    getFreshAuthToken: async () => {
      tokenCalls += 1;
      return tokenCalls === 1 ? 'expired-token' : 'fresh-token';
    },
    patchFavorite: async (token, promptId, favorite) => {
      patchCalls.push({ token, promptId, favorite });
      if (token === 'expired-token') {
        throw new PromptLibraryFavoriteError('expired token', 'auth_failed', 401);
      }
      return { id: promptId, favorite, title: 'Saved prompt' };
    },
    onTokenAccepted: (token) => {
      acceptedTokens.push(token);
    },
  });

  assert.equal(saved.id, 'prompt-1');
  assert.equal(saved.favorite, true);
  assert.deepEqual(patchCalls, [
    { token: 'expired-token', promptId: 'prompt-1', favorite: true },
    { token: 'fresh-token', promptId: 'prompt-1', favorite: true },
  ]);
  assert.deepEqual(acceptedTokens, ['fresh-token']);
}

async function testDoesNotReportSuccessWhenRetryFails() {
  const patchCalls = [];
  let tokenCalls = 0;

  await assert.rejects(
    savePromptFavoriteWithFreshAuth({
      promptId: 'prompt-2',
      favorite: true,
      getFreshAuthToken: async () => {
        tokenCalls += 1;
        return tokenCalls === 1 ? 'expired-token' : 'still-bad-token';
      },
      patchFavorite: async (token, promptId, favorite) => {
        patchCalls.push({ token, promptId, favorite });
        throw new PromptLibraryFavoriteError('not authorized', 'auth_failed', 403);
      },
    }),
    (error) => error instanceof PromptLibraryFavoriteError && error.status === 403,
  );

  assert.deepEqual(patchCalls, [
    { token: 'expired-token', promptId: 'prompt-2', favorite: true },
    { token: 'still-bad-token', promptId: 'prompt-2', favorite: true },
  ]);
}

async function testRequiresExtensionTokenBeforePatching() {
  let patchCalls = 0;

  await assert.rejects(
    savePromptFavoriteWithFreshAuth({
      promptId: 'prompt-3',
      favorite: true,
      getFreshAuthToken: async () => null,
      patchFavorite: async () => {
        patchCalls += 1;
        return { id: 'prompt-3', favorite: true };
      },
    }),
    (error) => error instanceof PromptLibraryFavoriteError && error.code === 'not_authenticated',
  );

  assert.equal(patchCalls, 0);
}

async function testDoesNotRetryNonAuthFailures() {
  let patchCalls = 0;

  await assert.rejects(
    savePromptFavoriteWithFreshAuth({
      promptId: 'prompt-4',
      favorite: true,
      getFreshAuthToken: async () => 'fresh-token',
      patchFavorite: async () => {
        patchCalls += 1;
        throw new PromptLibraryFavoriteError('server failed', 'server_failed', 500);
      },
    }),
    (error) => error instanceof PromptLibraryFavoriteError && error.status === 500,
  );

  assert.equal(patchCalls, 1);
}

await testRetriesFavoritePatchWithFreshToken();
await testDoesNotReportSuccessWhenRetryFails();
await testRequiresExtensionTokenBeforePatching();
await testDoesNotRetryNonAuthFailures();

console.log('verify-prompt-library-favorite: ok');
