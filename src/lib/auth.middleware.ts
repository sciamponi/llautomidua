import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./auth.functions";
import { UserRole, AuthScope } from "@prisma/client";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return next({ context: { session } });
});

export const roleMiddleware = (allowedRoles: UserRole[], scope?: AuthScope) => 
  createMiddleware()
    .middleware([authMiddleware])
    .server(async ({ context, next }) => {
      const { session } = context as any;
      
      const hasPermission = session.user.roles.some((r: any) => {
        const roleMatches = allowedRoles.includes(r.role);
        const scopeMatches = !scope || r.scope === scope || r.scope === "GLOBAL";
        return roleMatches && scopeMatches;
      });

      if (!hasPermission) {
        throw new Error("Forbidden: Insufficient permissions");
      }

      return next();
    });

export const masterOnlyMiddleware = roleMiddleware(["MASTER_ADMIN"], AuthScope.GLOBAL);
