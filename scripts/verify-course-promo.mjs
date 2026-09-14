import assert from 'node:assert/strict';
import { build } from 'esbuild';

const bundled = await build({
  entryPoints: ['src/lib/courseAccess.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  plugins: [{
    name: 'test-public-auth-config',
    setup(builder) {
      builder.onResolve({ filter: /\/optenAuth$/ }, () => ({ path: 'auth', namespace: 'test' }));
      builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
        contents: 'export const SUPABASE_ANON_KEY="test"; export const SUPABASE_FUNCTIONS_URL="https://example.invalid/functions/v1";',
      }));
    },
  }],
});
const { quoteCoursePayment, createCoursePayment } = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`
);
const originalFetch = globalThis.fetch;
const originalSetTimeout = globalThis.setTimeout;
const slug = 'ai-content-marketing-2026';
const claim = 'expired_claim_regression_check_000000000000';
const quote = (currency = 'RUB') => ({
  amount_value: currency === 'RUB' ? 3992 : 55.2,
  currency,
  promo_code: 'INTRO20',
  discount_claim_active: false,
});
const json = (body, status = 200) => new Response(JSON.stringify(body), { status });
let checks = 0;

try {
  // Expired/used claims must not poison subsequent manual quotes or checkout.
  for (const error of ['discount_claim_expired', 'discount_claim_used']) {
    const requests = [];
    globalThis.fetch = async (_url, init) => {
      const body = JSON.parse(init.body);
      requests.push(body);
      if (body.discount_claim_token) return json({ error }, 400);
      return json(body.quote_only ? quote(body.currency) : { order_id: 'test-order' });
    };
    await assert.rejects(quoteCoursePayment(slug, 'RUB', undefined, claim), { message: error });
    for (const currency of ['RUB', 'USD']) {
      const result = await quoteCoursePayment(slug, currency, ' intro20 ');
      assert.equal(result.amount_value, currency === 'RUB' ? 3992 : 55.2);
    }
    await createCoursePayment(slug, 'TEST@example.invalid', 'https://example.invalid', 'RUB', 'INTRO20');
    assert.equal(requests.length, 4);
    for (const body of requests.slice(1)) {
      assert.equal(body.promo_code, 'INTRO20');
      assert.equal(body.discount_claim_token, undefined);
    }
    checks += 1;
  }

  // Active claims retain priority; the two discounts must never stack.
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(init.body);
    assert.equal(body.discount_claim_token, claim);
    assert.equal(body.promo_code, undefined);
    return json({ ...quote(), discount_claim_active: true, promo_code: null });
  };
  await quoteCoursePayment(slug, 'RUB', 'INTRO20', claim);
  checks += 1;

  for (const failure of ['network', 503, 429]) {
    let calls = 0;
    globalThis.fetch = async (_url, init) => {
      assert.equal(JSON.parse(init.body).quote_only, true);
      calls += 1;
      if (calls === 1) {
        if (failure === 'network') throw new TypeError('Failed to fetch');
        return json({ error: 'promo_lookup_failed' }, failure);
      }
      return json(quote());
    };
    assert.equal((await quoteCoursePayment(slug, 'RUB', 'INTRO20')).amount_value, 3992);
    assert.equal(calls, 2);
    checks += 1;
  }

  for (const error of ['invalid_promo_code', 'promo_not_active']) {
    let calls = 0;
    globalThis.fetch = async () => { calls += 1; return json({ error }, 400); };
    await assert.rejects(quoteCoursePayment(slug, 'RUB', 'INTRO20'), { message: error });
    assert.equal(calls, 1);
    checks += 1;
  }

  let timedOut = 0;
  globalThis.setTimeout = (fn, delay, ...args) => originalSetTimeout(fn, delay === 12_000 ? 5 : delay, ...args);
  globalThis.fetch = async (_url, init) => new Promise((_resolve, reject) => {
    timedOut += 1;
    init.signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')), { once: true });
  });
  await assert.rejects(quoteCoursePayment(slug, 'RUB', 'INTRO20'), { name: 'AbortError' });
  assert.equal(timedOut, 2);
  globalThis.setTimeout = originalSetTimeout;
  checks += 1;

  globalThis.fetch = async () => json({});
  await assert.rejects(quoteCoursePayment(slug, 'RUB', 'INTRO20'), { message: 'course_quote_failed' });
  checks += 1;

  let paymentCalls = 0;
  globalThis.fetch = async (_url, init) => {
    assert.equal(JSON.parse(init.body).quote_only, undefined);
    paymentCalls += 1;
    throw new TypeError('Failed to fetch');
  };
  await assert.rejects(createCoursePayment(slug, 'test@example.invalid', 'https://example.invalid', 'RUB', 'INTRO20'));
  assert.equal(paymentCalls, 1);
  checks += 1;
} finally {
  globalThis.fetch = originalFetch;
  globalThis.setTimeout = originalSetTimeout;
}
console.log(`Course promo regression checks passed: ${checks}. No live requests or payments.`);
