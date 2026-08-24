import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./auth.functions";
import { UserRole, AuthScope } from "./prisma-enums";

// Sessão simulada para o ambiente de preview (sem banco de dados configurado).
const PREVIEW_SESSION = {
  user: {
    id: "preview-master",
    name: "Preview Master",
    email: "preview@automatizasolucao.com.br",
    roles: [{ role: "MASTER_ADMIN", scope: "GLOBAL" }],
  },
};

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  if (!process.env['DATABASE_URL']) {
    return next({ context: { session: PREVIEW_SESSION } });
  }
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
