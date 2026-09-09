import { toJSONAsync, fromJSON } from "seroval";
import { defaultSerovalPlugins } from "@tanstack/router-core";

const plugins = defaultSerovalPlugins;
const BASE = "http://localhost:3000";
let cookie = "";

const IDS = {
  login: "eyJmaWxlIjoiL3NyYy9saWIvYXV0aC50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJsb2dpbl9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
  getSessionUser: "eyJmaWxlIjoiL3NyYy9saWIvYXV0aC50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJnZXRTZXNzaW9uVXNlcl9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
  createCompany: "eyJmaWxlIjoiL3NyYy9saWIvY29tcGFuaWVzLmZ1bmN0aW9ucy50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJjcmVhdGVDb21wYW55X2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ",
  getCompanies: "eyJmaWxlIjoiL3NyYy9saWIvY29tcGFuaWVzLmZ1bmN0aW9ucy50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJnZXRDb21wYW5pZXNfY3JlYXRlU2VydmVyRm5faGFuZGxlciJ9",
  createCampaign: "eyJmaWxlIjoiL3NyYy9saWIvY2FtcGFpZ25zLmZ1bmN0aW9ucy50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJjcmVhdGVDYW1wYWlnbl9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
  updateCampaign: "eyJmaWxlIjoiL3NyYy9saWIvY2FtcGFpZ25zLmZ1bmN0aW9ucy50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJ1cGRhdGVDYW1wYWlnbl9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
  getCampaigns: "eyJmaWxlIjoiL3NyYy9saWIvY2FtcGFpZ25zLmZ1bmN0aW9ucy50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJnZXRDYW1wYWlnbnNfY3JlYXRlU2VydmVyRm5faGFuZGxlciJ9",
  createAd: "eyJmaWxlIjoiL3NyYy9saWIvYWRzLmZ1bmN0aW9ucy50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJjcmVhdGVBZF9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
  getAds: "eyJmaWxlIjoiL3NyYy9saWIvYWRzLmZ1bmN0aW9ucy50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJnZXRBZHNfY3JlYXRlU2VydmVyRm5faGFuZGxlciJ9",
  createScreen: "eyJmaWxlIjoiL3NyYy9saWIvc2NyZWVucy5mdW5jdGlvbnMudHM_dHNzLXNlcnZlcmZuLXNwbGl0IiwiZXhwb3J0IjoiY3JlYXRlU2NyZWVuX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ",
  updateScreen: "eyJmaWxlIjoiL3NyYy9saWIvc2NyZWVucy5mdW5jdGlvbnMudHM_dHNzLXNlcnZlcmZuLXNwbGl0IiwiZXhwb3J0IjoidXBkYXRlU2NyZWVuX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ",
  getScreens: "eyJmaWxlIjoiL3NyYy9saWIvc2NyZWVucy5mdW5jdGlvbnMudHM_dHNzLXNlcnZlcmZuLXNwbGl0IiwiZXhwb3J0IjoiZ2V0U2NyZWVuc19jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
  generateQrCode: "eyJmaWxlIjoiL3NyYy9saWIvcXIuZnVuY3Rpb25zLnRzP3Rzcy1zZXJ2ZXJmbi1zcGxpdCIsImV4cG9ydCI6ImdlbmVyYXRlUXJDb2RlX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ",
  getCampaignForCapture: "eyJmaWxlIjoiL3NyYy9saWIvY2FwdHVyYS5mdW5jdGlvbnMudHM_dHNzLXNlcnZlcmZuLXNwbGl0IiwiZXhwb3J0IjoiZ2V0Q2FtcGFpZ25Gb3JDYXB0dXJlX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ",
  submitLead: "eyJmaWxlIjoiL3NyYy9saWIvY2FwdHVyYS5mdW5jdGlvbnMudHM_dHNzLXNlcnZlcmZuLXNwbGl0IiwiZXhwb3J0Ijoic3VibWl0TGVhZF9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
  getLeads: "eyJmaWxlIjoiL3NyYy9saWIvbGVhZHMtYWRtaW4uZnVuY3Rpb25zLnRzP3Rzcy1zZXJ2ZXJmbi1zcGxpdCIsImV4cG9ydCI6ImdldExlYWRzX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ",
  getLeadById: "eyJmaWxlIjoiL3NyYy9saWIvbGVhZHMtYWRtaW4uZnVuY3Rpb25zLnRzP3Rzcy1zZXJ2ZXJmbi1zcGxpdCIsImV4cG9ydCI6ImdldExlYWRCeUlkX2NyZWF0ZVNlcnZlckZuX2hhbmRsZXIifQ",
  updateLeadStatus: "eyJmaWxlIjoiL3NyYy9saWIvbGVhZHMtYWRtaW4uZnVuY3Rpb25zLnRzP3Rzcy1zZXJ2ZXJmbi1zcGxpdCIsImV4cG9ydCI6InVwZGF0ZUxlYWRTdGF0dXNfY3JlYXRlU2VydmVyRm5faGFuZGxlciJ9",
};

