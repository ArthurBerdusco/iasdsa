'use client'
// Layout.tsx - Componente de layout principal otimizado
import { useState, useEffect, ReactNode, useCallback } from 'react';
import { SideNav } from '../components/AdminSideNav';
import { TopNav } from '../components/AdminTopNav';

type RootLayoutProps = {
  children: ReactNode;
};

// Breakpoints consistentes
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export default function RootLayout({ children }: RootLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Detecta o tamanho da tela de forma otimizada
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const mobile = width < BREAKPOINTS.md;
    const tablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
    
    setIsMobile(mobile);
    setIsTablet(tablet);
    
    // Auto-colapsa em tablets e mobile
    if (mobile || tablet) {
      setSidebarCollapsed(true);
      setSidebarOpen(false);
    } else {
      // Em desktop, mantém o estado atual ou expande por padrão
      if (width >= BREAKPOINTS.xl) {
        setSidebarCollapsed(false);
      }
    }
  }, []);

  // Effect para detectar mudanças de tela
  useEffect(() => {
    setIsClient(true);
    handleResize(); // Verifica no carregamento inicial
    
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  // Função para alternar o sidebar
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  }, [isMobile]);

  // Fecha sidebar mobile quando clicar no overlay
  const closeMobileSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Calcula a margem do conteúdo principal
  const getMainMargin = () => {
    if (!isClient) return 'ml-0'; // Evita hydration mismatch
    
    if (isMobile) return 'ml-0';
    if (isTablet) return 'ml-0';
    return sidebarCollapsed ? 'ml-16' : 'ml-64';
  };

  // Calcula padding responsivo
  const getMainPadding = () => {
    if (isMobile) return 'p-3 sm:p-4';
    if (isTablet) return 'p-4 md:p-5';
    return 'p-4 lg:p-6 xl:p-8';
  };

  if (!isClient) {
    // Renderização inicial sem hydration mismatch
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="h-16 bg-white shadow-sm"></div>
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* TopNav fixo */}
      <TopNav 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      
      {/* Container principal */}
      <div className="flex flex-1 pt-16 relative">
        {/* Overlay para mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileSidebar}
            aria-hidden="true"
          />
        )}
        
        {/* SideNav */}
        <SideNav 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          isMobile={isMobile}
          isTablet={isTablet}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        {/* Conteúdo principal */}
        <main 
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${getMainMargin()}
            ${getMainPadding()}
            min-h-0 overflow-auto
            max-w-full
          `}
        >
          {/* Container responsivo para o conteúdo */}
          <div className="w-full max-w-none">
            <div className="min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}