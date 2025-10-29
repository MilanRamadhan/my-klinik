const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@gmail.com";
  const password = "adminadmin";

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Administrator",
      password: hashed,
    },
    create: {
      email,
      name: "Administrator",
      password: hashed,
    },
  });

  console.log("Admin user upserted:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
