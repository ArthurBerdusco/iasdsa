// auth.ts (raiz do projeto)
import NextAuth from "next-auth"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const { handlers, auth, signIn, signOut } = NextAuth({
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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // Para queries customizadas, use o neon client
          const { neon } = await import("@neondatabase/serverless")
          const sql = neon(process.env.DATABASE_URL!)

          // Buscar usuário no banco
          const [user] = await sql`
            SELECT * FROM users 
            WHERE email = ${credentials.email as string}
          `

          if (!user) return null

          // Verificar senha
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      session.user.role = (user as { role?: string }).role ?? "user"
      return session
    }
    // ❌ Sem callback jwt
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
})