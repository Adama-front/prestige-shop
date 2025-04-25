"use client";
import { ChevronDown } from "lucide-react";

const HeroNewArrivals = () => {
  // Function to scroll to the services section
  const scrollToServices = () => {
    const servicesSection = document.querySelector("#newArrivals");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bgHeroNewArrivals h-[80vh] md:h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="flex items-center justify-center w-full h-full flex-col gap-y-4 text-center max-w-6xl mx-auto pt-24 md:pt-20  px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white  max-w-4xl">
          Découvrez Nos Nouveautés Exclusives
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8">
          Découvrez des nouveautés qui redéfinissent le style
        </p>
      </div>
      {/* Scroll down indicator */}
      <div
        className="absolute bottom-0 left-1/2  transform -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer "
        onClick={scrollToServices}
      >
        <span className="text-sm text-gray-400 mb-2">Découvrir</span>
        <ChevronDown className="h-6 w-6 text-[#2ECC71]" />
      </div>
    </section>
  );
};

export default HeroNewArrivals;
