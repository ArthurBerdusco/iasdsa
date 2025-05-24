'use client'

// Layout.jsx - Componente de layout principal que organiza a estrutura do painel
import { useState, useEffect, ReactNode } from 'react';
import { SideNav } from '../components/AdminSideNav';
import { TopNav } from '../components/AdminTopNav';

type RootLayoutProps = {
  children: ReactNode;
};


export default function RootLayout({ children }: RootLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Detecta o tamanho da tela para ajustar o layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && !sidebarOpen) {
        setSidebarCollapsed(true);
      }
    };
    
    handleResize(); // Verifica no carregamento inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);
  
  // Função para alternar o sidebar em dispositivos móveis
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopNav toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        <SideNav 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        <main className={`flex-1 transition-all duration-300 p-6 ${isMobile ? '' : (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')}`}>
          {children}
        </main>
      </div>
    </div>
  );
}