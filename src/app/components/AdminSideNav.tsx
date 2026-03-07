'use client'
// SideNav.tsx - Barra de navegação lateral otimizada
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  Bell,
  Palette,
  HandHeart,
  Church,
  Database,
  Home,
} from 'lucide-react';

import { Dispatch, SetStateAction } from 'react';
import { signOut } from 'next-auth/react';

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

interface NavGroup {
  label: string;
  items: NavItem[];
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

  // Grupos de navegação
  const navGroups: NavGroup[] = [
    {
      label: 'Visão Geral',
      items: [
        {
          name: 'Dashboard',
          icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
          href: '/admin',
          description: 'Resumo e métricas'
        },
      ]
    },
    {
      label: 'Conteúdo',
      items: [
        {
          name: 'Cultos',
          icon: <Calendar className="w-[18px] h-[18px]" />,
          href: '/admin/cultos',
          description: 'Programação dos cultos'
        },
        {
          name: 'Últimos Cultos',
          icon: <Youtube className="w-[18px] h-[18px]" />,
          href: '/admin/ultimos-cultos',
          description: 'Gravações dos cultos'
        },
        {
          name: 'Oradores',
          icon: <Mic className="w-[18px] h-[18px]" />,
          href: '/admin/oradores',
          description: 'Pregadores e palestrantes'
        },
        {
          name: 'Mensagem Pastoral',
          icon: <MessageSquare className="w-[18px] h-[18px]" />,
          href: '/admin/mensagem-pastoral',
          description: 'Mensagens do pastor'
        },
      ]
    },
    {
      label: 'Comunicação',
      items: [
        {
          name: 'Anúncios',
          icon: <Bell className="w-[18px] h-[18px]" />,
          href: '/admin/anuncios',
          badge: 3,
          description: 'Comunicados da igreja'
        },
        {
          name: 'Pedidos de Oração',
          icon: <HandHeart className="w-[18px] h-[18px]" />,
          href: '/admin/pedidos-oracao',
          description: 'Pedidos recebidos'
        },
      ]
    },
    {
      label: 'Mídia',
      items: [
        {
          name: 'Galeria',
          icon: <Image className="w-[18px] h-[18px]" />,
          href: '/admin/fotos',
          description: 'Fotos dos eventos'
        },
        {
          name: 'Blob',
          icon: <Database className="w-[18px] h-[18px]" />,
          href: '/admin/blob',
          description: 'Arquivos e mídias'
        },
      ]
    },
    {
      label: 'Personalização',
      items: [
        {
          name: 'Identidade Visual',
          icon: <Palette className="w-[18px] h-[18px]" />,
          href: '/admin/identidade-visual',
          description: 'Cores, logo e estilo'
        },
        {
          name: 'Configurações',
          icon: <Settings className="w-[18px] h-[18px]" />,
          href: '/admin/configuracoes',
          description: 'Visibilidade e sistema'
        },
      ]
    },
    {
      label: 'Sistema',
      items: [
        {
          name: 'Usuários',
          icon: <Users className="w-[18px] h-[18px]" />,
          href: '/admin/usuarios',
          description: 'Gerenciar usuários'
        },
      ]
    },
  ];

  // Fechar menu ao clicar fora (mobile)
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

  const isVisible = isMobile ? isOpen : true;

  const handleNavClick = useCallback(() => {
    if (isMobile) setIsOpen(false);
  }, [isMobile, setIsOpen]);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  if (!isVisible) return null;

  const isCollapsed = collapsed && !isMobile;

