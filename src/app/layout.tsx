import type { Metadata } from "next";
import { getTheme, generateCSSVariables, generateGoogleFontsURL } from "@/lib/theme-repository";
import "./globals.css";

export const metadata: Metadata = {
  title: "Igreja Adventista Santo Amaro - Boletim Informativo",
  description: "Boletim informativo da Igreja Adventista do Sétimo Dia de Santo Amaro",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Busca o tema no Neon — server-side, sem custo extra de rede
  const theme = await getTheme();
  const cssVars = generateCSSVariables(theme);
  const fontsURL = generateGoogleFontsURL(theme);

  return (
    <html lang="pt-BR">
      <head>
        {/* Fontes dinâmicas do Google — trocam junto com o tema */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsURL} />

        {/* CSS variables injetadas via SSR — refletem o tema salvo no banco */}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}