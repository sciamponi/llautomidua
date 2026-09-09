import { toJSONAsync } from 'seroval';
function devFnId(file, exportName) {
  return Buffer.from(JSON.stringify({ file, export: exportName }), 'utf8').toString('base64url');
}
async function callFn(fnId, data, method) {
  const base = `http://localhost:3000/_serverFn/${fnId}`;
  const serialized = await Promise.resolve(toJSONAsync({ data }));
  const payload = JSON.stringify(serialized);
  const headers = { 'Sec-Fetch-Site': 'same-origin', 'x-tsr-serverFn': 'true', 'accept': 'text/plain;charset=UTF-8, application/json' };
  let url = base, body;
  if (method === 'GET') url = `${base}?${new URLSearchParams({ payload }).toString()}`;
  else { headers['content-type'] = 'application/json'; body = payload; }
  const res = await fetch(url, { method, headers, body });
  const text = await res.text();
  if (text.includes("Can't reach database server") || text.includes('ECONNREFUSED') || text.includes('Could not connect') || text.includes('connect ECONNREFUSED')) return 'DB_OFFLINE';
  if (res.status === 200 && !text.includes('$TSR/Error') && !text.includes('This page did')) return 'OK';
  if (res.status === 200 && text.includes('$TSR/Error')) return 'FUNCTION_ERROR';
  return `HTTP_${res.status}`;
}

const tests = [
  { page: '/', file: 'products.functions.ts', fn: 'getProducts', method: 'GET', data: undefined, prisma: false },
  { page: '/admin/login', file: 'auth.ts', fn: 'login', method: 'POST', data: { email: 'admin@automatizasolucao.com.br', password: 'x' }, prisma: true },
  { page: '/', file: 'campaigns.functions.ts', fn: 'getActiveCampaigns', method: 'GET', data: undefined, prisma: true },
  { page: '/captura/camp-test', file: 'captura.functions.ts', fn: 'getCampaignForCapture', method: 'GET', data: 'camp-test', prisma: true },
  { page: '/media-indoor', file: 'leads.functions.ts', fn: 'captureLead', method: 'POST', data: { name: 'Teste', whatsapp: '(11) 99999-9999' }, prisma: true },
  { page: '/admin', file: 'dashboard.functions.ts', fn: 'getDashboardStats', method: 'GET', data: undefined, prisma: true },
  { page: '/admin', file: 'companies.functions.ts', fn: 'getCompanies', method: 'GET', data: undefined, prisma: true },
  { page: '/sites', file: 'sites.functions.ts', fn: 'getSiteTemplates', method: 'GET', data: undefined, prisma: false },
];

for (const t of tests) {
  try {
    await fetch(`http://localhost:3000${t.page}`); // register module via page load
  } catch {}
  // Wait a tick for registration
  await new Promise(r => setTimeout(r, 300));
  const id = devFnId(`/src/lib/${t.file}?tss-serverfn-split`, `${t.fn}_createServerFn_handler`);
  const result = await callFn(id, t.data, t.method);
  console.log(`${t.file.padEnd(28)} ${t.fn.padEnd(26)} ${t.prisma ? 'PRISMA' : 'MOCK  '} => ${result}`);
}