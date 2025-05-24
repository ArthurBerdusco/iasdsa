'use client'
// TopNav.tsx - Barra de navegação superior responsiva
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Menu,
    Search,
    User,
    X,
} from 'lucide-react';

interface SearchItem {
    name: string;
    href: string;
    type: string;
}

interface TopNavProps {
    toggleSidebar: () => void;
}

export function TopNav({ toggleSidebar }: TopNavProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Dados de exemplo para pesquisa
    const searchData: SearchItem[] = [
        { name: 'Dashboard', href: '/admin', type: 'página' },
        { name: 'Cultos', href: '/admin/cultos', type: 'página' },
        { name: 'Oradores', href: '/admin/oradores', type: 'página' },
        { name: 'Anúncios', href: '/admin/anuncios', type: 'página' },
        { name: 'Galeria de Fotos', href: '/admin/fotos', type: 'página' },
        { name: 'Mensagem Pastoral', href: '/admin/mensagem-pastoral', type: 'página' },
        { name: 'Últimos Cultos', href: '/admin/ultimos-cultos', type: 'página' },
    ];

    // Função de busca
    const handleSearch = (): void => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const results = searchData.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(results);
        setShowResults(true);

        // Se tiver apenas um resultado, navegar diretamente
        if (results.length === 1) {
            router.push(results[0].href);
            setSearchTerm('');
            setShowResults(false);
        }
    };

    // Executa a busca quando pressionar Enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Navegar para o item selecionado
    const navigateToResult = (href: string): void => {
        router.push(href);
        setSearchTerm('');
        setShowResults(false);
    };

    // Fecha menus ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Atualiza os resultados da busca em tempo real
    useEffect(() => {
        if (searchTerm.trim() !== '') {
            const results = searchData.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(results);
            setShowResults(results.length > 0);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchTerm]);

    const clearSearch = (): void => {
        setSearchTerm('');
        setShowResults(false);
    };

    const toggleUserMenu = (): void => {
        setShowUserMenu(!showUserMenu);
    };

    return (
        <header className="bg-white shadow-sm fixed top-0 right-0 left-0 z-30 h-16">
            <div className="h-full px-4 max-w-7xl mx-auto flex items-center justify-between">
                {/* Left side - Menu button */}
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        aria-label="Toggle sidebar"
                        type="button"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Center - Search bar */}
                <div className="flex-3 px-4 max-w-md" ref={searchRef}>
                    <div className="relative">
                        <div className="flex items-center w-full border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="flex-grow pl-4 py-2 text-sm bg-white focus:outline-none"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="px-2 focus:outline-none"
                                    type="button"
                                    aria-label="Limpar busca"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            )}
                            <button
                                onClick={handleSearch}
                                className="bg-gray-100 p-2 hover:bg-gray-200 transition"
                                type="button"
                                aria-label="Buscar"
                            >
                                <Search className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Search results dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                                <ul className="max-h-64 overflow-y-auto py-1">
                                    {searchResults.map((result: SearchItem, index: number) => (
                                        <li key={`${result.href}-${index}`}>
                                            <button
                                                className="w-full text-left"
                                                onClick={() => navigateToResult(result.href)}
                                                type="button"
                                            >
                                                <div className="px-4 py-2 hover:bg-gray-50 flex items-center">
                                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-2">
                                                        {result.type.charAt(0).toUpperCase()}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-medium">{result.name}</p>
                                                        <p className="text-xs text-gray-500">{result.type}</p>
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

                {/* Right side - User menu */}
                <div className="flex items-center" ref={userMenuRef}>
                    <button
                        onClick={toggleUserMenu}
                        className="flex items-center p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        aria-label="User menu"
                        type="button"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                    </button>

                    {/* User menu dropdown */}
                    {showUserMenu && (
                        <div className="absolute right-4 top-16 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                            <div className="p-3 border-b border-gray-100">
                                <p className="font-medium">Administrador</p>
                                <p className="text-xs text-gray-500">admin@igreja.com</p>
                            </div>
                            <ul>
                                <li>
                                    <Link href="/admin/perfil">
                                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Meu Perfil
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/config">
                                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Configurações
                                        </div>
                                    </Link>
                                </li>
                                <li className="border-t border-gray-100">
                                    <Link href="/logout">
                                        <div className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            Sair
                                        </div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}