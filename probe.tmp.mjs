import { toJSONAsync, fromCrossJSON } from "seroval";
import { defaultSerovalPlugins } from "@tanstack/router-core";

const plugins = defaultSerovalPlugins;
const BASE = "http://localhost:3000";
const FN = "/_serverFn/";

const IDS = {
  login: "eyJmaWxlIjoiL3NyYy9saWIvYXV0aC50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJsb2dpbl9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
  getSessionUser: "eyJmaWxlIjoiL3NyYy9saWIvYXV0aC50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJnZXRTZXNzaW9uVXNlcl9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0",
};

async function call(name, method, data, cookieHeader) {
  let url = `${BASE}${FN}${IDS[name]}`;
  const headers = {
    "x-tsr-serverFn": "true",
    accept: "application/json",
    "sec-fetch-site": "same-origin",
  };
  if (cookieHeader) headers["cookie"] = cookieHeader;
  let body;
  if (method === "GET") {
    if (data !== undefined) {
      url += `?${new URLSearchParams({ payload: JSON.stringify(await toJSONAsync({ data }, { plugins })) }).toString()}`;
    }
  } else {
    body = JSON.stringify(await toJSONAsync({ data }, { plugins }));
    headers["content-type"] = "application/json";
  }
  const res = await fetch(url, { method, headers, body, redirect: "manual" });
  const text = await res.text();
  return { status: res.status, setCookie: res.headers.get("set-cookie"), text };
}

const login = await call("login", "POST", { email: "admin@automatizasolucao.com.br", password: "admin36459235" });
console.log("login status:", login.status);
console.log("login set-cookie:", login.setCookie);
const cookie = login.setCookie.split(";")[0];
console.log("cookie:", cookie);

const ses1 = await call("getSessionUser", "GET", undefined, cookie);
console.log("\nwith cookie:  status=", ses1.status, "body=", ses1.text.slice(0, 220));
const ses2 = await call("getSessionUser", "GET", undefined, undefined);
console.log("\nno cookie:    status=", ses2.status, "body=", ses2.text.slice(0, 220));