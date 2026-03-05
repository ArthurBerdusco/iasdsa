// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { auth } from "@auth"

const sql = neon(process.env.DATABASE_URL!)

// ─── PUT /api/admin/users/[id] — atualizar usuário completo ──────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { id: rawId } = await params
  const id = Number(rawId)
  const body = await req.json()
  const { name, email, role, permissions, active, password } = body

  if (!name || !email) {
    return NextResponse.json({ message: "Nome e e-mail são obrigatórios" }, { status: 400 })
  }

  // Check duplicate email (ignore self)
  const [existing] = await sql`
    SELECT id FROM users WHERE email = ${email} AND id != ${id}
  `
  if (existing) {
    return NextResponse.json({ message: "E-mail já utilizado por outro usuário" }, { status: 409 })
  }

  const permsJson = JSON.stringify(permissions ?? [])

  if (password) {
    // Update with new password
    const hashedPassword = await bcrypt.hash(password, 12)
    const [user] = await sql`
      UPDATE users SET
        name        = ${name},
        email       = ${email},
        role        = ${role},
        permissions = ${permsJson}::jsonb,
        active      = ${active},
        password    = ${hashedPassword}
      WHERE id = ${id}
      RETURNING id, name, email, "emailVerified", image, role, permissions, active, "createdAt",
                (password IS NOT NULL) AS "hasPassword"
    `
    return NextResponse.json(user)
  } else {
    // Update without touching password
    const [user] = await sql`
      UPDATE users SET
        name        = ${name},
        email       = ${email},
        role        = ${role},
        permissions = ${permsJson}::jsonb,
        active      = ${active}
      WHERE id = ${id}
      RETURNING id, name, email, "emailVerified", image, role, permissions, active, "createdAt",
                (password IS NOT NULL) AS "hasPassword"
    `
    return NextResponse.json(user)
  }
}

// ─── PATCH /api/admin/users/[id] — atualização parcial (ex: toggle active) ───
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { id: rawId } = await params
  const id = Number(rawId)
  const body = await req.json()

  if (typeof body.active === "boolean") {
    const [user] = await sql`
      UPDATE users SET active = ${body.active} WHERE id = ${id}
      RETURNING id, active
    `
    return NextResponse.json(user)
  }

  return NextResponse.json({ message: "Nenhuma alteração aplicada" }, { status: 400 })
}

// ─── DELETE /api/admin/users/[id] ────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { id: rawId } = await params
  const id = Number(rawId)

  // Remove relacionamentos primeiro
  await sql`DELETE FROM sessions WHERE "userId" = ${id}`
  await sql`DELETE FROM accounts WHERE "userId" = ${id}`
  await sql`DELETE FROM users    WHERE id       = ${id}`

  return NextResponse.json({ success: true })
}