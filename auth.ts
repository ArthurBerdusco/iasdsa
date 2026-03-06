import NextAuth from "next-auth"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const authConfig = {
  adapter: NeonAdapter(pool),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const { neon } = await import("@neondatabase/serverless")
          const sql = neon(process.env.DATABASE_URL!)

          const [user] = await sql`
            SELECT id, email, name, role, password
            FROM users
            WHERE email = ${credentials.email as string}
          `

          if (!user || !user.password) return null

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          )

          if (!isValid) return null

          // ✅ Retorna role aqui — será usado no callback jwt
          return {
            id: String(user.id),
            email: user.email as string,
            name: user.name as string,
            role: user.role as string,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  // ✅ Usar JWT — funciona com Credentials E com tipagem correta
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Na primeira vez (login), user está disponível
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? "user"
      }

      // Google login: buscar role no banco
      if (account?.provider === "google" && token.email) {
        try {
          const { neon } = await import("@neondatabase/serverless")
          const sql = neon(process.env.DATABASE_URL!)
          const [dbUser] = await sql`
            SELECT role FROM users WHERE email = ${token.email}
          `
          token.role = dbUser?.role ?? "user"
        } catch (e) {
          console.error("Erro ao buscar role:", e)
        }
      }

      return token
    },
    async session({ session, token }) {
      // ✅ Propagar token → session
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)