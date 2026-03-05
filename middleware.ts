import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = (req.auth?.user as { role?: string })?.role

  const pathname = nextUrl.pathname

  const isAdminRoute = pathname.startsWith('/admin')
  const isAuthRoute = pathname.startsWith('/auth')

  console.log(isAdminRoute)
  console.log(isAuthRoute)

  // ← Verifica isLoggedIn também, não só role
  if (isAdminRoute && (!isLoggedIn || role !== 'admin')) {
    return NextResponse.redirect(new URL('/unauthorized', nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Roda em tudo EXCETO arquivos estáticos e imagens — mas INCLUI /api/auth
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)',
  ],
}