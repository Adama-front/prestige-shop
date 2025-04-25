"use client";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Politique = () => {
  const sections = [
    {
      title: "Collecte des Informations",
      content: [
        "Nous collectons les informations que vous nous fournissez directement lors de votre inscription, de votre commande ou de votre contact avec notre service client.",
        "Les informations collectées peuvent inclure votre nom, adresse e-mail, adresse postale, numéro de téléphone et informations de paiement.",
        "Nous utilisons ces informations pour traiter vos commandes, vous fournir nos services et améliorer votre expérience utilisateur."
      ]
    },
    {
      title: "Utilisation des Données",
      content: [
        "Vos données personnelles sont utilisées pour la gestion de votre compte, le traitement de vos commandes et la communication avec vous.",
        "Nous pouvons utiliser vos informations pour vous envoyer des communications marketing, mais uniquement avec votre consentement.",
        "Nous ne vendons ni ne partageons vos données personnelles avec des tiers sans votre consentement explicite."
      ]
    },
    {
      title: "Protection des Données",
      content: [
        "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles.",
        "Toutes les transactions sont sécurisées par des protocoles de cryptage standard de l'industrie.",
        "Nos employés sont formés à la protection des données et au respect de la confidentialité."
      ]
    },
    {
      title: "Vos Droits",
      content: [
        "Vous avez le droit d'accéder à vos données personnelles et de demander leur rectification ou leur suppression.",
        "Vous pouvez retirer votre consentement à tout moment pour le traitement de vos données.",
        "Vous avez le droit de vous opposer au traitement de vos données pour des raisons légitimes."
      ]
    },
    {
      title: "Cookies",
      content: [
        "Nous utilisons des cookies pour améliorer votre expérience sur notre site et analyser le trafic.",
        "Vous pouvez contrôler et gérer les cookies dans les paramètres de votre navigateur.",
        "Certains cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés."
      ]
    }
  ];

  return (
    <section className="bg-white text-black pt-32 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#2ECC71] mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cette politique de confidentialité explique comment nous collectons,
            utilisons et protégeons vos données personnelles.
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-[#2ECC71] mb-4 flex items-center">
                <Shield className="mr-2" />
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-[#2ECC71] mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center text-gray-600"
        >
          <p>
            Pour toute question concernant notre politique de confidentialité,
            n&apos;hésitez pas à nous contacter.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Politique;
