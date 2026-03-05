'use client'
// TopNav.tsx - Barra de navegação superior otimizada
import { signOut } from "next-auth/react"
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  User,
  X,
  Bell,
  Settings,
  ChevronDown,
  Home,
} from 'lucide-react';

interface SearchItem {
  name: string;
  href: string;
  type: string;
  description?: string;
}

interface TopNavProps {
  toggleSidebar: () => void;
  isMobile: boolean;
  isTablet: boolean;
}

export function TopNav({ toggleSidebar, isMobile, isTablet }: TopNavProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Dados de exemplo para pesquisa - mais ricos
  const searchData: SearchItem[] = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      type: 'página',
      description: 'Visão geral do sistema'
    },
    { 
      name: 'Cultos', 
      href: '/admin/cultos', 
      type: 'página',
      description: 'Gerenciar programação dos cultos'
    },
    { 
      name: 'Oradores', 
      href: '/admin/oradores', 
      type: 'página',
      description: 'Cadastro de pregadores e palestrantes'
    },
    { 
      name: 'Anúncios', 
      href: '/admin/anuncios', 
      type: 'página',
      description: 'Criar e gerenciar comunicados'
    },
    { 
      name: 'Galeria de Fotos', 
      href: '/admin/fotos', 
      type: 'página',
      description: 'Upload e organização de imagens'
    },
    { 
      name: 'Mensagem Pastoral', 
      href: '/admin/mensagem-pastoral', 
      type: 'página',
      description: 'Mensagens do pastor para a congregação'
    },
    { 
      name: 'Últimos Cultos', 
      href: '/admin/ultimos-cultos', 
      type: 'página',
      description: 'Arquivo de gravações de cultos'
    },
  ];

  // Função de busca otimizada
  const handleSearch = useCallback((): void => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = searchData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(results);
    setShowResults(true);

    // Se tiver apenas um resultado, pode navegar diretamente com Enter
    if (results.length === 1) {
      // Não navega automaticamente, deixa o usuário escolher
    }
  }, [searchTerm]);

  // Executa a busca quando pressionar Enter
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if (searchResults.length === 1) {
        navigateToResult(searchResults[0].href);
      } else if (searchResults.length > 1) {
        // Navega para o primeiro resultado
        navigateToResult(searchResults[0].href);
      }
    }
    if (e.key === 'Escape') {
      clearSearch();
    }
  }, [searchResults]);

  // Navegar para o item selecionado
  const navigateToResult = useCallback((href: string): void => {
    router.push(href);
    setSearchTerm('');
    setShowResults(false);
  }, [router]);

  // Limpar busca
  const clearSearch = useCallback((): void => {
    setSearchTerm('');
    setShowResults(false);
  }, []);

  // Toggle menus
  const toggleUserMenu = useCallback((): void => {
    setShowUserMenu(prev => !prev);
    setShowNotifications(false);
  }, []);

  const toggleNotifications = useCallback((): void => {
    setShowNotifications(prev => !prev);
    setShowUserMenu(false);
  }, []);

  // Fecha menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atualiza os resultados da busca em tempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        const results = searchData.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        setShowResults(results.length > 0);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 150); // Debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <header className="bg-white shadow-sm fixed top-0 right-0 left-0 z-50 h-16 border-b border-gray-200">
      <div className="h-full px-3 sm:px-4 lg:px-6 max-w-none mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left side - Menu button e Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
            type="button"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Logo/Title - esconde em telas muito pequenas */}
          {!isMobile && (
            <Link href="/admin" className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  Admin Igreja
                </h1>
              </div>
            </Link>
          )}
        </div>

        {/* Center - Search bar - adaptável */}
        <div 
          className={`
            flex-1 max-w-lg mx-2 sm:mx-4
            ${isMobile ? 'max-w-none' : ''}
          `} 
          ref={searchRef}
        >
          <div className="relative">
            <div className="flex items-center w-full border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                placeholder={isMobile ? "Buscar..." : "Buscar páginas, recursos..."}
                className="flex-grow pl-3 sm:pl-4 py-2 text-sm bg-white focus:outline-none placeholder-gray-500"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="px-2 focus:outline-none hover:bg-gray-50 transition-colors"
                  type="button"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="bg-gray-50 p-2 hover:bg-gray-100 transition-colors focus:outline-none focus:bg-gray-100"
                type="button"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Search results dropdown - melhorado */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-hidden">
                <div className="p-2 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-600 font-medium">
                    {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ul className="max-h-64 overflow-y-auto py-1">
                  {searchResults.map((result: SearchItem, index: number) => (
                    <li key={`${result.href}-${index}`}>
                      <button
                        className="w-full text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                        onClick={() => navigateToResult(result.href)}
                        type="button"
                      >
                        <div className="px-4 py-3 flex items-start gap-3">
                          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                            {result.type.charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {result.name}
                            </p>
                            {result.description && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {result.description}
                              </p>
                            )}
                            <p className="text-xs text-blue-600 font-medium mt-1">
                              {result.type}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Notifications & User menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Notifications - esconde em mobile muito pequeno */}
          {!isMobile && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
                aria-label="Notificações"
                type="button"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notificações</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Nenhuma notificação nova
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Menu do usuário"
              type="button"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              {!isMobile && (
                <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* User menu dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-900">Administrador</p>
                  <p className="text-sm text-gray-500">admin@igreja.com</p>
                </div>
                <div className="py-2">
                  <Link href="/admin/perfil">
                    <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4" />
                      Meu Perfil
                    </div>
                  </Link>
                  <Link href="/admin/configuracoes">
                    <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4" />
                      Configurações
                    </div>
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button onClick={async ()=>{
                    await signOut({ redirect: true})
                    window.location.href = "/auth/signin"
                  }}>
                    <div className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <X className="w-4 h-4" />
                      Sair
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}