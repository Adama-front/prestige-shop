# PrestigeShop

PrestigeShop est le frontend d’une boutique en ligne. L’application propose un catalogue de produits, des pages de découverte, une recherche, un panier, un parcours de commande et des pages d’information.

Le projet utilise Next.js App Router, React, TypeScript, Tailwind CSS v4 et Redux Toolkit. L’interface applique la palette **Style 01** : papier ivoire, encre sombre, orange et lime.

## Prérequis

- Node.js compatible avec Next.js 15
- pnpm

## Installation et démarrage

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Commandes

```bash
pnpm dev             # Démarrer le serveur de développement
pnpm exec tsc --noEmit # Vérifier les types TypeScript
pnpm build           # Compiler l’application pour la production
pnpm start           # Servir la version compilée
pnpm lint            # Lancer le script lint défini dans package.json
```

## Backend MVP local

Le backend REST est intégré à Next.js App Router sous `/api/v1`. Il utilise PostgreSQL et Prisma ORM 7.

1. Copier `.env.example` vers `.env` puis renseigner `DATABASE_URL` avec une base PostgreSQL locale.
2. Générer le client et créer/appliquer la migration locale :

   ```bash
   pnpm db:generate
   pnpm db:migrate:dev --name init
   ```

3. Ajouter vos vraies catégories et vos produits dans PostgreSQL avec `pnpm db:studio`. Les produits restent non publiés par défaut; publier un produit seulement après avoir renseigné son prix réel en XOF, son stock et son image.
4. Lancer `pnpm dev`.

Les endpoints implémentés se trouvent sous `/api/v1/products`, `/api/v1/categories`, `/api/v1/auth` et `/api/v1/orders`. Les migrations ne sont pas appliquées automatiquement au démarrage; en production, utiliser `pnpm db:migrate:deploy` avec une `DATABASE_URL` sécurisée.

## Organisation du code

```text
src/
├── app/             # Routes Next.js et layout global
├── presentation/    # Composants d’interface, pages de fonctionnalités et providers
├── application/     # État Redux, sélecteurs, cas d’usage et ports
├── domain/          # Types et modèles métier indépendants du framework
├── infrastructure/  # Adaptateurs vers les sources de données externes
└── shared/          # Utilitaires partagés
```

Les fichiers `src/app/**/page.tsx` restent les points d’entrée du routage et délèguent l’affichage à `presentation`. Les composants d’interface ne doivent pas accéder directement aux services externes. Les cas d’usage s’appuient sur des ports définis dans `application`, implémentés par les adaptateurs de `infrastructure`.

### Catalogue

- Le contrat `ProductRepository` est défini dans `src/application/catalog/ports`.
- Les cas d’usage de lecture sont dans `src/application/catalog/use-cases`.
- Le repository catalogue du navigateur consomme les Route Handlers internes; Prisma est isolé dans `infrastructure`.
- `FakeStoreProductRepository` est conservé comme ancien adaptateur de démonstration, mais n’est plus la source active.
- Le store Redux et ses sélecteurs coordonnent l’état du catalogue côté frontend.

Le contrat et le modèle de données MVP sont documentés dans [docs/backend-contract.md](docs/backend-contract.md). Une connexion PostgreSQL et de vrais produits XOF sont nécessaires pour servir le catalogue en local ou en production.

## Routes principales

| Route | Contenu |
| --- | --- |
| `/` | Accueil et catalogue |
| `/search` | Recherche et filtres |
| `/products/[id]` | Détail d’un produit |
| `/decouvrir/promos` | Promotions |
| `/decouvrir/new-arrivals` | Nouveautés |
| `/cart` | Panier |
| `/checkout` | Formulaire de commande |
| `/auth/login` | Connexion |
| `/register` | Inscription |
| `/about`, `/contact`, `/conditions`, `/politique` | Pages d’information |

## État actuel et limites

- Le panier est géré dans Redux en mémoire; il n’est pas persisté après rechargement.
- Les commandes à livraison sont enregistrées côté serveur; les prix, frais et stocks sont validés par l’API.
- L’inscription, la connexion et les sessions cookie HTTPOnly sont implémentées; une base PostgreSQL configurée est requise.
- Les données de promotions, de stock et de date d’ajout doivent venir du futur backend ou d’un contrat de données défini.
- Les polices DM Sans et Syne sont déclarées comme préférences visuelles dans les styles, avec des polices système de repli. Les fichiers de police ne sont pas encore hébergés localement.

## État du backend

Les Route Handlers et la migration initiale sont en place. La migration reste à appliquer sur une base PostgreSQL configurée, et le catalogue doit être renseigné avec les données commerciales réelles avant publication.
