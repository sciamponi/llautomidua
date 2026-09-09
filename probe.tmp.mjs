import { toJSONAsync, fromJSON } from "seroval";
import { defaultSerovalPlugins } from "@tanstack/router-core";

const loginId = "eyJmaWxlIjoiL3NyYy9saWIvYXV0aC50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJsb2dpbl9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0";
const body = JSON.stringify(await toJSONAsync({ data: { email: "admin@automatizasolucao.com.br", password: "admin36459235" } }, { plugins: defaultSerovalPlugins }));

const res = await fetch(`http://localhost:3000/_serverFn/${loginId}`, {
  method: "POST",
  headers: {
    "x-tsr-serverFn": "true",
    accept: "application/json",
    "sec-fetch-site": "same-origin",
    "content-type": "application/json",
  },
  body,
});
const text = await res.text();
console.log("status:", res.status);
console.log("content-type:", res.headers.get("content-type"));
console.log("x-tss-serialized:", res.headers.get("x-tss-serialized"));
console.log("set-cookie:", res.headers.get("set-cookie"));
console.log("body:", text.slice(0, 500));
try {
  const decoded = fromJSON(JSON.parse(text), { plugins: defaultSerovalPlugins });
  console.log("decoded:", JSON.stringify(decoded));
} catch (e) {
  console.log("decode error:", e.message);
}