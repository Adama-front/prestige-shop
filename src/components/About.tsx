"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Large Sélection",
    description: "Plus de 100 000 produits disponibles",
    icon: <CheckCircle />
  },
  {
    title: "Livraison Rapide",
    description: "Livraison en 24/48h sur toute la France",
    icon: <CheckCircle />
  },
  {
    title: "Shopping Sécurisé",
    description: "Paiement sécurisé et protection des données",
    icon: <CheckCircle />
  },
  {
    title: "Support 24/7",
    description: "Une équipe à votre écoute 7j/7",
    icon: <CheckCircle />
  }
];

const teamMembers = [
  {
    name: "Jean Dupont",
    role: "CEO & Fondateur",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
  },
  {
    name: "Marie Laurent",
    role: "Directrice des Opérations",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
  },
  {
    name: "Thomas Chen",
    role: "Directeur Technique",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
  },
  {
    name: "Sophie Martin",
    role: "Directrice Marketing",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
  }
];

const stats = [
  { number: "1M+", label: "Clients Satisfaits" },
  { number: "50K+", label: "Livraisons Mensuelles" },
  { number: "24/7", label: "Support Client" },
  { number: "98%", label: "Avis Positifs" }
];

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  // Fonction pour calculer le nombre de cartes visibles selon la largeur de l'écran
  const updateVisibleCards = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setVisibleCards(1);
    } else if (width < 992) {
      setVisibleCards(2);
    } else {
      setVisibleCards(3);
    }
  };

  // Mise à jour du nombre de cartes visibles au chargement et au redimensionnement
  useEffect(() => {
    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % (teamMembers.length - (visibleCards - 1))
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + (teamMembers.length - (visibleCards - 1))) %
        (teamMembers.length - (visibleCards - 1))
    );
  };

  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="pt-32 ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#2ECC71] mb-6 ">
              Qui Sommes-Nous
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Nous transformons le shopping en ligne avec une plateforme
              innovante, intuitive et totalement dédiée à votre satisfaction.
              Découvrez une expérience d&apos;achat unique, conçue pour inspirer
              et simplifier votre quotidien.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-4  shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center flex-col mb-2 gap-y-1">
                  <div className="text-[#2ECC71] mr-3">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-[#2ECC71]">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4  shadow-md"
              >
                <h3 className="text-4xl font-bold text-[#2ECC71] mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#2ECC71] mb-10">
            Notre Équipe
          </h2>
          <div className="relative">
            <div className="overflow-hidden pb-4">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentSlide * (100 / visibleCards)
                  }%)`
                }}
              >
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 px-4 ${
                      visibleCards === 1
                        ? "w-full"
                        : visibleCards === 2
                        ? "w-1/2"
                        : "w-1/3"
                    }`}
                  >
                    <div className="bg-white shadow-lg overflow-hidden">
                      <div className="w-full h-64 md:h-96 relative">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover "
                          priority
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-xl font-semibold text-[#2ECC71] mb-2">
                          {member.name}
                        </h3>
                        <p className="text-gray-600">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#2ECC71] text-white p-1  hover:bg-[#A3BE8C]  cursor-pointer transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#2ECC71] text-white p-1 hover:bg-[#A3BE8C]  cursor-pointer transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#2ECC71] mb-10">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6  shadow-md text-center"
            >
              <h3 className="text-xl font-semibold text-[#2ECC71] mb-4">
                Innovation
              </h3>
              <p className="text-gray-700">
                Nous repoussons constamment les limites pour offrir les
                meilleures solutions e-commerce.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6  shadow-md text-center"
            >
              <h3 className="text-xl font-semibold text-[#2ECC71] mb-4">
                Qualité
              </h3>
              <p className="text-gray-700">
                Nous nous engageons à fournir des produits et services de la
                plus haute qualité.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6  shadow-md text-center"
            >
              <h3 className="text-xl font-semibold text-[#2ECC71] mb-4">
                Satisfaction Client
              </h3>
              <p className="text-gray-700">
                La satisfaction de nos clients est au cœur de toutes nos
                décisions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