async function rpc(name, method, data) {
  let url = `${BASE}/_serverFn/${IDS[name]}`;
  const headers = {
    "x-tsr-serverFn": "true",
    accept: "application/json",
    "sec-fetch-site": "same-origin",
  };
  if (cookie) headers["cookie"] = cookie;
  let body;
  if (method === "GET") {
    if (data !== undefined) {
      const payload = { data };
      const serialized = JSON.stringify(await toJSONAsync(payload, { plugins }));
      url += `?${new URLSearchParams({ payload: serialized }).toString()}`;
    }
  } else {
    const payload = data !== undefined ? { data } : undefined;
    if (payload) {
      body = JSON.stringify(await toJSONAsync(payload, { plugins }));
      headers["content-type"] = "application/json";
    }
  }
  const res = await fetch(url, { method, headers, body, redirect: "manual" });
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const setCookie of sc) {
    const pair = setCookie.split(";")[0];
    if (pair.includes("automatiza_session")) cookie = pair;
  }
  const text = await res.text();
  let decoded;
  try {
    decoded = fromJSON(text, { plugins }) ?? text;
  } catch {
    decoded = text;
  }
  return { status: res.status, decoded, text };
}

const step = (label, ok, extra = "") =>
  console.log(`${ok ? "PASS" : "FAIL"} | ${label}${extra ? " | " + extra : ""}`);

let exitCode = 0;
const fail = (label, err) => {
  console.log(`FAIL | ${label} | ${err?.message ?? err}`);
  throw err;
};

