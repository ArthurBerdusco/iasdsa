import { ReactNode } from "react";

interface SocialCardProps {
    icon: ReactNode;
    platform: string;
    handle: string;
    url: string;
    color: string;
}

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

export default SocialCard