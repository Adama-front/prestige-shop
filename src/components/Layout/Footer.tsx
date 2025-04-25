import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="left-0 right-0 bg-[#2ECC71] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start gap-y-4">
            <div className="flex items-center gap-x-1">
              <div className="w-7 h-7 md:w-9 md:h-9 bg-white text-[#2ECC71] flex items-center justify-center rounded-md">
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
                className="md:text-2xl text-xl font-bold text-white"
              >
                PrestigeShop{" "}
              </Link>
            </div>
            <p className="text-xs md:text-sm">
              Découvrez des produits de qualité aux meilleurs prix avec une
              expérience d&apos;achat sécurisée. Suivez-nous pour profiter de
              nos offres et nouveautés !
            </p>
            <div className="flex space-x-4">
              <Link href="#" className=" overflow-hidden">
                <svg
                  className="w-8 h-8 hover:scale-110 duration-300 transition-transform transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </Link>
              <Link href="#" className=" overflow-hidden">
                <svg
                  className="w-8 h-8 hover:scale-110 duration-300 transition-transform transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </Link>
              <Link href="#" className="">
                <svg
                  className="w-7 h-7 hover:scale-110 duration-300 transition-transform transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </Link>
              <Link href="#" className=" overflow-hidden">
                <svg
                  className="w-8 h-8 hover:scale-110 duration-300 transition-transform transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-start gap-y-4">
            <h3 className="text-xl font-bold">Liens Rapides</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "À Propos" },
                { href: "/contact", label: "Contact" },
                { href: "conditions", label: "Conditions d'Utilisation" },
                { href: "politique", label: "Politique de Confidentialité" }
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
                    className="group-hover:translate-x-2 transition-transform duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-y-4">
            <h3 className="text-xl font-bold ">Contactez-nous</h3>
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
        <div className="mt-8 pt-8 border-t  text-center ">
          <p>
            &copy; {new Date().getFullYear()} PrestigeShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
