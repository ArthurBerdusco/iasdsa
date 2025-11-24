import type { Metadata } from "next";
import { Roboto, Montserrat, Nunito } from "next/font/google";

// Primary font - Roboto for body text and general content
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
    <div className={`${roboto.className} antialiased font-layout`}>
      {children}
    </div>
  );
}