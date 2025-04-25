"use client";
import { Mail } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setMessage("Veuillez entrer un email valide.");
      return;
    }
    setMessage("Merci pour votre inscription !");
    setEmail("");
  };

  return (
    <div className="left-0 right-0 bg-white text-black">
      {" "}
      <div className="max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full flex flex-col items-center justify-center gap-y-5">
          <div className="w-full flex flex-col text-center gap-y-2">
            <h2 className="text-2xl  md:text-3xl font-bold text-gray-900">
              Inscrivez-vous à notre newsletter
            </h2>
            <p className="text-gray-600 text-sm">
              Recevez nos meilleures offres et nouveautés directement dans votre
              boîte mail.
            </p>
          </div>
          <form
            className="w-full md:w-[60%] flex items-center justify-center gap-x-2 gap-y-7 flex-col md:flex-row"
            onSubmit={handleSubmit}
          >
            <div className=" relative w-full flex items-center justify-center ">
              <span className=" absolute -bottom-6 md:-bottom-7">
                {" "}
                {message && (
                  <p
                    className={`mt-3 text-sm text-gray-700 ${
                      message === "Veuillez entrer un email valide."
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </span>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                placeholder="Votre email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#2ECC71] text-white px-4 py-2  duration-300 cursor-pointer hover:bg-[#A3BE8C] transition-colors"
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
