import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="left-0 right-0 bg-[#171B18] text-[#F5F5EF] border-t border-[#DCE1D8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start gap-y-4">
            <div className="flex items-center gap-x-1">
              <div className="w-7 h-7 md:w-9 md:h-9 bg-[#F98909] text-[#171B18] flex items-center justify-center rounded-md">
                <svg
                  className="w-5 h-5 md:w-7 md:h-7"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 7h-4v3a1 1 0 0 1-2 0V7H6a1 1 0 0 0-.997.923l-.917 11.924A2 2 0 0 0 6.08 22h11.84a2 2 0 0 0 1.994-2.153l-.917-11.924A1 1 0 0 0 18 7h-2v3a1 1 0 1 1-2 0V7Zm-2-3a2 2 0 0 0-2 2v1H8V6a4 4 0 0 1 8 0v1h-2V6a2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Link
                href="/"
                className="md:text-2xl text-xl font-bold text-[#F98909]"
              >
                PrestigeShop{" "}
              </Link>
            </div>
            <p className="text-xs md:text-sm">
              Découvrez des produits de qualité aux meilleurs prix avec une
              expérience d&apos;achat sécurisée.
            </p>
            <p className="text-sm text-[#DCE1D8]">Réseaux sociaux bientôt disponibles</p>
          </div>
          <div className="flex flex-col items-start gap-y-4">
          <h3 className="text-xl font-bold text-[#D9EC8B]">Liens Rapides</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "À Propos" },
                { href: "/contact", label: "Contact" },
                { href: "/conditions", label: "Conditions d'Utilisation" },
                { href: "/politique", label: "Politique de Confidentialité" }
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center group duration-300 transform transition-transform"
                >
                  <div className="hidden group-hover:flex duration-500">
                    <ChevronRight />
                  </div>
                  <Link
                    href={item.href}
                    className="group-hover:translate-x-2 transition-transform duration-300 hover:text-[#D9EC8B]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-y-4">
            <h3 className="text-xl font-bold text-[#D9EC8B]">Contactez-nous</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 " />
                Email:{" "}
                <Link href="mailto:prestigeshop@gmail.com">
                  prestigeshop@gmail.com
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Téléphone: +225 05 85 58 98 12
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 " />
                Adresse: Zanzan (Bondoukou)
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/75">
          <p>
            &copy; {new Date().getFullYear()} PrestigeShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