  return (
    <>
      {/* Overlay mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        ref={sideNavRef}
        className={`
          flex flex-col z-40 shadow-2xl
          transition-all duration-300 ease-in-out
          ${isMobile
            ? 'fixed top-0 left-0 h-screen w-72'
            : 'fixed left-0 top-16 h-[calc(100vh-4rem)]'
          }
          ${isCollapsed ? 'w-[70px]' : 'w-64'}
        `}
        style={{
          background: 'linear-gradient(180deg, #1e3a6e 0%, #1a3060 40%, #162854 100%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* ── HEADER ── */}
        {isMobile && (
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <Church className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Admin Igreja</p>
                <p className="text-[10px] text-blue-300/70 uppercase tracking-widest">Painel</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 text-blue-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── COLLAPSE BUTTON (desktop) ── */}
        {!isMobile && (
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} px-3 pt-3 pb-1`}>
            <button
              onClick={handleToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-white/10 text-blue-300 hover:text-white transition-all duration-200 border border-transparent hover:border-white/10"
              aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {/* ── NAVIGATION ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-thin scrollbar-thumb-blue-700/50 scrollbar-track-transparent">
          {navGroups.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? 'mt-1' : ''}>
              {/* Label do grupo */}
              {!isCollapsed && (
                <p className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-400/60 select-none">
                  {group.label}
                </p>
              )}
              {isCollapsed && gi > 0 && (
                <div className="mx-3 my-2 border-t border-white/[0.07]" />
              )}

              <ul className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const showTooltip = isCollapsed && hoveredItem === item.name;

                  return (
                    <li key={item.name} className="relative">
                      <Link href={item.href} onClick={handleNavClick}>
                        <div
                          className={`
                            relative flex items-center rounded-xl transition-all duration-200 cursor-pointer select-none
                            ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'}
                            ${isActive
                              ? 'bg-blue-500/20 text-white shadow-sm'
                              : 'text-blue-200/80 hover:bg-white/[0.07] hover:text-white'
                            }
                          `}
                          onMouseEnter={() => setHoveredItem(item.name)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {/* Active indicator bar */}
                          {isActive && !isCollapsed && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-r-full" />
                          )}

                          {/* Icon */}
                          <span className={`
                            flex-shrink-0 transition-colors
                            ${isActive ? 'text-blue-300' : 'text-blue-300/70'}
                            ${isCollapsed ? '' : 'mr-3'}
                          `}>
                            {item.icon}
                          </span>

                          {/* Label + badge */}
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-[13px] font-medium whitespace-nowrap">
                                {item.name}
                              </span>

                              {item.badge && (
                                <span className="ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                  {item.badge}
                                </span>
                              )}

                              {isActive && !item.badge && (
                                <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-400/60" />
                              )}
                            </>
                          )}

                          {/* Badge no modo colapsado */}
                          {isCollapsed && item.badge && (
                            <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-red-500 text-white rounded-full">
                              {item.badge}
                            </span>
                          )}

                          {/* Active dot no modo colapsado */}
                          {isActive && isCollapsed && (
                            <span className="absolute right-1 bottom-1 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                          )}
                        </div>
                      </Link>

                      {/* Tooltip (modo colapsado) */}
                      {showTooltip && (
                        <div className="
                          absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50
                          px-3 py-2 rounded-xl shadow-xl pointer-events-none
                          border border-white/10
                        "
                          style={{ background: '#0f1f3d', minWidth: '140px' }}
                        >
                          <p className="text-[13px] font-semibold text-white whitespace-nowrap">{item.name}</p>
                          {item.description && (
                            <p className="text-[11px] text-blue-300/70 mt-0.5 whitespace-nowrap">{item.description}</p>
                          )}
                          {item.badge && (
                            <span className="inline-flex items-center mt-1.5 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                              {item.badge} novo{item.badge !== 1 ? 's' : ''}
                            </span>
                          )}
                          {/* Arrow */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] w-2.5 h-2.5 rotate-45 border-l border-b border-white/10" style={{ background: '#0f1f3d' }} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── VER SITE ── */}
        <div className={`px-3 py-3 border-t border-white/[0.07]`}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center gap-2.5 rounded-xl px-3 py-2.5
              text-blue-300/70 hover:text-white hover:bg-white/[0.07]
              transition-all duration-200 group
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title="Ver Site Principal"
          >
            <SquareArrowOutUpRight className="w-[17px] h-[17px] flex-shrink-0 group-hover:scale-110 transition-transform" />
            {!isCollapsed && (
              <span className="text-[13px] font-medium whitespace-nowrap">Ver Site Principal</span>
            )}
          </Link>
        </div>

        {/* ── USER FOOTER ── */}
        <div
          className={`px-3 py-3 border-t border-white/[0.07]`}
          style={{ background: 'rgba(0,0,0,0.15)' }}
        >
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                A
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#162854] rounded-full" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white truncate leading-tight">Administrador</p>
                <p className="text-[11px] text-emerald-400/80 truncate">● Online</p>
              </div>
            )}

            {!isCollapsed && (
              <button
                onClick={async () => {
                  await signOut({ redirect: true });
                  window.location.href = '/auth/signin';
                }}
                className="flex-shrink-0 p-2 rounded-lg text-blue-300/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                title="Sair"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}