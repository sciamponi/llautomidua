import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { roleMiddleware } from "./auth.middleware";


const SESSION_COOKIE_NAME = "auth_token";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);
  const hashArray = Array.from(new Uint8Array(exportedKey));
  const saltArray = Array.from(salt);
  
  return btoa(JSON.stringify({
    salt: saltArray,
    hash: hashArray
  }));
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const { salt, hash } = JSON.parse(atob(storedHash));
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(salt),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    const exportedKey = await crypto.subtle.exportKey("raw", key);
    const derivedHash = Array.from(new Uint8Array(exportedKey));
    
    return derivedHash.every((val, i) => val === hash[i]);
  } catch (e) {
    return false;
  }
}

function generateToken(): string {
  return crypto.randomUUID();
}

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export const login = createServerFn({ method: "POST" })
  .validator(z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }))
  .handler(async ({ data }) => {
    const { email, password } = data;
    
    if (!process.env['DATABASE_URL']) {
      throw new Error("Database not configured");
    }

    const { prisma } = await import("@/lib/prisma.server");
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        roles: {
          include: {
            company: true,
            product: true
          }
        } 
      }
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new Error("Credenciais inválidas");
    }

    const token = generateToken();
    const tokenHash = await hashToken(token);
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      }
    });

    setCookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_DURATION / 1000,
    });

    const primaryRole = user.roles[0]?.role || "CUSTOMER";
    let redirect = "/";
    if (["MASTER_ADMIN", "ADMIN", "OPERATOR"].includes(primaryRole)) redirect = "/admin";
    else if (primaryRole === "PARTNER") redirect = "/membros";
    else if (primaryRole === "CUSTOMER") redirect = "/cliente";

    return { success: true, redirect };
  });

export const logout = createServerFn({ method: "POST" })
  .handler(async () => {
    const cookies = parseCookies();
    const token = cookies[SESSION_COOKIE_NAME];

    if (token && process.env['DATABASE_URL']) {
      const { prisma } = await import("@/lib/prisma.server");
      const tokenHash = await hashToken(token);
      await prisma.session.deleteMany({
        where: { tokenHash }
      });
    }

    deleteCookie(SESSION_COOKIE_NAME, { path: "/" });
    return { success: true, redirect: "/login" };
  });

export const getSession = createServerFn({ method: "GET" })
  .handler(async () => {
    const cookies = parseCookies();
    const token = cookies[SESSION_COOKIE_NAME];

    if (!token || !process.env['DATABASE_URL']) return null;

    const { prisma } = await import("@/lib/prisma.server");
    const tokenHash = await hashToken(token);

    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            roles: {
              include: {
                company: true,
                product: true
              }
            }
          }
        }
      }
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    prisma.session.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() }
    }).catch(() => {});

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        roles: session.user.roles,
      },
      activeCompanyId: session.activeCompanyId,
      activeProductId: session.activeProductId,
    };
  });

export const bootstrapMaster = createServerFn({ method: "POST" })
  .validator(z.object({
    secret: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(12),
  }))
  .handler(async ({ data }) => {
    const BOOTSTRAP_SECRET = process.env['BOOTSTRAP_SECRET'];
    if (!BOOTSTRAP_SECRET || data.secret !== BOOTSTRAP_SECRET) {
      throw new Error("Unauthorized bootstrap attempt");
    }

    const { prisma } = await import("@/lib/prisma.server");
    
    const existingMaster = await prisma.userRoleMapping.findFirst({
      where: { role: "MASTER_ADMIN" }
    });

    if (existingMaster) {
      throw new Error("MASTER_ADMIN already exists");
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        roles: {
          create: {
            role: "MASTER_ADMIN",
            scope: "GLOBAL"
          }
        }
      }
    });

    return { success: true, userId: user.id };
  });

export const getUsers = createServerFn({ method: "GET" })
  .middleware([roleMiddleware(["MASTER_ADMIN", "ADMIN"])])
  .handler(async () => {
    if (!process.env['DATABASE_URL']) return [];
    const { prisma } = await import("@/lib/prisma.server");
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            company: true,
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return JSON.parse(JSON.stringify(users));
  });

