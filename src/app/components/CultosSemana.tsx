'use client';

import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import { CultoYoutube } from "@/types/ultimosCultos";
import { formatDateForDisplay } from "@/utils/formatoData";
import { FaCalendarAlt } from "react-icons/fa";

const RedesSociais = () => {
    const [cultos, setCultos] = useState<CultoYoutube[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchCultos();
    }, []);

    const fetchCultos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/ultimos-cultos");
            if (!response.ok) throw new Error("Falha ao carregar cultos");
            
            const data: CultoYoutube[] = await response.json();
            
            // Ordena por data (mais recente primeiro)
            const sortedData = [...data].sort((a, b) => 
                new Date(b.data).getTime() - new Date(a.data).getTime()
            );
            
            setCultos(sortedData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <section className="max-w-6xl mx-auto px-4 py-12">
                <SectionHeader title="PUBLICAÇÕES NO YOUTUBE" />
                <div className="h-96 flex items-center justify-center bg-blue-50 rounded-3xl">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4"></div>
                        <p className="text-blue-900 font-medium">Carregando cultos recentes...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-6xl mx-auto px-4 py-12">
            <SectionHeader title="PUBLICAÇÕES NO YOUTUBE" />

            <div className="space-y-12">
                {cultos.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        Nenhum culto encontrado no momento.
                    </div>
                ) : (
                    cultos.map((culto, index) => (
                        <div 
                            key={culto.id} 
                            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100"
                        >

                            {/* Player do YouTube - Área principal */}
                            <div className="aspect-video bg-black relative">
                                <iframe
                                    className="w-full h-full"
                                    src={culto.iframe}
                                    title={culto.titulo}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Link para o canal */}
            <div className="mt-16 text-center">
                <a
                    href="https://www.youtube.com/@AdventistasSantoAmaro/streams"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-blue-700 hover:text-blue-900 transition font-medium group"
                >
                    <span className="text-lg">Ver todos os cultos no YouTube</span>
                    <span className="group-hover:translate-x-1 transition">→</span>
                </a>
            </div>
        </section>
    );
};

export default RedesSociais;