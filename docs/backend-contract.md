# Contrat backend proposé — PrestigeShop

**Statut :** proposition à valider avant l’implémentation du backend.
**Périmètre :** contrat REST entre le frontend actuel et un futur backend. Ce document ne crée ni API, ni base de données.

## 1. Principes

- API REST versionnée sous `/api/v1`.
- JSON en `camelCase`, dates ISO 8601 UTC.
- Les réponses de succès utilisent `{ "data": ... }`; les collections ajoutent `meta` pour la pagination.
- Les erreurs ont la forme `{ "error": { "code": "...", "message": "...", "details": [...] } }`. `details` contient les erreurs de champs quand nécessaire.
- Codes HTTP usuels : `200`, `201` avec `Location`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429` et `500`.
- La présentation dépend des DTO ci-dessous, pas des modèles de base de données. Les prix faisant l’objet d’une commande sont recalculés par l’API.
- Proposition de socle à confirmer : backend REST structuré (NestJS si service séparé), PostgreSQL et Prisma. L’architecture garde domaine/application indépendants du transport et de la persistance, selon les ports et adaptateurs déjà présents dans le frontend.

## 2. Ressources et DTO

### Produit public

```ts
type Product = {
  id: string;
  title: string;
  description: string;
  category: { id: string; name: string; slug: string };
  imageUrl: string;
  priceXof: number;
  stock: number;
  discountPercent: number | null;
  createdAt: string;
  rating: { average: number | null; count: number };
};
```

`rating` est calculé à partir des avis publiés. `discountPercent` est nul si aucune promotion n’est active. Le backend ne doit pas fabriquer les valeurs manquantes. Les stocks et dates d’ajout viennent de données persistées. Un produit non publié n’est pas exposé sur les routes publiques. Les valeurs affichées par Fake Store dans le frontend sont actuellement des montants de démonstration arrondis et étiquetés FCFA sans conversion de devise; elles ne sont pas des prix commerciaux et seront remplacées par des prix XOF du backend.

### Utilisateur public

```ts
type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};
```

Le hash du mot de passe et les attributs internes ne quittent jamais le backend.

### Commande

```ts
type Order = {
  id: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    productId: string;
    title: string;
    imageUrl: string;
    unitPriceXof: number;
    quantity: number;
    lineTotalXof: number;
  }>;
  deliveryAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    secondaryPhone: string | null;
    city: string;
    district: string;
    address: string;
    additionalInfo: string | null;
  };
  subtotalXof: number;
  shippingCostXof: number;
  totalXof: number;
  paymentMethod: "cash_on_delivery";
  createdAt: string;
};
```

Les montants sont des entiers en FCFA (code ISO 4217 `XOF`, sans unité fractionnaire). Règle de livraison convenue : 1 000 XOF si le sous-total est inférieur à 10 000 XOF; 500 XOF de 10 000 XOF inclus à moins de 20 000 XOF; gratuite à partir de 20 000 XOF. Les titres, images, prix unitaires, frais de livraison, sous-total et total renvoyés dans une commande sont des instantanés calculés/chargés côté serveur. Les valeurs transmises par le navigateur ne sont jamais une autorité financière.

### Avis

```ts
type Review = {
  id: string;
  productId: string;
  author: { id: string; username: string };
  rating: number; // entier de 1 à 5
  comment: string;
  createdAt: string;
};
```

## 3. Routes REST

### Catalogue public

| Méthode et route | Usage |
| --- | --- |
| `GET /api/v1/products` | Liste, recherche et filtres |
| `GET /api/v1/products/:productId` | Détail d’un produit |
| `GET /api/v1/categories` | Catégories disponibles |
| `GET /api/v1/products/:productId/reviews` | Avis paginés d’un produit |

Paramètres de `GET /products` : `q`, `category`, `promotion=true`, `newArrivals=true`, `priceMin`, `priceMax`, `sort=price_asc|price_desc|newest|discount_desc`, `page` (1 par défaut), `perPage` (20 par défaut, maximum proposé 100).

Réponse de collection :

```json
{
  "data": [],
  "meta": { "page": 1, "perPage": 20, "total": 0, "totalPages": 0 }
}
```

Une nouveauté signifie ici un produit ajouté dans une fenêtre configurée côté backend; la durée reste à décider. Une promotion dépend d’une remise active et de ses dates, pas d’une simple étiquette d’interface.

### Authentification

| Méthode et route | Authentification | Usage |
| --- | --- | --- |
| `POST /api/v1/auth/register` | Publique | Créer un compte |
| `POST /api/v1/auth/login` | Publique | Ouvrir une session |
| `POST /api/v1/auth/logout` | Session | Fermer la session |
| `GET /api/v1/auth/me` | Session | Lire l’utilisateur connecté |

Requête d’inscription : `{ "username": string, "email": string, "password": string }`. Réponse `201` avec `{ "data": { "user": User } }`. Requête de connexion : `{ "usernameOrEmail": string, "password": string }`; réponse `200` avec l’utilisateur. Proposition de sécurité navigateur : session en cookie `HttpOnly`, `Secure` en production, `SameSite=Lax`; pas de jeton de session conservé dans Redux/localStorage. Les règles de longueur du mot de passe et de normalisation username/email sont à confirmer et devront être identiques au frontend.

### Commandes et panier

Le panier reste provisoirement local au navigateur. À la validation, le client envoie les identifiants et quantités; il ne transmet pas de prix à faire confiance.

| Méthode et route | Authentification | Usage |
| --- | --- | --- |
| `POST /api/v1/orders` | Obligatoire | Créer une commande |
| `GET /api/v1/orders` | Obligatoire | Lister les commandes du compte connecté |
| `GET /api/v1/orders/:orderId` | Obligatoire + propriétaire | Lire une commande |

Requête de création :

```json
{
  "items": [{ "productId": "product-id", "quantity": 2 }],
  "deliveryAddress": {
    "firstName": "Awa",
    "lastName": "Kouassi",
    "phone": "+2250000000000",
    "secondaryPhone": null,
    "city": "Abidjan",
    "district": "Cocody",
    "address": "Adresse de livraison",
    "additionalInfo": null
  },
  "paymentMethod": "cash_on_delivery"
}
```

Réponse `201 Created`, en-tête `Location: /api/v1/orders/:orderId` et `{ "data": Order }`. Le backend valide les quantités, disponibilité et stock, recalcule prix/remises/livraison dans une transaction, réserve ou décrémente le stock selon la règle choisie, puis crée la commande. Stock insuffisant : `409 stock_unavailable`; entrée invalide : `422 validation_error`. Rejouer accidentellement une requête de commande ne doit pas créer silencieusement de doublon; prévoir une clé `Idempotency-Key` pour l’envoi du formulaire.

### Avis

| Méthode et route | Authentification | Usage |
| --- | --- | --- |
| `POST /api/v1/products/:productId/reviews` | Obligatoire | Publier un avis |

Requête : `{ "rating": 1, "comment": "..." }`. Réponse `201` avec `{ "data": Review }`. Proposition : un avis par utilisateur et produit, avec autorisation réservée à un acheteur ayant une commande livrée contenant le produit. Si les avis ouverts sont souhaités, cette règle devra être changée explicitement.

## 4. Validation et erreurs

Les limites ci-dessous sont des valeurs initiales proposées, à confirmer avec les règles commerciales :

- `q` : chaîne nettoyée, maximum 120 caractères.
- Prix : nombres finis positifs; `priceMin <= priceMax`.
- Quantité commandée : entier entre 1 et le maximum métier; stock vérifié lors de la création.
- Adresse : prénom, nom, téléphone, ville, quartier et adresse requis; champs secondaires facultatifs.
- Avis : note entière de 1 à 5; commentaire non vide, maximum proposé 2 000 caractères.
- Les erreurs de validation identifient les champs sans révéler les erreurs internes.

```json
{
  "error": {
    "code": "validation_error",
    "message": "Certaines informations sont invalides.",
    "details": [{ "field": "email", "code": "invalid_format", "message": "Adresse email invalide." }]
  }
}
```

Codes métier proposés : `invalid_credentials`, `email_already_exists`, `username_already_exists`, `product_not_found`, `stock_unavailable`, `order_not_found`, `review_not_allowed`, `review_already_exists`, `validation_error`, `rate_limit_exceeded`.

## 5. Correspondance avec le frontend

| Frontend actuel | Adaptation prévue lors de l’intégration |
| --- | --- |
| `Product.id: number`, `image`, `category: string`, `rating.rate/count` | Mapper DTO serveur (`id: string`, `imageUrl`, catégorie `{id,name,slug}`, rating `average/count`) vers le modèle de présentation, ou migrer le modèle domaine en une tranche séparée. Les prix de la source de démonstration ne sont pas convertis en XOF; le backend fournira les vrais prix XOF. |
| `discount?: number`, `createdAt?: string`, `stock?: number` | Remplacer les optionnels de démonstration par les propriétés du DTO; afficher promotions/nouveautés/stock uniquement avec leurs données serveur. |
| Panier Redux `{id,name,price,image,quantity}` | Conserver les données d’affichage du panier local si utile, mais envoyer exclusivement `productId` et `quantity` au checkout; recharger les prix depuis l’API. |
| Formulaires login/register | Unifier le login sur `usernameOrEmail`, aligner les thunks sur `/api/v1/auth/*`, utiliser la session cookie et appeler `/auth/me` au démarrage. |
| Checkout adresse | Mapper `phone1/phone2` vers `phone/secondaryPhone`; ne vider le panier qu’après réponse `201`. |
| Notes et commentaires locaux | Remplacer les états locaux par `GET/POST reviews`; ne montrer que des avis persistés. |

L’intégration se fait par un adaptateur de repository dans `infrastructure`, puis des ports/cas d’usage dans `application`. Les composants de présentation ne construisent pas les URL HTTP et ne consomment pas de modèles de persistance.

## 6. Décisions à valider avant le backend

1. Devise confirmée : FCFA (XOF). L’interface affiche XOF; les montants Fake Store restent de simples valeurs de démonstration sans conversion. Les prix réels XOF viendront du backend.
2. Zones desservies et éventuels frais supplémentaires selon la destination.
3. Durée de la fenêtre Nouveautés et règles d’activation/expiration des promotions.
4. Commande réservée aux comptes ou autorisée aux invités; si invités, données de contact et suivi sans compte.
5. Paiement à la livraison confirmé ou autre moyen; transitions de statut et annulation éventuelle.
6. Politique d’avis : achat vérifié requis, nombre d’avis par produit/utilisateur et modération.
7. Identifiants des produits : préserver les identifiants numériques de la source actuelle ou adopter des UUID/chaînes internes.
8. Socle d’implémentation : Next.js Route Handlers dans ce dépôt ou service NestJS séparé; proposition initiale : NestJS + PostgreSQL + Prisma pour un backend dédié.

## 7. Hors périmètre de ce contrat initial

Paiement en ligne, promotions par code coupon, newsletter, administration du catalogue, récupération de mot de passe, livraison connectée à un transporteur et notifications. Ajouter ces ressources après clarification des besoins métier.
