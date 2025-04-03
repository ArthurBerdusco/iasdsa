'use client'

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { useState, useEffect, ReactNode } from "react";

interface SocialCardProps {
    icon: ReactNode;
    platform: string;
    handle: string;
    url: string;
    color: string;
}

const RedesSociais = () => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [latestSermon] = useState({
        id: "FrX4zFJkxhU",
        title: "Último Culto"
    });

    useEffect(() => {
        // You could fetch the latest sermon from an API here
        // This is just a placeholder for now
        const timer = setTimeout(() => {
            setIsVideoLoaded(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="bg-blue-100">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-2">
                    Conecte-se Conosco
                </h2>
                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    Acompanhe nossas atividades, cultos e eventos em nossas redes sociais oficiais
                </p>

                {/* Social Media Cards */}
                <div className="max-w-6xl mx-auto py-8 px-4">
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


                {/* Latest Sermon Section */}
                <div className="max-w-6xl mx-auto py-8 px-4">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-800">
                                        Último Culto
                                    </h3>
                                    <p className="text-gray-500">
                                        Assista ao nosso culto mais recente
                                    </p>
                                </div>
                                <a
                                    href={`https://www.youtube.com/watch?v=${latestSermon.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                >
                                    Ver no YouTube
                                </a>
                            </div>
                        </div>

                        <div className="relative aspect-video w-full h-max bg-gray-100">
                            {!isVideoLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                                </div>
                            )}
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${latestSermon.id}?si=eWsKJvBXdI1ZL3Ol`}
                                title={latestSermon.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                onLoad={() => setIsVideoLoaded(true)}
                            ></iframe>
                        </div>

                        <div className="p-6 bg-gray-50">
                            <a
                                href="https://www.youtube.com/@AdventistasSantoAmaro/streams"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded-lg shadow-sm"
                            >
                                <FaYoutube className="mr-2" />
                                Ver Todos os Cultos
                            </a>
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