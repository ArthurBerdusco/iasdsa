'use client'
// SideNav.tsx - Barra de navegação lateral otimizada
import { useEffect, useRef, useState, useCallback } from 'react';
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
  SquareArrowOutUpRight,
  ChevronRight,
  LayoutDashboard,
  Bell
} from 'lucide-react';

import { Dispatch, SetStateAction } from 'react';

interface SideNavProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
  isTablet: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  description?: string;
}

export function SideNav({ 
  collapsed, 
  setCollapsed, 
  isMobile, 
  isTablet, 
  isOpen, 
  setIsOpen 
}: SideNavProps) {
  const pathname = usePathname();
  const sideNavRef = useRef<HTMLDivElement | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Navegação principal com badges e descrições
  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      icon: <Home className="w-5 h-5" />, 
      href: '/admin',
      description: 'Visão geral do sistema'
    },
    { 
      name: 'Cultos', 
      icon: <Calendar className="w-5 h-5" />, 
      href: '/admin/cultos',
      description: 'Programação dos cultos'
    },
    { 
      name: 'Oradores', 
      icon: <Mic className="w-5 h-5" />, 
      href: '/admin/oradores',
      description: 'Pregadores e palestrantes'
    },
    { 
      name: 'Anúncios', 
      icon: <FileText className="w-5 h-5" />, 
      href: '/admin/anuncios',
      badge: 3,
      description: 'Comunicados da igreja'
    },
    { 
      name: 'Galeria', 
      icon: <Image className="w-5 h-5" />, 
      href: '/admin/fotos',
      description: 'Fotos dos eventos'
    },
        { 
      name: 'Blob', 
      icon: <Image className="w-5 h-5" />, 
      href: '/admin/blob',
      description: 'Blobs'
    },
    { 
      name: 'Mensagem Pastoral', 
      icon: <MessageSquare className="w-5 h-5" />, 
      href: '/admin/mensagem-pastoral',
      description: 'Mensagens do pastor'
    },
    { 
      name: 'Últimos Cultos', 
      icon: <Youtube className="w-5 h-5" />, 
      href: '/admin/ultimos-cultos',
      description: 'Gravações dos cultos'
    },
  ];

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

  // Determina se o sidebar é visível
  const isVisible = isMobile ? isOpen : true;

  // Handlers
  const handleNavClick = useCallback((href: string) => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  const handleCloseMobile = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  if (!isVisible) return null;

  return (
    <>
      <aside
        ref={sideNavRef}
        className={`
          bg-gradient-to-b from-blue-900 to-blue-800 text-white
          transition-all duration-300 ease-in-out
          flex flex-col z-40 shadow-xl
          ${isMobile
            ? 'fixed top-16 left-0 h-[calc(100vh-4rem)] w-64'
            : 'fixed left-0 top-16 h-[calc(100vh-4rem)]'
          }
          ${collapsed && !isMobile ? 'w-16' : 'w-64'}
        `}
      >
        {/* Header */}
        <div className={`
          ${collapsed && !isMobile ? 'px-2 justify-center' : 'px-4 justify-between'} 
          py-4 flex items-center border-b border-blue-700/50
        `}>
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <Link href="/admin">
                  <h1 className="text-lg font-bold hover:text-blue-200 transition-colors">
                    Admin Igreja
                  </h1>
                </Link>
                <p className="text-blue-200 text-xs">Painel Administrativo</p>
              </div>
            </div>
          )}

          {collapsed && !isMobile && (
            <div className="mx-auto">
              <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center">
                <Link href="/admin">
                  <Home className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}

          {/* Toggle buttons */}
          {isMobile ? (
            <button
              onClick={handleCloseMobile}
              className="p-2 rounded-lg hover:bg-blue-800 text-blue-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleToggleCollapse}
              className="p-2 rounded-lg hover:bg-blue-800 text-blue-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-transparent">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const showTooltip = collapsed && !isMobile && hoveredItem === item.name;
              
              return (
                <li key={item.name} className="relative">
                  <Link href={item.href}>
                    <div
                      className={`
                        group relative flex items-center rounded-lg transition-all duration-200
                        ${collapsed && !isMobile ? 'justify-center p-3' : 'px-3 py-3'} 
                        ${isActive
                          ? 'bg-blue-800 text-white shadow-lg border-l-4 border-blue-300'
                          : 'text-blue-100 hover:bg-blue-800/70 hover:text-white'
                        }
                      `}
                      onClick={() => handleNavClick(item.href)}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <span className={`flex-shrink-0 ${collapsed && !isMobile ? '' : 'mr-3'}`}>
                        {item.icon}
                      </span>
                      
                      {(!collapsed || isMobile) && (
                        <>
                          <span className="flex-1 text-sm font-medium whitespace-nowrap">
                            {item.name}
                          </span>
                          
                          {/* Badge */}
                          {item.badge && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full font-medium">
                              {item.badge}
                            </span>
                          )}
                          
                          {/* Arrow indicator for active */}
                          {isActive && (
                            <ChevronRight className="w-4 h-4 ml-2 text-blue-300" />
                          )}
                        </>
                      )}
                      
                      {/* Tooltip para modo colapsado */}
                      {showTooltip && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-300 mt-1">{item.description}</div>
                          )}
                          {item.badge && (
                            <div className="inline-flex items-center mt-1 px-2 py-0.5 text-xs bg-red-500 rounded-full">
                              {item.badge} novo{item.badge !== 1 ? 's' : ''}
                            </div>
                          )}
                          {/* Arrow */}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          
          {/* Divider */}
          <div className="mx-4 my-4 border-t border-blue-700/50"></div>
          
          {/* Additional Actions */}
          <ul className="space-y-1 px-2">
            <li>
              <Link href="/admin/configuracoes">
                <div
                  className={`
                    flex items-center rounded-lg transition-all duration-200
                    ${collapsed && !isMobile ? 'justify-center p-3' : 'px-3 py-3'} 
                    ${pathname === '/admin/configuracoes'
                      ? 'bg-blue-800 text-white shadow-lg'
                      : 'text-blue-100 hover:bg-blue-800/70 hover:text-white'
                    }
                  `}
                  onClick={() => handleNavClick('/admin/configuracoes')}
                >
                  <span className={`flex-shrink-0 ${collapsed && !isMobile ? '' : 'mr-3'}`}>
                    <Settings className="w-5 h-5" />
                  </span>
                  {(!collapsed || isMobile) && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      Configurações
                    </span>
                  )}
                </div>
              </Link>
            </li>
          </ul>
        </nav>

        {/* External Link Section */}
        <div className={`
          ${collapsed && !isMobile ? 'px-2 justify-center' : 'px-4'} 
          py-3 border-t border-blue-700/50
        `}>
          {(!collapsed || isMobile) && (
            <Link 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm group"
            >
              <SquareArrowOutUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Ver Site Principal</span>
            </Link>
          )}
          
          {collapsed && !isMobile && (
            <Link 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex justify-center text-blue-200 hover:text-white transition-colors group"
              title="Ver Site Principal"
            >
              <SquareArrowOutUpRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          )}
        </div>

        {/* Footer - User Section */}
        <div className={`
          ${collapsed && !isMobile ? 'px-2 justify-center' : 'px-4'} 
          py-4 border-t border-blue-700/50 bg-blue-900/50
        `}>
          <div className={`flex items-center ${collapsed && !isMobile ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            
            {(!collapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Administrador</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-blue-200 truncate">Online</p>
                  <Link href="/logout">
                    <button className="flex items-center gap-1 text-xs text-blue-300 hover:text-red-300 transition-colors group">
                      <LogOut className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>Sair</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}
            
            {collapsed && !isMobile && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="font-medium">Administrador</div>
                <div className="text-xs text-gray-300">admin@igreja.com</div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}