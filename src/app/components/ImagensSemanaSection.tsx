'use client'

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const images = [
  {
    src: "/images/role.jpg",
    title: "Rolê Jovem Adventista - Centro de SP",
    description: "Um dia especial explorando a história, cultura e arquitetura do centro de São Paulo! Visitas em marcos icônicos e trabalho missionário de entrega de livros e conexão!",
    link: "https://www.flickr.com/photos/201772027@N05/albums/72177720324785721/with/54422590978"
  },
];

export default function ImagensSemana() {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Registros da Semana</h2>
        </div>
        {images.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl shadow-lg my-12"
          >
            <Image
              src={image.src}
              alt={image.title}
              width={800}
              height={500}
              className="w-full h-124 object-cover rounded-2xl"
              style={{ objectFit: "cover" }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
              <h2 className="text-white text-lg font-semibold">{image.title}</h2>
              <p className="text-white text-sm mb-2">{image.description}</p>
              <div className="text-center">

                <Link
                  href={image.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-400 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg backdrop-blur-sm transition-all w-fit"
                >
                  Ver mais <ExternalLink size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}