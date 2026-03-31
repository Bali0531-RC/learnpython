import { PrismaClient } from "@prisma/client";

import { syncStaticContent } from "../src/lib/content-sync";

const prisma = new PrismaClient();

async function main() {
  const summary = await syncStaticContent(prisma);

  console.log(
    JSON.stringify(
      {
        ok: true,
        seeded: summary,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });