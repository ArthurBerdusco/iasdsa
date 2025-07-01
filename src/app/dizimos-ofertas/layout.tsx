import type { Metadata } from "next";
import { Roboto, Montserrat, Nunito } from "next/font/google";
import "../globals.css";

// Primary font - Roboto for body text and general content
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Secondary font - Montserrat for headings and important elements
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Tertiary font - Nunito for softer, warmer elements
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Igreja Adventista Santo Amaro - Boletim Informativo",
  description: "Boletim informativo da Igreja Adventista do Sétimo Dia de Santo Amaro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.className} antialiased`}>
        <div className="font-layout">
          {children}
        </div>
      </body>
    </html>
  );
}