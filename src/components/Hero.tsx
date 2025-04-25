"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import image_1 from "/images/hero/hero_3.jpg";

// Déplacement des données `slides` hors du composant
const slides = [
  {
    image: "/images/hero/hero_1.jpg",
    title: "Élégance et Précision",
    subtitle:
      "Découvrez notre collection exclusive de montres pour sublimer votre style."
  },
  {
    image: "/images/hero/hero_1.jpg",
    title: "L'Accessoire Indispensable",
    subtitle:
      "Ajoutez une touche de sophistication avec nos sacs à main raffinés."
  },
  {
    image: "/images/hero/hero_1.jpg",
    title: "Féminité et Charme",
    subtitle:
      "Craquez pour nos robes élégantes, parfaites pour toutes les occasions."
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []); // Pas de dépendances nécessaires ici

  return (
    <div className="relative h-[80vh] md:h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Overlay noir */}
          <div className="absolute inset-0 z-0 bg-black/60" />

          {/* Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            width={1920}
            height={1080}
            className="h-full w-full object-cover object-top"
            priority={index === 0}
          />

          {/* Texte et contenu */}
          <div className="absolute z-50 inset-0 flex flex-col items-center justify-center pt-16 md:pt-20 lg:pt-20 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              {slide.subtitle}
            </p>
            <Link
              href="/#products"
              className="text-white font-bold bg-[#2ECC71] md:px-6 px-4 py-2  text-sm md:text-lg transition-colors hover:bg-[#A3BE8C] duration-300"
            >
              Découvrez nos produits
            </Link>
          </div>
        </div>
      ))}

      {/* Indicateurs (dots) */}
      <div className="absolute bottom-6 z-50 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
