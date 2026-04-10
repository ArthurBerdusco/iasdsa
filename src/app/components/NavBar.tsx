"use client";
// hooks/useScrollDirection.ts
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Link as ScrollLink } from "react-scroll";

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

export default function NavBar() {
const { scrollDir, isAtTop } = useScrollDirection();

  const logo = "/images/logo_2.png";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false); // Fecha o menu ao clicar em um link
  
  return (
    <nav
      className={`
        bg-white border-gray-200 fixed top-0 w-full z-50
        transition-transform duration-300 ease-in-out
        ${!isAtTop && "shadow-md"}
        ${scrollDir === "down" && !isAtTop ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
            unoptimized  
            src={logo}
            alt="Logo Igreja Adventista do Sétimo Dia"
            width={150}
            height={150}
            className="rounded"
            priority
          />
        </Link>
        
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-600 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Abrir menu principal</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        
        <div className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-white md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            {[
              { label: "Cultos", to: "cultos" },
              { label: "Programação", to: "programacao" },
              { label: "Anúncios", to: "anuncios" },
              { label: "Oração", to: "oracao" },
              { label: "Dízimo", to: "dizimo" },
              { label: "Fotos", to: "fotos" },
            ].map((item) => (
              <li key={item.to}>
                <ScrollLink
                  to={item.to}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-80}
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 relative group cursor-pointer select-none"
                  onClick={closeMenu}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}