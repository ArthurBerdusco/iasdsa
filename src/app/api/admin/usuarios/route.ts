// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { auth } from "@auth"

const sql = neon(process.env.DATABASE_URL!)

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const users = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u."emailVerified",
      u.image,
      u.role,
      u.permissions,
      u.active,
      u."createdAt",
      (u.password IS NOT NULL) AS "hasPassword"
    FROM users u
    ORDER BY u."createdAt" DESC
  `

  return NextResponse.json(users)
}

// ─── POST /api/admin/users ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {

  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, email, role, permissions, active, password } = body

  if (!name || !email) {
    return NextResponse.json({ message: "Nome e e-mail são obrigatórios" }, { status: 400 })
  }

  // Check duplicate email
  const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`
  if (existing) {
    return NextResponse.json({ message: "E-mail já cadastrado" }, { status: 409 })
  }

  const hashedPassword = password ? await bcrypt.hash(password, 12) : null
  const permsJson = JSON.stringify(permissions ?? [])

  const [user] = await sql`
    INSERT INTO users (name, email, role, permissions, active, password, "createdAt")
    VALUES (
      ${name},
      ${email},
      ${role ?? "viewer"},
      ${permsJson}::jsonb,
      ${active ?? true},
      ${hashedPassword},
      NOW()
    )
    RETURNING id, name, email, "emailVerified", image, role, permissions, active, "createdAt",
              (password IS NOT NULL) AS "hasPassword"
  `

  return NextResponse.json(user, { status: 201 })
}