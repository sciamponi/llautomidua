import { toJSONAsync } from "seroval";

const payload = { data: { email: "admin@automatizasolucao.com.br", password: "admin36459235" } };
const json = JSON.stringify(await toJSONAsync(payload));
console.log("BODY:", json);