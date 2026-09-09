import { createServerFn } from "@tanstack/react-start";
import { compare } from "bcryptjs";
import { getCookie, setCookie, deleteCookie, getRequestIP } from "@tanstack/react-start/server";
import { prisma } from "./prisma.server";

const SESSION_COOKIE_NAME = "automatiza_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const requireAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getSessionUserInternal();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
});

export async function getSessionUserInternal() {
  const sessionId = getCookie(SESSION_COOKIE_NAME);

  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: { select: { id: true, email: true, name: true, role: true } },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
    return null;
  }

  return session.user;
}

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
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const isValid = await compare(data.password, user.password);
    if (!isValid) {
      throw new Error("Credenciais inválidas");
    }

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000),
      },
    });

    setCookie(SESSION_COOKIE_NAME, session.id, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const sessionId = getCookie(SESSION_COOKIE_NAME);

  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }
  deleteCookie(SESSION_COOKIE_NAME, { path: "/" });

  return { success: true };
});

export const getSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  return await getSessionUserInternal();
});

export async function getAdminUserInternal() {
  const user = await getSessionUserInternal();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

export const getClientIp = () => {
  try {
    return getRequestIP({ xForwardedFor: true });
  } catch {
    return undefined;
  }
};
