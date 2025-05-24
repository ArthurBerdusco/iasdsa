'use client'
// SideNav.jsx - Barra de navegação lateral responsiva
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Users,
  FileText,
  Image,
  MessageSquare,
  Settings,
  Mic,
  ChevronLeft,
  LogOut,
  X,
  Youtube,
  SquareArrowOutUpRight
} from 'lucide-react';

import { Dispatch, SetStateAction } from 'react';

interface SideNavProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}



export function SideNav({ collapsed, setCollapsed, isMobile, isOpen, setIsOpen }: SideNavProps) {
  const pathname = usePathname();
  const sideNavRef = useRef<HTMLDivElement | null>(null);

  // Fechar o menu ao clicar fora em dispositivos móveis
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isOpen &&
        sideNavRef.current &&
        !sideNavRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, setIsOpen]);

  // Navegação principal
  const navItems = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, href: '/admin' },
    { name: 'Cultos', icon: <Calendar className="w-5 h-5" />, href: '/admin/cultos' },
    { name: 'Oradores', icon: <Mic className="w-5 h-5" />, href: '/admin/oradores' },
    { name: 'Anúncios', icon: <FileText className="w-5 h-5" />, href: '/admin/anuncios' },
    { name: 'Galeria de Fotos', icon: <Image className="w-5 h-5" />, href: '/admin/fotos' },
    { name: 'Mensagem Pastoral', icon: <MessageSquare className="w-5 h-5" />, href: '/admin/mensagem-pastoral' },
    { name: 'Últimos Cultos', icon: <Youtube className="w-5 h-5" />, href: '/admin/ultimos-cultos' },
  ];

  // Determina se o sidebar é visível ou não
  const isVisible = isMobile ? isOpen : true;

  if (!isVisible) return null;

  return (
    <aside
      ref={sideNavRef}
      className={`
        bg-blue-900 text-white transition-all duration-300 flex flex-col z-20
        ${isMobile
          ? 'fixed top-16 left-0 h-[calc(100vh-4rem)] shadow-lg'
          : 'fixed left-0 top-16 h-[calc(100vh-4rem)]'
        }
        ${collapsed && !isMobile ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className={`${collapsed && !isMobile ? 'px-3 justify-center' : 'px-6 justify-between'} py-4 flex items-center`}>
        {(!collapsed || isMobile) && (
          <div>
            <Link href={"/admin"}>
              <h1 className="text-xl font-bold">Admin</h1>
            </Link>
            <p className="text-blue-200 text-xs">Painel Administrativo</p>
          </div>
        )}

        {collapsed && !isMobile && (
          <div className="mx-auto">
            <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
              <Link href={"/admin"}>
                <Home className="w-6 h-6" />
              </Link>
            </div>
          </div>
        )}

        {isMobile ? (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-blue-800 text-blue-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-blue-800 text-blue-200 hover:text-white"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div
                    className={`
                      flex items-center 
                      ${collapsed && !isMobile ? 'justify-center px-3' : 'px-6'} 
                      py-3
                      ${isActive
                        ? 'bg-blue-800 text-white border-l-4 border-white'
                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                      }
                      transition-colors
                    `}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <span className={`${collapsed && !isMobile ? '' : 'mr-3'}`}>{item.icon}</span>
                    {(!collapsed || isMobile) && (
                      <span className="text-sm whitespace-nowrap">{item.name}</span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className={`${collapsed && !isMobile ? 'px-3 justify-center' : 'px-6'} py-4 mt-auto border-t border-blue-800`}>
        <div className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : ''}`}>
          {(!collapsed || isMobile) && (
            <div className="ml-3">

              <Link href="/" target='_blank'>
                <div className="flex items-center text-xs text-blue-300 cursor-pointer hover:text-white">
                  <SquareArrowOutUpRight className="w-3 h-3 mr-1" />
                  <p className="font-medium text-sm">Ver Página Principal</p>
                  <span></span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* User section */}
      <div className={`${collapsed && !isMobile ? 'px-3 justify-center' : 'px-6'} py-4 mt-auto border-t border-blue-800`}>
        <div className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="ml-3">
              <p className="font-medium text-sm">Administrador</p>
              <Link href="/logout">
                <div className="flex items-center text-xs text-blue-300 cursor-pointer hover:text-white">
                  <LogOut className="w-3 h-3 mr-1" />
                  <span>Sair</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}