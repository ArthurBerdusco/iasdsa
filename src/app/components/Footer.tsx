// components/Footer.tsx
// ─── Rodapé padrão ───────────────────────────────────────────────────────────
// Padronizado com os tokens do tema. Antes usava cores fixas (bg-gray-800)
// que quebravam a identidade visual escolhida no admin.

import Link from "next/link";
import { MapPin, Youtube, Instagram, Facebook, ScrollText } from "lucide-react";
import Container from "./ui/Container";

const LINKS = [
  { label: "Boletins Anteriores", href: "/boletins", icon: ScrollText },
  { label: "Pedido de Oração", href: "#oracao", icon: null },
  { label: "Dízimos e Ofertas", href: "/dizimos-ofertas", icon: null },
];

const SOCIALS = [
  { label: "YouTube", href: "https://www.youtube.com", icon: Youtube },
  { label: "Instagram", href: "https://www.instagram.com", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com", icon: Facebook },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--color-border)] bg-[var(--color-background-alt)] pb-8 pt-14 text-[var(--color-text)]">
      <Container size="lg">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold">Igreja Adventista de Santo Amaro</h3>
            <p className="mt-3 flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
              <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }} />
              Rua Comendador Elias Zarzur, 86 — Santo Amaro, São Paulo - SP, 04736-000
            </p>

            <div className="mt-4 flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              Links Rápidos
            </h4>
            <ul className="mt-3 space-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {link.icon && <link.icon size={14} />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mapa */}
          <div>
            <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
              Como Chegar
            </h4>
            <iframe
              className="h-48 w-full rounded-[var(--border-radius)] border border-[var(--color-border)]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.68259630769!2d-46.704111924667096!3d-23.651535478738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce515a90a79dc9%3A0x7d73a6a088c82b04!2sIASD%20Santo%20Amaro!5e0!3m2!1spt-PT!2sbr!4v1743643531525!5m2!1spt-PT!2sbr"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa da Igreja Adventista de Santo Amaro"
            />
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-sm text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} IASD Santo Amaro. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
}
