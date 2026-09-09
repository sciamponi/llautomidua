import { hash } from "bcryptjs";

const ADMIN_EMAIL = "admin@automatizasolucao.com.br";
const ADMIN_PASSWORD = "admin36459235";

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingUser) {
      console.log("Admin user already exists. Skipping seed.");
      return;
    }

    const hashedPassword = await hash(ADMIN_PASSWORD, 12);

    const adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: "Administrador",
        role: "ADMIN",
      },
    });

    console.log(`Admin user created: ${adminUser.email} (id: ${adminUser.id})`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
