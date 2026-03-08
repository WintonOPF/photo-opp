import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role,
    },
    create: {
      name,
      email,
      passwordHash,
      role,
    },
  });
}

async function main() {
  await upsertUser({
    name: "admin",
    email: "admin@photoopp.local",
    password: "admin",
    role: "ADMIN",
  });

  await upsertUser({
    name: "Promoter User",
    email: "promoter@photoopp.local",
    password: "123456",
    role: "PROMOTER",
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
