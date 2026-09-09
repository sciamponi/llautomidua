import { writeFileSync } from "node:fs";
import { toJSONAsync, fromCrossJSON } from "seroval";
import { defaultSerovalPlugins } from "@tanstack/router-core";

const plugins = defaultSerovalPlugins;
const BASE = "http://localhost:3000";
const FN = "/_serverFn/";
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
  let url = `${BASE}${FN}${IDS[name]}`;
  const headers = {
    "x-tsr-serverFn": "true",
    accept: "application/json",
    "sec-fetch-site": "same-origin",
  };
  if (cookie) headers["cookie"] = cookie;
  let body;
  if (method === "GET") {
    if (data !== undefined) {
      const serialized = JSON.stringify(
        await toJSONAsync({ data }, { plugins }),
      );
      url += `?${new URLSearchParams({ payload: serialized }).toString()}`;
    }
  } else {
    const serialized = JSON.stringify(
      await toJSONAsync({ data }, { plugins }),
    );
    body = serialized;
    headers["content-type"] = "application/json";
  }
  const res = await fetch(url, { method, headers, body, redirect: "manual" });
  const sc = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  const rawSetCookie = res.headers.get("set-cookie");
  for (const setCookie of [...sc, ...(rawSetCookie ? [rawSetCookie] : [])]) {
    const pair = setCookie.split(";")[0];
    if (pair.includes("automatiza_session")) cookie = pair;
  }
  const text = await res.text();
  let envelope = { result: undefined, error: undefined };
  try {
    const parsed = JSON.parse(text);
    if (res.headers.get("x-tss-serialized") === "true") {
      envelope = fromCrossJSON(parsed, { plugins }) ?? envelope;
    } else {
      envelope = { result: parsed, error: undefined };
    }
  } catch {
    envelope = { result: text, error: undefined };
  }
  return {
    status: res.status,
    result: envelope.result,
    error: envelope.error,
    text,
  };
}

const step = (label, ok, extra = "") =>
  console.log(`${ok ? "PASS" : "FAIL"} | ${label}${extra ? " | " + extra : ""}`);

let fails = 0;
const runSuffix = Date.now().toString(36);
const uid = (base) => `${base}-${runSuffix}`;
const check = (label, ok, extra = "") => {
  step(label, ok, extra);
  if (!ok) fails++;
};

