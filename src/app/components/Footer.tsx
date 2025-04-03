import { FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-6 mt-12 text-center ">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Igreja Adventista de Santo Amaro</h3>
        <p className="text-gray-300 mb-2 flex items-center justify-center gap-2">
          <FaMapMarkerAlt /> Rua Comendador Elias Zarzur, 86 - Santo Amaro, São Paulo - SP, 04736-000
        </p>

        <div className="mb-6">
          <iframe
            className="w-full h-64 rounded-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3654.68259630769!2d-46.704111924667096!3d-23.651535478738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce515a90a79dc9%3A0x7d73a6a088c82b04!2sIASD%20Santo%20Amaro!5e0!3m2!1spt-PT!2sbr!4v1743643531525!5m2!1spt-PT!2sbr"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade">

          </iframe>
        </div>

        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} IASD Santo Amaro. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};