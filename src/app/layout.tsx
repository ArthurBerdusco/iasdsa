// app/layout.tsx
import type { Metadata } from "next";
import { getTheme, generateCSSVariables, generateGoogleFontsURL } from "@/lib/theme-repository";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Igreja Adventista Santo Amaro - Boletim Informativo",
  description: "Boletim informativo da Igreja Adventista do Sétimo Dia de Santo Amaro",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = await getTheme();
  const cssVars = generateCSSVariables(theme);
  const fontsURL = generateGoogleFontsURL(theme);

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsURL} />
        {/* CSS vars injetadas uma única vez aqui — fonte da verdade */}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className="antialiased">
        {/*
          ThemeProvider aqui — wraps toda a app.
          Componentes acessam via useTheme() sem precisar de prop drilling.
          Como layout.tsx é Server Component, usamos um wrapper client:
        */}
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}