try {
  const login = await rpc("login", "POST", {
    email: "admin@automatizasolucao.com.br",
    password: "admin36459235",
  });
  console.error("DEBUG cookie after login:", JSON.stringify(cookie));
  console.error("DEBUG login text:", login.text);
  check(
    "login (admin)",
    login.status === 200 && login.result?.success === true,
    `status=${login.status} user=${login.result?.user?.email}`,
  );

  const session = await rpc("getSessionUser", "GET");
  console.error("DEBUG session cookie sent:", JSON.stringify(cookie));
  console.error("DEBUG session text:", session.text);
  console.error("DEBUG session result:", JSON.stringify(session.result));
  check(
    "getSessionUser (sessão ativa)",
    session.result?.role === "ADMIN",
    `role=${session.result?.role ?? "n/a"}`,
  );

  const company = await rpc("createCompany", "POST", {
    name: uid("Empresa Teste E2E"),
    phone: "(11) 99999-0001",
    email: `${uid("contato")}@empresateste.com`,
    website: "https://empresateste.com",
    logo: "",
  });
  check("createCompany", !!company.result?.id, `id=${company.result?.id ?? "n/a"}`);
  const companyId = company.result?.id;

  const campaign = await rpc("createCampaign", "POST", {
    name: uid("Campanha Teste E2E"),
    description: "Campanha criada pelo teste ponta a ponta.",
    companyId,
    status: "DRAFT",
    ctaText: "QUERO SABER MAIS",
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    imageUrl: "",
  });
  check(
    "createCampaign",
    !!campaign.result?.id && campaign.result?.status === "DRAFT",
    `id=${campaign.result?.id ?? "n/a"} status=${campaign.result?.status ?? "n/a"}`,
  );
  const campaignId = campaign.result?.id;

  const activate = await rpc("updateCampaign", "POST", {
    id: campaignId,
    status: "ACTIVE",
  });
  check(
    "updateCampaign -> ACTIVE",
    activate.result?.status === "ACTIVE",
    `status=${activate.result?.status ?? "n/a"}`,
  );

  const ad = await rpc("createAd", "POST", {
    title: uid("Anúncio Teste E2E"),
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
  check("createAd", !!ad.result?.id, `id=${ad.result?.id ?? "n/a"}`);
  const adId = ad.result?.id;

  const screen = await rpc("createScreen", "POST", {
    name: uid("Tela Teste E2E"),
    identifier: uid("tela-teste-e2e"),
    location: "Centro, São Paulo/SP",
    establishment: "Estabelecimento Teste",
    status: "ACTIVE",
    currentCampaignId: campaignId,
    companyId,
  });
  console.error("DEBUG createScreen error:", JSON.stringify(screen.error)?.slice(0, 300));
  console.error("DEBUG createScreen text:", screen.text);
  writeFileSync("screen_err.json", screen.text);
  check("createScreen", !!screen.result?.id, `id=${screen.result?.id ?? "n/a"}`);
  const screenId = screen.result?.id;

  const qr = await rpc("generateQrCode", "GET", campaignId);
  check(
    "generateQrCode",
    typeof qr.result?.qrDataUrl === "string" &&
      qr.result?.captureUrl?.includes("/captura/"),
    `url=${qr.result?.captureUrl ?? "n/a"}`,
  );

  const capInfo = await rpc("getCampaignForCapture", "GET", campaignId);
  check(
    "getCampaignForCapture (público)",
    capInfo.result?.name === "Campanha Teste E2E" &&
      capInfo.result?.company?.name === "Empresa Teste E2E",
    `company=${capInfo.result?.company?.name ?? "n/a"}`,
  );

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
  check(
    "submitLead (público)",
    lead.result?.success === true && !!lead.result?.leadId,
    `leadId=${lead.result?.leadId ?? "n/a"}`,
  );
  const leadId = lead.result?.leadId;

  const lead2 = await rpc("submitLead", "POST", {
    campaignId,
    adId,
    screenId,
    name: "Maria Oliveira Teste",
    whatsapp: "11999990004",
    email: "",
    city: "Guarulhos",
    source: "QR_CODE",
  });
  check(
    "submitLead 2º lead (mesma campanha)",
    lead2.result?.success === true && !!lead2.result?.leadId,
    `leadId2=${lead2.result?.leadId ?? "n/a"}`,
  );

  const leads = await rpc("getLeads", "GET", {
    search: "João",
    campaignId: "",
    companyId: "",
    status: "",
    from: "",
    to: "",
  });
  const found =
    Array.isArray(leads.result?.leads) &&
    leads.result.leads.some((l) => l.id === leadId);
  check("getLeads (filtro busca)", found, `total=${leads.result?.total}`);

  const detail = await rpc("getLeadById", "GET", leadId);
  check(
    "getLeadById (relações)",
    detail.result?.id === leadId &&
      detail.result?.campaign?.id === campaignId &&
      detail.result?.ad?.id === adId &&
      detail.result?.screen?.id === screenId &&
      detail.result?.company?.id === companyId,
    `campanha=${detail.result?.campaign?.name} ad=${detail.result?.ad?.title} tela=${detail.result?.screen?.name} empresa=${detail.result?.company?.name}`,
  );

  const upd = await rpc("updateLeadStatus", "POST", {
    id: leadId,
    status: "CONVERTIDO",
  });
  check(
    "updateLeadStatus -> CONVERTIDO",
    upd.result?.status === "CONVERTIDO",
    `status=${upd.result?.status ?? "n/a"}`,
  );

  const screens = await rpc("getScreens", "GET");
  check(
    "getScreens (privado)",
    screens.result?.some((s) => s.id === screenId),
  );

  const ads = await rpc("getAds", "GET");
  check("getAds (privado)", ads.result?.some((a) => a.id === adId));

  const campaigns = await rpc("getCampaigns", "GET");
  check(
    "getCampaigns (privado)",
    campaigns.result?.some((c) => c.id === campaignId),
  );

  const companies = await rpc("getCompanies", "GET");
  check(
    "getCompanies (privado)",
    companies.result?.some((c) => c.id === companyId),
  );

  console.log(
    `\nIDs: company=${companyId} campaign=${campaignId} ad=${adId} screen=${screenId} lead=${leadId}`,
  );
  console.log(`QR: ${qr.result?.captureUrl}\n`);
  console.log(fails === 0 ? "RESULTADO: SUCESSO" : `RESULTADO: ${fails} CENÁRIO(S) COM FALHA`);
  process.exit(fails === 0 ? 0 : 1);
} catch (err) {
  console.log("ERRO no fluxo:", err?.message ?? err);
  process.exit(1);
}