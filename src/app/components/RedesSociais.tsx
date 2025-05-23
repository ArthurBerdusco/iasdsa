'use client'

import { FaFacebook, FaInstagram, FaYoutube, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useState, useEffect, ReactNode } from "react";
import SectionHeader from "./SectionHeader";

interface SocialCardProps {
    icon: ReactNode;
    platform: string;
    handle: string;
    url: string;
    color: string;
}

// Interface para dados de Culto
interface Culto {
    id: number;
    data: string;
    hora: string;
    titulo: string;
    descricao: string;
    linkyoutube: string;
    iframe: string;
}

const RedesSociais = () => {
    const [cultos, setCultos] = useState<Culto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadedVideos, setLoadedVideos] = useState<Record<number, boolean>>({});

    const handleVideoLoaded = (id: number) => {
        setLoadedVideos((prev) => ({ ...prev, [id]: true }));
    };


    useEffect(() => {
        fetchCultos();
    }, []);

    const fetchCultos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/ultimos-cultos");
            if (!response.ok) {
                throw new Error("Falha ao carregar cultos");
            }
            const data = await response.json();
            setCultos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Formata a data para exibição visual no formato brasileiro (DD/MM/YYYY)
    const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);

        // Obter dia, mês e ano e adicionar zeros à esquerda quando necessário
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque mês começa do zero
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };


    if (isLoading) {
        return (
            <section className="relative max-w-6xl mx-auto py-6 px-4 bg-blue-950">
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="animate-pulse text-white">Carregando cultos recentes...</div>
                </div>
            </section>
        );
    }

    return (

        <section className="bg-blue-950 text-white">
            <div className="max-w-6xl mx-auto py-12 px-4">
                {/* Header com ícone */}
                <SectionHeader title='REDES SOCIAIS' />

                {/* Social Media Cards */}
                <div className="max-w-6xl mx-auto py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <SocialCard
                            icon={<FaFacebook className="text-white text-2xl" />}
                            platform="Facebook"
                            handle="IASD Santo Amaro"
                            url="https://www.facebook.com/iasdsantoamarosp/?locale=pt_BR"
                            color="bg-blue-600"
                        />
                        <SocialCard
                            icon={<FaInstagram className="text-white text-2xl" />}
                            platform="Instagram"
                            handle="@adventistas.santoamaro"
                            url="https://www.instagram.com/adventistas.santoamaro/"
                            color="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                        />
                        <SocialCard
                            icon={<FaYoutube className="text-white text-2xl" />}
                            platform="YouTube"
                            handle="Adventistas Santo Amaro"
                            url="https://www.youtube.com/@AdventistasSantoAmaro"
                            color="bg-red-600"
                        />
                    </div>
                </div>

                {/* cultos Section - Refactored */}

                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
                    {/* Header with elegant title */}
                    <div className="px-6 pt-8 pb-6 border-b border-blue-100">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
                                    Cultos da Semana
                                </h2>
                                <a
                                    href="https://www.youtube.com/@AdventistasSantoAmaro/streams"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition flex items-center"
                                >
                                    <span>Ver Todos</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>

                            {/* Description text */}
                            <p className="text-blue-700 text-sm">
                                Assista aos cultos anteriores e mantenha-se conectado com nossa igreja
                            </p>
                        </div>
                    </div>

                    {/* List of videos stacked vertically */}
                    <div className="divide-y divide-blue-100">
                        {cultos.map((culto) => (
                            <div key={culto.id} className="bg-white" id={`culto-${culto.id}`}>
                                {/* Video player */}
                                <div className="relative w-full">
                                    <div className="aspect-video w-full p-6 md:p-8">
                                        {!loadedVideos[culto.id] && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/10 backdrop-blur-sm">
                                                <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4"></div>
                                                <p className="text-blue-800 font-medium">Carregando culto...</p>
                                            </div>
                                        )}
                                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                                            {formatDateForDisplay(culto.data)}
                                        </div>
                                        <iframe
                                            className="w-full h-full rounded-lg"
                                            src={culto.iframe}
                                            title={`Culto: ${culto.titulo}`}
                                            aria-label={`Culto de ${culto.data}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                            onLoad={() => handleVideoLoaded(culto.id)}
                                        ></iframe>
                                    </div>
                                </div>

                                {/* Sermon info */}
                                <div className="px-6 md:px-8">
                                    <div className="mb-6">

                                        {/* Title */}
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                            {culto.titulo}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-700 leading-relaxed mb-6">
                                            {culto.descricao}
                                        </p>

                                        {/* CTA button */}
                                        <a
                                            href={culto.linkyoutube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center py-3 px-5 bg-red-600 hover:bg-red-700 transition text-white font-semibold rounded-lg shadow-sm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                                            </svg>
                                            Ver no YouTube
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick navigation section */}
                    <div className="bg-blue-50/50 px-6 py-6 border-t border-blue-100">
                        <h4 className="text-blue-800 font-semibold mb-3">Navegar para</h4>
                        <div className="flex flex-wrap gap-3">
                            {cultos.map((culto) => (
                                <a
                                    key={culto.id}
                                    href={`#culto-${culto.id}`}
                                    className="px-4 py-2 bg-white border border-blue-200 hover:bg-blue-50 transition rounded-lg text-blue-800 font-medium text-sm flex items-center"
                                >
                                    <span>{formatDateForDisplay(culto.data)}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

// Helper component for social media cards
const SocialCard = ({ icon, platform, handle, url, color }: SocialCardProps) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
        >
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition transform group-hover:shadow-lg group-hover:-translate-y-1">
                <div className={`p-4 ${color}`}>
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {platform}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {handle}
                    </p>
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800">
                        Seguir →
                    </span>
                </div>
            </div>
        </a>
    );
};

export default RedesSociais;