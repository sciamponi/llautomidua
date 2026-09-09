import { toJSONAsync } from "seroval";
import { defaultSerovalPlugins } from "@tanstack/router-core";

const loginId = "eyJmaWxlIjoiL3NyYy9saWIvYXV0aC50cz90c3Mtc2VydmVyZm4tc3BsaXQiLCJleHBvcnQiOiJsb2dpbl9jcmVhdGVTZXJ2ZXJGbl9oYW5kbGVyIn0";
const body = JSON.stringify(await toJSONAsync({ data: { email: "admin@automatizasolucao.com.br", password: "admin36459235" } }, { plugins: defaultSerovalPlugins }));

const variants = [
  `/_serverFn/${loginId}`,
  `/_serverfn/${loginId}`,
  `/_serverFn/${loginId}/`,
  `/_serverfn/${loginId}/`,
  `/api/_serverFn/${loginId}`,
];

for (const path of variants) {
  try {
    const res = await fetch(`http://localhost:3000${path}`, {
      method: "POST",
      headers: { "x-tsr-serverFn": "true", accept: "application/json", "content-type": "application/json" },
      body,
    });
    const text = await res.text();
    console.log(`${res.status} | ${path} | ${text.slice(0, 200)}`);
  } catch (e) {
    console.log(`ERR | ${path} | ${e.message}`);
  }
}