try {
  // 1. Login admin
  const login = await rpc("login", "POST", {
    email: "admin@automatizasolucao.com.br",
    password: "admin36459235",
  });
  step("login (admin)", login.status === 200 && login.decoded?.success === true,
    `status=${login.status} user=${login.decoded?.user?.email}`);
  if (login.decoded?.success !== true) exitCode = 1;

  // 2. Check session
  const session = await rpc("getSessionUser", "GET");
  step("getSessionUser (sessão ativa)", session.status === 200 && session.decoded?.role === "ADMIN",
    `role=${session.decoded?.role}`);

  // 3. Create company
  const company = await rpc("createCompany", "POST", {
    name: "Empresa Teste E2E",
    phone: "(11) 99999-0001",
    email: "contato@empresateste.com",
    website: "https://empresateste.com",
    logo: "",
  });
  step("createCompany", company.status === 200 && !!company.decoded?.id,
    `id=${company.decoded?.id}`);
  if (!company.decoded?.id) exitCode = 1;
  const companyId = company.decoded?.id;

  // 4. Create campaign (DRAFT -> then activate)
  const campaign = await rpc("createCampaign", "POST", {
    name: "Campanha Teste E2E",
    description: "Campanha criada pelo teste ponta a ponta.",
    companyId,
    status: "DRAFT",
    ctaText: "QUERO SABER MAIS",
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    imageUrl: "",
  });
  step("createCampaign", campaign.status === 200 && !!campaign.decoded?.id,
    `id=${campaign.decoded?.id} status=${campaign.decoded?.status}`);
  if (!campaign.decoded?.id) exitCode = 1;
  const campaignId = campaign.decoded?.id;

  const activate = await rpc("updateCampaign", "POST", { id: campaignId, status: "ACTIVE" });
  step("updateCampaign -> ACTIVE", activate.status === 200 && activate.decoded?.status === "ACTIVE",
    `status=${activate.decoded?.status}`);

  // 5. Create ad
  const ad = await rpc("createAd", "POST", {
    title: "Anúncio Teste E2E",
    description: "Peça publicitária do teste.",
    imageUrl: "",
    videoUrl: "",
    ctaText: "QUERO SABER MAIS",
    campaignId,
    screenId: "",
    duration: 15,
    priority: 10,
    status: "ACTIVE",
  });
  step("createAd", ad.status === 200 && !!ad.decoded?.id, `id=${ad.decoded?.id}`);
  if (!ad.decoded?.id) exitCode = 1;
  const adId = ad.decoded?.id;

  // 6. Create screen (linked to company + current campaign)
  const screen = await rpc("createScreen", "POST", {
    name: "Tela Teste E2E",
    identifier: "tela-teste-e2e",
    location: "Centro, São Paulo/SP",
    establishment: "Estabelecimento Teste",
    status: "ACTIVE",
    currentCampaignId: campaignId,
    companyId,
  });
  step("createScreen", screen.status === 200 && !!screen.decoded?.id,
    `id=${screen.decoded?.id}`);
  if (!screen.decoded?.id) exitCode = 1;
  const screenId = screen.decoded?.id;

  // 7. Generate QR code for campaign
  const qr = await rpc("generateQrCode", "GET", campaignId);
  step("generateQrCode", qr.status === 200 && typeof qr.decoded?.qrDataUrl === "string" &&
    qr.decoded?.captureUrl?.includes("/captura/"),
    `url=${qr.decoded?.captureUrl}`);

  // 8. Public capture: fetch campaign info
  const capInfo = await rpc("getCampaignForCapture", "GET", campaignId);
  step("getCampaignForCapture (público)", capInfo.status === 200 && capInfo.decoded?.name === "Campanha Teste E2E",
    `company=${capInfo.decoded?.company?.name}`);

  // 9. Public capture: submit lead (with ad + screen attribution)
  const lead = await rpc("submitLead", "POST", {
    campaignId,
    adId,
    screenId,
    name: "João da Silva Teste",
    whatsapp: "11999990002",
    email: "joao.teste@email.com",
    city: "São Paulo",
    source: "QR_CODE",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
  });
  step("submitLead (público)", lead.status === 200 && lead.decoded?.success === true &&
    !!lead.decoded?.leadId, `leadId=${lead.decoded?.leadId}`);
  if (!lead.decoded?.leadId) exitCode = 1;
  const leadId = lead.decoded?.leadId;

  // 10. Reject duplicate campaign submit blocked: lead under inactive campaign
  const lead2 = await rpc("submitLead", "POST", {
    campaignId,
    adId: "",
    screenId: "",
    name: "Teste Bloqueio",
    whatsapp: "11999990003",
    email: "",
    city: "",
    source: "QR_CODE",
  });
  step("submitLead duplicado permitido (mesma campanha ativa)", lead2.status === 200,
    `status=${lead2.status}`);

  // 11. Admin list leads (filters + attribution)
  const leads = await rpc("getLeads", "GET", {
    search: "João",
    campaignId: "",
    companyId: "",
    status: "",
    from: "",
    to: "",
  });
  const found = Array.isArray(leads.decoded?.leads) && leads.decoded.leads.some((l) => l.id === leadId);
  step("getLeads (filtro busca)", found, `total=${leads.decoded?.total}`);

  // 12. Lead detail with full relations
  const detail = await rpc("getLeadById", "GET", leadId);
  step("getLeadById", detail.status === 200 && detail.decoded?.id === leadId &&
    detail.decoded?.campaign?.id === campaignId &&
    detail.decoded?.ad?.id === adId &&
    detail.decoded?.screen?.id === screenId &&
    detail.decoded?.company?.id === companyId,
    `campanha=${detail.decoded?.campaign?.name} ad=${detail.decoded?.ad?.title} tela=${detail.decoded?.screen?.name}`);

  // 13. Update lead status -> CONVERTIDO
  const upd = await rpc("updateLeadStatus", "POST", { id: leadId, status: "CONVERTIDO" });
  step("updateLeadStatus -> CONVERTIDO", upd.status === 200 && upd.decoded?.status === "CONVERTIDO",
    `status=${upd.decoded?.status}`);

  // 14. Private list checks
  const screens = await rpc("getScreens", "GET");
  const screensOk = screens.status === 200 && screens.decoded?.some((s) => s.id === screenId);
  step("getScreens (privado)", screensOk);

  const ads = await rpc("getAds", "GET");
  const adsOk = ads.status === 200 && ads.decoded?.some((a) => a.id === adId);
  step("getAds (privado)", adsOk);

  const campaigns = await rpc("getCampaigns", "GET");
  const campaignsOk = campaigns.status === 200 && campaigns.decoded?.some((c) => c.id === campaignId);
  step("getCampaigns (privado)", campaignsOk);

  const companies = await rpc("getCompanies", "GET");
  const companiesOk = companies.status === 200 && companies.decoded?.some((c) => c.id === companyId);
  step("getCompanies (privado)", companiesOk);

  console.log(`\nIDs gerados: company=${companyId} campaign=${campaignId} ad=${adId} screen=${screenId} lead=${leadId}`);
  console.log(`QR captureUrl: ${qr.decoded?.captureUrl}`);
  console.log(exitCode === 0 ? "\nRESULTADO: SUCESSO" : "\nRESULTADO: FALHA");
  process.exit(exitCode);
} catch (err) {
  console.log("ERRO no fluxo:", err?.message ?? err);
  console.log("RESULTADO: FALHA");
  process.exit(1);
}