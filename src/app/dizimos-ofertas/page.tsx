import { BookOpen } from "lucide-react";
import BannerDizimo from "../components/DizimoSection";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <NavBar />
            <BannerDizimo />

            {/* Boletim Link */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                        <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                        Mais Informações no Boletim
                    </h3>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Acesse nosso boletim digital para ficar por dentro de todas as atividades, estudos e eventos da igreja.
                    </p>
                    <Link href={'/'} className="inline-flex items-center justify-center bg-white text-blue-950 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg">
                        <span>Acessar Boletim</span>
                        <BookOpen className="h-5 w-5 ml-3" />
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    )
}