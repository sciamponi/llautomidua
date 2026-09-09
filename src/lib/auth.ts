import { createServerFn } from "@tanstack/react-start";

export const requireAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminUserInternal } = await import("./session.server");
  return await getAdminUserInternal();
});

export const login = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object") {
      throw new Error("Email e senha são obrigatórios");
    }
    const { email, password } = data as { email?: unknown; password?: unknown };
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Email e senha são obrigatórios");
    }
    return { email: email.toLowerCase().trim(), password };
  })
  .handler(async ({ data }) => {
    const { loginInternal } = await import("./session.server");
    return loginInternal(data);
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutInternal } = await import("./session.server");
  return logoutInternal();
});

export const getSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUserInternal } = await import("./session.server");
  return await getSessionUserInternal();
});

export async function getSessionUserInternal() {
  const m = await import("./session.server");
  return m.getSessionUserInternal();
}

export async function getAdminUserInternal() {
  const m = await import("./session.server");
  return m.getAdminUserInternal();
}

export async function getClientIp() {
  const m = await import("./session.server");
  return m.getClientIp();
}