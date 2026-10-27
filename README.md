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
- L’adaptateur `FakeStoreProductRepository` fournit actuellement les produits depuis Fake Store API.
- Le store Redux et ses sélecteurs coordonnent l’état du catalogue côté frontend.

Fake Store API est une source de démonstration provisoire. Une première proposition de contrat REST et les décisions métier à confirmer sont documentées dans [docs/backend-contract.md](docs/backend-contract.md). Le backend et la base de données ne sont pas encore implémentés.

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

- Le panier est géré dans Redux en mémoire ; il n’est pas persisté après rechargement.
- Le checkout est une simulation frontend et ne crée pas de commande côté serveur.
- La connexion et l’inscription ne sont pas encore reliées à un backend de production.
- Les données de promotions, de stock et de date d’ajout doivent venir du futur backend ou d’un contrat de données défini.
- Les polices DM Sans et Syne sont déclarées comme préférences visuelles dans les styles, avec des polices système de repli. Les fichiers de police ne sont pas encore hébergés localement.

## Direction pour le backend

Le contrat REST est une proposition à valider avant l’implémentation. Le backend remplacera l’adaptateur de démonstration sans faire dépendre les composants de présentation des détails d’implémentation.
