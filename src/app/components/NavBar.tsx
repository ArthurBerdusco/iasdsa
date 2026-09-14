"use client";
// components/NavBar.tsx
// ─── Barra de navegação pública ─────────────────────────────────────────────
// Padronizada para usar os tokens do tema (--color-*) em vez de cores fixas
// do Tailwind (bg-white, text-gray-900...), garantindo que a navbar sempre
// reflita a identidade visual escolhida no admin.

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X, ScrollText } from "lucide-react";
import Container from "./ui/Container";

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    const handler = () => {
      const currentY = window.scrollY;
      setIsAtTop(currentY < 10);
      setScrollDir(currentY > lastY ? "down" : "up");
      lastY = currentY;
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return { scrollDir, isAtTop };
}

const NAV_ITEMS = [
  { label: "Cultos", to: "cultos" },
  { label: "Programação", to: "programacao" },
  { label: "Anúncios", to: "anuncios" },
  { label: "Oração", to: "oracao" },
  { label: "Dízimo", to: "dizimo" },
  { label: "Fotos", to: "fotos" },
];

export default function NavBar() {
  const { scrollDir, isAtTop } = useScrollDirection();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${!isAtTop ? "shadow-md" : ""
        } ${scrollDir === "down" && !isAtTop ? "-translate-y-full" : "translate-y-0"}`}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
            <Image
              unoptimized
              src="/images/logo_2.png"
              alt="Logo Igreja Adventista do Sétimo Dia"
              width={500}
              height={120}
              className="h-10 w-auto rounded"
              priority
            />
          </Link>

          {/* Menu desktop */}
          <ul className="hidden items-center gap-1 md:flex">
            {isHome &&
              NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <ScrollLink
                    to={item.to}
                    smooth
                    duration={500}
                    spy
                    offset={-80}
                    activeClass="!text-[var(--color-primary)]"
                    className="relative cursor-pointer select-none rounded-[var(--border-radius)] px-3.5 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
                  >
                    {item.label}
                  </ScrollLink>
                </li>
              ))}
            <li>
              <Link
                href="/boletins"
                className="flex items-center gap-1.5 rounded-[var(--border-radius)] px-3.5 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
              >
                <ScrollText size={15} />
                Boletins Anteriores
              </Link>
            </li>
          </ul>

          {/* Botão do menu mobile */}
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--border-radius)] text-[var(--color-text)] hover:bg-[var(--color-background-alt)] md:hidden"
            aria-controls="navbar-mobile"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Abrir menu principal</span>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div id="navbar-mobile" className="border-t border-[var(--color-border)] py-3 md:hidden">
            <ul className="flex flex-col gap-1">
              {isHome &&
                NAV_ITEMS.map((item) => (
                  <li key={item.to}>
                    <ScrollLink
                      to={item.to}
                      smooth
                      duration={500}
                      spy
                      offset={-80}
                      onClick={closeMenu}
                      className="block cursor-pointer select-none rounded-[var(--border-radius)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background-alt)]"
                    >
                      {item.label}
                    </ScrollLink>
                  </li>
                ))}
              <li>
                <Link
                  href="/boletins"
                  onClick={closeMenu}
                  className="flex items-center gap-1.5 rounded-[var(--border-radius)] px-3 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background-alt)]"
                >
                  <ScrollText size={15} />
                  Boletins Anteriores
                </Link>
              </li>
            </ul>
          </div>
        )}
      </Container>
    </nav>
  );
}
