import "dotenv/config";
import { prisma } from "../src/infrastructure/database/prisma";

interface SeedCategory {
  name: string;
  slug: string;
  products: {
    title: string;
    description: string;
    priceXof: number;
    stock: number;
    imageUrl: string;
  }[];
}

const SEED_DATA: SeedCategory[] = [
  {
    name: "Mode Homme",
    slug: "mode-homme",
    products: [
      {
        title: "Veste Blazer Slim Coupe Italienne",
        description:
          "Veste de costume élégante en laine mélangée, coupe moderne ajustée pour vos événements et rendez-vous professionnels.",
        priceXof: 55000,
        stock: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Chemise Oxford Blanche en Coton Égyptien",
        description:
          "Chemise intemporelle tissée en pur coton égyptien, col soigné et finitions haut de gamme.",
        priceXof: 18500,
        stock: 25,
        imageUrl:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Montre Chronographe Homme Cadran Noir",
        description:
          "Montre automatique de précision avec boîtier en acier inoxydable et bracelet en cuir véritable noir.",
        priceXof: 48000,
        stock: 12,
        imageUrl:
          "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Chaussures Richelieu en Cuir Brun",
        description:
          "Chaussures de ville en cuir pleine fleur lustré, semelle cousue et confort d'exception.",
        priceXof: 42000,
        stock: 18,
        imageUrl:
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Mode Femme",
    slug: "mode-femme",
    products: [
      {
        title: "Robe de Soirée Satinée Émeraude",
        description:
          "Sublime robe longue en satin fluide émeraude, dos délicatement ouvert et tombé impérial.",
        priceXof: 38000,
        stock: 14,
        imageUrl:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Sac à Main Cuir Haut de Gamme Caramel",
        description:
          "Sac cabas structuré en cuir grainé, finitions dorées et bandoulière amovible.",
        priceXof: 32000,
        stock: 20,
        imageUrl:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Escarpins Noirs en Cuir Verni",
        description:
          "Escarpins classiques à bout pointu, cambrure raffinée et talon aiguille de 8 cm.",
        priceXof: 29500,
        stock: 16,
        imageUrl:
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Ensemble Deux Pièces Chic & Décontracté",
        description:
          "Ensemble veste ceinturée et pantalon fluide assorti, idéal pour un look raffiné au quotidien.",
        priceXof: 45000,
        stock: 10,
        imageUrl:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Électronique",
    slug: "electronique",
    products: [
      {
        title: "Écouteurs Sans Fil Bluetooth ANC Pro",
        description:
          "Écouteurs intra-auriculaires avec réduction active de bruit, son spatial et 30h d'autonomie.",
        priceXof: 28000,
        stock: 35,
        imageUrl:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Montre Connectée Sport & Santé AMOLED",
        description:
          "Suivi cardiaque en continu, GPS intégré, suivi du sommeil et résistance à l'eau 5 ATM.",
        priceXof: 39500,
        stock: 22,
        imageUrl:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Enceinte Sans Fil Haute Fidélité",
        description:
          "Enceinte compacte avec basses profondes, son immersif à 360 degrés et étanchéité IPX7.",
        priceXof: 34000,
        stock: 20,
        imageUrl:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Casque Audio circum-aural Sans Fil",
        description:
          "Casque Bluetooth pliable avec coussinets en mousse à mémoire de forme et clarté acoustique studio.",
        priceXof: 46000,
        stock: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Accessoires",
    slug: "accessoires",
    products: [
      {
        title: "Lunettes de Soleil Polarized Aviator",
        description:
          "Lunettes aviateur à monture dorée et verres minéraux polarisés offrant une protection UV400 maximale.",
        priceXof: 19500,
        stock: 28,
        imageUrl:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Portefeuille Slim Cuir Véritable",
        description:
          "Porte-cartes et billets compact avec protection anti-RFID et cuir tanné végétal.",
        priceXof: 14000,
        stock: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Ceinture Réversible Cuir Noir & Marron",
        description:
          "Ceinture classique avec boucle pivotante permettant d'alterner facilement entre noir et marron.",
        priceXof: 16500,
        stock: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Maison & Déco",
    slug: "maison-deco",
    products: [
      {
        title: "Diffuseur d'Arômes Ultrasonique Design Bois",
        description:
          "Diffuseur d'huiles essentielles silencieux avec éclairage d'ambiance LED chaleureux.",
        priceXof: 22000,
        stock: 25,
        imageUrl:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Lampe de Table Tactile Rechargeable",
        description:
          "Lampe design en aluminium brossé, intensité variable et batterie rechargeable longue durée.",
        priceXof: 26000,
        stock: 18,
        imageUrl:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Bougie Parfumée Artisanale Végétale",
        description:
          "Bougie parfumée coulée à la main à base de cire de soja naturelle et essences de vanille et bois de santal.",
        priceXof: 9500,
        stock: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];

async function seed() {
  console.log("🌱 Début du peuplement de la base de données...");

  for (const group of SEED_DATA) {
    const category = await prisma.category.upsert({
      where: { slug: group.slug },
      update: { name: group.name },
      create: { name: group.name, slug: group.slug }
    });

    console.log(`📁 Catégorie prête : ${category.name} (${category.slug})`);

    for (const prod of group.products) {
      // Chercher si le produit existe déjà par titre et catégorie
      const existing = await prisma.product.findFirst({
        where: {
          title: prod.title,
          categoryId: category.id
        }
      });

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            description: prod.description,
            priceXof: prod.priceXof,
            stock: prod.stock,
            imageUrl: prod.imageUrl,
            isPublished: true
          }
        });
      } else {
        await prisma.product.create({
          data: {
            categoryId: category.id,
            title: prod.title,
            description: prod.description,
            priceXof: prod.priceXof,
            stock: prod.stock,
            imageUrl: prod.imageUrl,
            isPublished: true
          }
        });
      }
    }
  }

  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count({
    where: { isPublished: true }
  });

  console.log("✅ Peuplement terminé avec succès !");
  console.log(`📊 Statistiques : ${categoryCount} catégories, ${productCount} produits publiés.`);
}

seed()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    // Adapter PrismaPg
  });
