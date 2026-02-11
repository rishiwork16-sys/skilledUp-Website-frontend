const fs = require('fs');

const argv = process.argv.slice(2);
const NO_AUTH = argv.includes('--no-auth');
const baseArg = argv.find((a) => !a.startsWith('--'));
const BASE_URL = baseArg || process.env.BASE_URL || 'http://35.154.236.138:8080';
const EMAIL = process.env.ADMIN_EMAIL || 'admin2@finallms.local';
const PASSWORD = process.env.ADMIN_PASSWORD || 'Admin2@123';
const THUMBNAIL_PATH =
  process.env.THUMBNAIL_PATH ||
  'C:/Users/Admin/Desktop/Website Testing/frontend/src/assets/skilledUplogo.png';

async function readJsonOrThrow(res, label) {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${label} failed ${res.status}: ${text}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} returned non-JSON: ${text}`);
  }
}

async function main() {
  if (typeof fetch !== 'function') {
    throw new Error('Node fetch() not available. Please use Node 18+.');
  }

  let token = null;
  if (!NO_AUTH) {
    const fixRes = await fetch(`${BASE_URL}/api/auth/fix-db`, { method: 'GET' });
    if (!fixRes.ok) {
      const t = await fixRes.text();
      throw new Error(`Auth fix-db failed ${fixRes.status}: ${t}`);
    }
    const fixText = await fixRes.text();
    process.stdout.write(`fix-db: ${fixText}\n`);

    const userRes = await fetch(
      `${BASE_URL}/api/auth/user?email=${encodeURIComponent(EMAIL)}`,
      { method: 'GET' }
    );
    const userText = await userRes.text();
    process.stdout.write(`user lookup (${userRes.status}): ${userText}\n`);

    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    const login = await readJsonOrThrow(loginRes, 'Login');
    token = login.token || login.accessToken || login.jwt || login?.data?.token;
    if (!token) {
      throw new Error(`Token not found in login response: ${JSON.stringify(login)}`);
    }
  }

  const now = Date.now();
  const payload = {
    title: `E2E Test Course ${now}`,
    description: 'Created by automated E2E test',
    slug: `e2e-test-${now}`,
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    duration: '1 Week',
    mode: 'Online',
    category: 'Test',
    skills: ['Testing'],
    faqs: [],
    careerOpportunities: [],
    keyHighlights: [],
    mentors: [],
    toolsCovered: [],
  };

  const createHeaders = { 'Content-Type': 'application/json' };
  if (token) createHeaders.Authorization = `Bearer ${token}`;
  const createRes = await fetch(`${BASE_URL}/api/admin/courses`, {
    method: 'POST',
    headers: createHeaders,
    body: JSON.stringify(payload),
  });
  const created = await readJsonOrThrow(createRes, 'Create course');
  const courseId = created?.id;
  if (!courseId) {
    throw new Error(`Course id missing in response: ${JSON.stringify(created)}`);
  }
  process.stdout.write(`Created course id: ${courseId}\n`);

  const buf = fs.readFileSync(THUMBNAIL_PATH);
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type: 'image/png' }), 'thumbnail.png');

  const uploadRes = await fetch(`${BASE_URL}/api/admin/courses/${courseId}/thumbnail`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  });
  const afterUpload = await readJsonOrThrow(uploadRes, 'Upload thumbnail');
  process.stdout.write(
    `Thumbnail upload OK. thumbnailUrl=${afterUpload?.thumbnailUrl || ''}\n`
  );

  const getRes = await fetch(`${BASE_URL}/api/admin/courses/${courseId}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const fetched = await readJsonOrThrow(getRes, 'Get course');
  process.stdout.write(
    `Fetch OK. id=${fetched?.id} thumbnailUrl=${fetched?.thumbnailUrl || ''}\n`
  );
}

main().catch((err) => {
  process.stderr.write(`${err?.stack || err?.message || String(err)}\n`);
  process.exit(1);
});
