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

interface SermonType {
    id: string;
    title: string;
    day: string;
    time: string;
    description: string;
}

const RedesSociais = () => {
    const [selectedSermon, setSelectedSermon] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    const sermons: SermonType[] = [
        {
            id: "VGPKTNlS4Mk",
            title: "Culto de Sábado",
            day: "10/05/2025",
            time: "10h40",
            description: "Culto de Adoração"
        },
        {
            id: "TyDCcbDcQbM",
            title: "Culto de Domingo",
            day: "11/05/2025",
            time: "10h00",
            description: "Culto Evangelístico"
        },
        // {
        //     id: "1xAo8e6BRvE",
        //     title: "Culto de Quarta",
        //     day: "07/05/2025",
        //     time: "20h00",
        //     description: "Culto de Oração"
        // }
    ];

    useEffect(() => {
        // Reset video loaded state when changing sermons
        setIsVideoLoaded(false);
        const timer = setTimeout(() => {
            setIsVideoLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedSermon]);

    return (
        <section className="bg-blue-950 text-white">
            <div className="max-w-6xl mx-auto py-12 px-4">
                {/* Header com ícone */}
                <SectionHeader title='REDES SOCIAIS'/>

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

                {/* Sermons Section - Refactored */}
                <div className="max-w-6xl mx-auto py-8">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        {/* Header com navegação dos cultos */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-semibold text-gray-800">
                                        Cultos da semana passada
                                    </h3>
                                    <a
                                        href="https://www.youtube.com/@AdventistasSantoAmaro/streams"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        Ver Todos
                                    </a>
                                </div>

                                {/* Tabs para navegação entre cultos */}
                                <div className="flex flex-wrap gap-2">
                                    {sermons.map((sermon, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSermon(index)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedSermon === index
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {sermon.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Video player */}
                        <div className="relative aspect-video w-full h-max bg-gray-100">
                            {!isVideoLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                                </div>
                            )}
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${sermons[selectedSermon].id}?si=eWsKJvBXdI1ZL3Ol`}
                                title={sermons[selectedSermon].title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                onLoad={() => setIsVideoLoaded(true)}
                            ></iframe>
                        </div>

                        {/* Sermon info and CTA */}
                        <div className="p-6 bg-gray-50">
                            <div className="mb-4">
                                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                                    {sermons[selectedSermon].title}
                                </h4>
                                <p className="text-gray-600 mb-3">
                                    {sermons[selectedSermon].description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-blue-600" />
                                        {sermons[selectedSermon].day}
                                    </div>
                                    <div className="flex items-center">
                                        <FaClock className="mr-2 text-blue-600" />
                                        {sermons[selectedSermon].time}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={`https://www.youtube.com/watch?v=${sermons[selectedSermon].id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded-lg shadow-sm"
                                >
                                    <FaYoutube className="mr-2" />
                                    Ver no YouTube
                                </a>
                                <a
                                    href="https://www.youtube.com/@AdventistasSantoAmaro/streams"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 transition text-gray-700 font-medium rounded-lg shadow-sm"
                                >
                                    Ver Outros Cultos
                                </a>
                            </div>
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