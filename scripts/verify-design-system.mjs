import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'esbuild';

const root = process.cwd();
const read = async file => (await fs.readFile(path.join(root, file), 'utf8')).replace(/\r\n/g, '\n');
const website = JSON.parse(await read('src/design-system/generated/website.json'));
const extension = JSON.parse(await read('src/design-system/generated/extension.json'));
assert(website.typography.length > 0, 'Text role extraction is empty');
assert(website.assets.some(item => item.family === 'landing-design'), 'Homepage media missing');
assert(!/<script\b|\son\w+=/i.test(extension.markup), 'Extension snapshot must have no executable scripts');
for (const asset of extension.assets) {
  const data = await fs.readFile(path.join(root, 'public', asset.src));
  assert.equal(crypto.createHash('sha256').update(data).digest('hex'), asset.sha256, `Snapshot asset drift: ${asset.source}`);
}
for (const [source, checksum] of Object.entries(website.sourceHashes)) assert.equal(crypto.createHash('sha256').update(await read(source)).digest('hex'), checksum, `Run sync:design-system after editing ${source}`);
const manifest = JSON.parse(await read('vercel.json'));
assert(manifest.rewrites.some(item => item.source === '/admin' && item.destination === '/spa.html'));
assert(manifest.headers.some(item => item.source === '/admin' && item.headers.some(header => header.key === 'X-Robots-Tag' && header.value.includes('noindex'))));

// Exercise the real HTTP session handler and requireAdmin allowlist. Only the
// JWT verification transport is replaced; no live credentials are required.
const bundled = await build({ entryPoints: ['api/admin/session.ts'], bundle: true, write: false, platform: 'node', format: 'esm', plugins: [{ name: 'jwt-fixture', setup(builder) {
  builder.onResolve({ filter: /optenServerAuth\.js$/ }, () => ({ path: 'auth-fixture', namespace: 'fixture' }));
  builder.onLoad({ filter: /.*/, namespace: 'fixture' }, () => ({ contents: `
    export const bearerTokenFromHeader = value => value?.startsWith('Bearer ') ? value.slice(7) : null;
    export const verifySupabaseJwt = async token => {
      if(token==='owner-id') return {userId:'fixture-owner',email:'owner@example.test'};
      if(token==='owner-email') return {userId:'fixture-email',email:'zignifer@gmail.com'};
      if(token==='visitor') return {userId:'fixture-visitor',email:'visitor@example.test'};
      throw new Error('invalid');
    };
    export const jsonResponse = (res,status,body) => {res.statusCode=status;res.end(JSON.stringify(body));};
    export const setJsonCors = (res,methods) => res.setHeader('Allow',methods);
  ` }));
} }] });
const { default: handler } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const savedIds = process.env.OPTEN_ADMIN_USER_IDS;
process.env.OPTEN_ADMIN_USER_IDS = 'fixture-owner';
try {
  for (const [method,token,expected] of [['GET',null,401],['GET','invalid',401],['GET','visitor',403],['GET','owner-id',200],['GET','owner-email',200],['POST','owner-id',405],['OPTIONS',null,204]]) {
    const res = { statusCode: 200, headers: {}, body: '', setHeader(name,value) {this.headers[name]=value;}, end(value='') {this.body=value;} };
    await handler({ method, headers: token ? { authorization:`Bearer ${token}` } : {} },res);
    assert.equal(res.statusCode,expected,`${method}/${token}`);
    assert.equal(res.headers['Cache-Control'],'private, no-store');
    if(expected===200) assert.deepEqual(JSON.parse(res.body),{ok:true});
  }
} finally { if(savedIds===undefined) delete process.env.OPTEN_ADMIN_USER_IDS; else process.env.OPTEN_ADMIN_USER_IDS=savedIds; }
console.log(`Design system verified: source/asset hashes, noindex policy, 7 session/allowlist HTTP cases; ${extension.demos.length} extension families.`);
