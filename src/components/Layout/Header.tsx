"use client";

import { useAppSelector } from "@/store/types";
import { ChevronDown, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  title: string;
  items?: { label: string; href: string }[];
  path?: string;
}
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  const { items } = useAppSelector((state) => state.cart);

  const navigation: HeaderProps[] = [
    /*     {
      title: "Boutique",
      path: "/boutique"
    }, */
    {
      title: "Découvrir",
      items: [
        //  { label: "Catégories", href: "/categories " },
        { label: "Offres & Promotions", href: "/decouvrir/promos" },
        { label: "Nouveautés", href: "/decouvrir/new-arrivals" }
      ]
    },
    { title: "À Propos", path: "/about" },
    { title: "Contact", path: "/contact" }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-[9000]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-x-1">
            <div className="w-7 h-7 md:w-9 md:h-9 bg-[#2ECC71] text-white flex items-center justify-center rounded-md">
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
              className="md:text-2xl text-xl font-bold text-[#2ECC71]"
            >
              PrestigeShop{" "}
            </Link>
          </div>
          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => {
              return (
                <div
                  className="relative"
                  key={item.title}
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.items ? (
                    <>
                      <button className="flex items-center px-3 py-2 text-gray-700 transition-colors duration-300 hover:text-[#2ECC71]">
                        {item.title}
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>{" "}
                      {activeDropdown === item.title && (
                        <div className="absolute left-0  w-56 bg-white  shadow-lg">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors duration-300  hover:text-[#2ECC71]"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.path!}
                      className="px-3 py-2 text-gray-700 hover:text-[#2ECC71] transition-colors duration-300 "
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-1 md:space-x-4">
            <button
              onClick={() => router.push("/search")}
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <Link
              href="/cart"
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <Link
              href="/auth/login"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <User className="w-5 h-5 text-gray-600" />
            </Link>
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.title}>
                  {item.items ? (
                    <>
                      <div className="px-3 py-2 text-gray-700 font-medium">
                        {item.title}
                      </div>
                      <div className="pl-4">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-[#2ECC71] hover:bg-green-50 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.path!}
                      className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-[#2ECC71] hover:bg-green-50 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
