"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const Conditions = () => {
  const sections = [
    {
      title: "Conditions Générales de Vente",
      content: [
        "Les présentes conditions générales de vente (CGV) constituent le socle de la négociation commerciale et sont systématiquement adressées ou remises à chaque acheteur pour lui permettre de passer commande.",
        "Les conditions générales de vente décrites ci-dessous détaillent les droits et obligations de la société et de son client dans le cadre de la vente des marchandises suivantes : tous les produits proposés sur le site.",
        "Toute acceptation du devis/bon de commande en ce compris la clause « Je reconnais avoir pris connaissance et j'accepte les conditions générales de vente ci-incluses » implique l'adhésion sans réserve de l'acheteur aux présentes conditions générales de vente."
      ]
    },
    {
      title: "Commandes",
      content: [
        "Les commandes sont effectuées par le biais du site internet.",
        "Le vendeur se réserve le droit de refuser toute commande pour des motifs légitimes.",
        "Les informations contractuelles sont présentées en langue française et feront l'objet d'une confirmation au plus tard au moment de la validation de votre commande."
      ]
    },
    {
      title: "Livraison",
      content: [
        "Les produits sont livrés à l'adresse de livraison indiquée lors de la commande.",
        "Les délais de livraison sont donnés à titre indicatif.",
        "En cas de retard de livraison, l'acheteur pourra demander l'annulation de sa commande et obtenir le remboursement des sommes versées."
      ]
    },
    {
      title: "Paiement",
      content: [
        "Le paiement est exigible immédiatement à la commande.",
        "L'acheteur peut effectuer le règlement par carte bancaire ou tout autre moyen de paiement indiqué sur le site.",
        "Les paiements effectués par l'acheteur ne seront considérés comme définitifs qu'après encaissement effectif des sommes dues par le vendeur."
      ]
    },
    {
      title: "Garanties",
      content: [
        "Tous les produits fournis par le vendeur sont conformes à la réglementation en vigueur en France.",
        "La garantie légale de conformité s'applique conformément aux articles L.217-4 et suivants du Code de la consommation.",
        "La garantie contre les vices cachés est régie par les articles 1641 et suivants du Code civil."
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
            Conditions Générales de Vente
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Veuillez lire attentivement les conditions générales de vente avant
            d&apos;utiliser notre site. En accédant à notre site, vous acceptez
            ces conditions.
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
                <CheckCircle className="mr-2" />
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
            Pour toute question concernant nos conditions générales de vente,
            n&apos;hésitez pas à nous contacter.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Conditions;
