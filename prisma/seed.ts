/**
 * Seed script — creates the initial admin user.
 * Run via: npm run db:seed
 *
 * Environment variables:
 *   ADMIN_SEED_EMAIL    (default: admin@synaplan.com)
 *   ADMIN_SEED_NAME     (default: Admin)
 *   ADMIN_SEED_PASSWORD (required)
 *   DATABASE_URL        (required)
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL ?? "admin@synaplan.com";
  const name = process.env.ADMIN_SEED_NAME ?? "Admin";
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_SEED_PASSWORD is required for seeding");
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { name, password: hash },
    create: { email, name, password: hash },
  });

  console.log(`✓ Admin user ready: ${user.email} (id: ${user.id})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
