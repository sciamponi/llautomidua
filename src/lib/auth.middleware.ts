import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./auth.functions";
import { UserRole, AuthScope } from "@prisma/client";

/**
 * Middleware to require authentication
 */
export const authMiddleware = createMiddleware().handler(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return next({ context: { session } });
});

/**
 * Middleware to require a specific role/scope
 */
export const roleMiddleware = (allowedRoles: UserRole[], scope?: AuthScope) => 
  createMiddleware()
    .middleware([authMiddleware])
    .handler(async ({ context, next }) => {
      const { session } = context;
      
      const hasPermission = session.user.roles.some(r => {
        const roleMatches = allowedRoles.includes(r.role);
        const scopeMatches = !scope || r.scope === scope || r.scope === "GLOBAL";
        return roleMatches && scopeMatches;
      });

      if (!hasPermission) {
        throw new Error("Forbidden: Insufficient permissions");
      }

      return next();
    });

/**
 * MASTER_ADMIN only middleware
 */
export const masterOnlyMiddleware = roleMiddleware(["MASTER_ADMIN"], "GLOBAL");
