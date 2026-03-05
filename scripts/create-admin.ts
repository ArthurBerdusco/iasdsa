// scripts/create-admin.ts
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  const password = "Admin@123456" // troque depois
  const hash = await bcrypt.hash(password, 12)

  const [user] = await sql`
    INSERT INTO users (name, email, role, permissions, active, password, "createdAt")
    VALUES (
      'Admin',
      'admin@empresa.com',
      'admin',
      '["users:read","users:write","users:delete","content:read","content:write","content:delete","settings:read","settings:write","reports:read","reports:export"]'::jsonb,
      true,
      ${hash},
      NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
      password    = ${hash},
      role        = 'admin',
      permissions = '["users:read","users:write","users:delete","content:read","content:write","content:delete","settings:read","settings:write","reports:read","reports:export"]'::jsonb,
      active      = true
    RETURNING id, email, role
  `

  console.log("✅ Admin criado:", user)
  process.exit(0)
}

main().catch((e) => { console.error("❌ Erro:", e); process.exit(1) })