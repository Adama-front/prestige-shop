# Contrat backend proposé — PrestigeShop

**Statut :** architecture MVP retenue; règles métier restantes signalées en section 11.
**Périmètre :** contrat REST pour le MVP dans l’application Next.js existante. Ce document ne crée ni API, ni base de données.

## 1. Principes

- API REST versionnée sous `/api/v1`.
- JSON en `camelCase`, dates ISO 8601 UTC.
- Les réponses de succès utilisent `{ "data": ... }`; les collections ajoutent `meta` pour la pagination.
- Les erreurs ont la forme `{ "error": { "code": "...", "message": "...", "details": [...] } }`. `details` contient les erreurs de champs quand nécessaire.
- Codes HTTP usuels : `200`, `201` avec `Location`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429` et `500`.
- La présentation dépend des DTO ci-dessous, pas des modèles de base de données. Les prix faisant l’objet d’une commande sont recalculés par l’API.
- Socle MVP : Next.js App Router Route Handlers dans ce dépôt, PostgreSQL et Prisma ORM 7 (version stable à utiliser; ne pas prendre Prisma ORM 8 tant qu’il est en version candidate). Zod valide les requêtes et réponses aux frontières. Cela évite un service NestJS et un déploiement distincts au démarrage. Garder les règles métier dans `application`/`domain`, les Route Handlers minces dans `app/api`, et Prisma dans `infrastructure`.
- Le MVP couvre catalogue public, inscription/connexion, session et commandes avec paiement à la livraison, car le checkout actuel exige un compte. Avis, administration, coupons, paiement en ligne et gestion avancée des promotions ne sont pas requis au premier lancement.

## 2. Ressources et DTO

### Produit public

```ts
type Product = {
  id: number;
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

Requête d’inscription : `{ "username": string, "email": string, "password": string }`. Réponse `201` avec `{ "data": { "user": User } }`. Requête de connexion : `{ "username": string, "password": string }`; réponse `200` avec l’utilisateur. Proposition de sécurité navigateur : session en cookie `HttpOnly`, `Secure` en production, `SameSite=Lax`; pas de jeton de session conservé dans Redux/localStorage. Les règles de longueur du mot de passe et de normalisation username/email sont à confirmer et devront être identiques au frontend.

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

Réponse `201 Created`, en-tête `Location: /api/v1/orders/:orderId` et `{ "data": Order }`. Le backend valide les quantités, disponibilité et stock, recalcule les prix et frais de livraison dans une transaction, décrémente le stock au moment de la création, puis crée la commande. Stock insuffisant : `409 stock_unavailable`; entrée invalide : `422 validation_error`. Rejouer accidentellement une requête de commande ne doit pas créer silencieusement de doublon; prévoir une clé `Idempotency-Key` pour l’envoi du formulaire.

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
| `Product.id: number`, `image`, `category: string`, `rating.rate/count` | Le MVP garde les IDs numériques pour les produits et mappe `imageUrl`, catégorie `{id,name,slug}` et rating `average/count` vers le modèle de présentation. Une note absente reste `null`; les prix Fake Store ne sont pas convertis en XOF. |
| `discount?: number`, `createdAt?: string`, `stock?: number` | Remplacer les optionnels de démonstration par les propriétés du DTO; afficher promotions/nouveautés/stock uniquement avec leurs données serveur. |
| Panier Redux `{id,name,price,image,quantity}` | Conserver les données d’affichage du panier local si utile, mais envoyer exclusivement `productId` et `quantity` au checkout; recharger les prix depuis l’API. |
| Formulaires login/register | Unifier le login sur `username`, aligner les thunks sur `/api/v1/auth/*`, utiliser la session cookie et appeler `/auth/me` au démarrage. |
| Checkout adresse | Mapper `phone1/phone2` vers `phone/secondaryPhone`; ne vider le panier qu’après réponse `201`. |
| Notes et commentaires locaux | Remplacer les états locaux par `GET/POST reviews`; ne montrer que des avis persistés. |

L’intégration se fait par un adaptateur de repository dans `infrastructure`, puis des ports/cas d’usage dans `application`. Les composants de présentation ne construisent pas les URL HTTP et ne consomment pas de modèles de persistance.

## 6. Hypothèses fonctionnelles du contrat

1. Devise confirmée : FCFA (XOF). L’interface affiche XOF; les montants Fake Store restent de simples valeurs de démonstration sans conversion. Les prix réels XOF viendront du backend.
2. Zones desservies et éventuels frais supplémentaires selon la destination.
3. Les promotions configurables et la durée de la fenêtre Nouveautés sont après MVP.
4. Le MVP exige un compte pour commander, conformément au middleware frontend actuel.
5. Le MVP accepte le paiement à la livraison uniquement; les transitions d’état proposées doivent être confirmées avec la gestion réelle des commandes.
6. Les avis, leur modération et les règles d’achat vérifié sont après MVP.
7. Identifiants proposés : UUID opaques côté backend, mappés depuis le modèle frontend actuellement numérique.
8. Socle MVP retenu : Route Handlers Next.js dans ce dépôt, PostgreSQL et Prisma ORM 7. NestJS séparé n’est pas nécessaire pour le périmètre initial.

## 7. Hors périmètre de ce contrat initial

Paiement en ligne, promotions par code coupon, newsletter, administration du catalogue, récupération de mot de passe, livraison connectée à un transporteur et notifications. Ajouter ces ressources après clarification des besoins métier.

## 8. Modèle relationnel proposé

Ce modèle est logique : il décrit les relations et contraintes à conserver, sans figer le schéma Prisma ni créer de migration.

| Table | Colonnes principales | Relations et contraintes |
| --- | --- | --- |
| `users` | `id`, `username`, `username_normalized`, `email`, `email_normalized`, `password_hash`, `created_at`, `updated_at` | Unicité sur les champs normalisés; mot de passe hashé uniquement. |
| `sessions` | `id`, `user_id`, `token_hash`, `expires_at`, `created_at` | `user_id → users`; index sur `token_hash` et `expires_at`; ne stocker aucun jeton en clair. |
| `categories` | `id`, `name`, `slug`, `created_at` | `slug` unique. |
| `products` | `id`, `category_id`, `title`, `description`, `image_url`, `price_xof`, `stock`, `is_published`, `created_at`, `updated_at` | `category_id → categories`; `price_xof >= 0`, `stock >= 0`; index catalogue sur publication/catégorie/date/prix. |
| `promotions` (après MVP) | `id`, `product_id`, `discount_percent`, `starts_at`, `ends_at`, `is_active` | `product_id → products`; remise bornée entre 1 et 100; dates valides; index sur produit et période. Une promotion active est calculée selon les dates serveur. |
| `orders` | `id`, `user_id`, `status`, adresse de livraison snapshot, `subtotal_xof`, `shipping_cost_xof`, `total_xof`, `payment_method`, `idempotency_key`, `created_at`, `updated_at` | `user_id → users` obligatoire dans le MVP; montants entiers XOF non négatifs; clé d’idempotence unique par utilisateur. |
| `order_items` | `id`, `order_id`, `product_id`, `product_title`, `image_url`, `unit_price_xof`, `quantity`, `line_total_xof` | `order_id → orders`; lien produit conservé si disponible, snapshot titre/image/prix pour l’historique; quantité entière positive. |
| `reviews` (après MVP) | `id`, `product_id`, `user_id`, `rating`, `comment`, `status`, `created_at` | `product_id → products`, `user_id → users`; note entière 1–5; unicité `(product_id, user_id)` si la règle d’un avis par acheteur est validée. |

Les identifiants peuvent être des UUID dans le backend. L’adaptateur frontend fera la conversion depuis les `Product.id` numériques actuels; les composants ne doivent pas dépendre du type d’identifiant choisi en base. Les catégories sont des entités propres, même si Fake Store API fournit actuellement leur nom sous forme de chaîne.

### Règles d’intégrité et transaction de commande

1. La création de commande se fait dans une transaction : recharger les produits publiés, vérifier les quantités et stocks, figer les prix et titres, calculer le sous-total, la livraison et le total, décrémenter le stock au moment de la création, puis enregistrer commande et lignes.
2. Les valeurs monétaires sont des entiers XOF. Le serveur est la seule autorité pour le prix, la remise, les frais de livraison et le total.
3. Politique de livraison actuellement implémentée dans le frontend : sous-total `< 10 000` = `1 000 XOF`; `10 000 ≤ sous-total < 20 000` = `500 XOF`; sous-total `≥ 20 000` = gratuit. Le backend devra partager cette règle, après confirmation des zones et éventuels suppléments.
4. Un produit non publié ou en quantité insuffisante provoque un rejet métier sans commande partielle. La création répétée avec la même clé d’idempotence renvoie le résultat initial au lieu de débiter/décrémenter deux fois.
5. La suppression d’un produit ne doit pas effacer les lignes historiques; conserver un snapshot indépendant du catalogue.

## 9. Flux d’API à implémenter

### Lecture du catalogue

Le frontend garde ses filtres et son tri dans l’état de page, mais passe progressivement la recherche et la pagination au serveur. Les paramètres connus sont `q`, `category`, `promotion`, `newArrivals`, `priceMin`, `priceMax`, `sort`, `page` et `perPage`. Le backend applique les filtres avant pagination et renvoie `meta.total` et `meta.totalPages`. Les listes de promotions/nouveautés ne sont servies que si leurs critères sont réels et configurés.

### Authentification

`POST /auth/register` valide et normalise username/email, crée le compte et répond sans hash. `POST /auth/login` accepte le champ frontend courant `username` comme identifiant (username ou email), puis établit une session cookie HttpOnly. `GET /auth/me` hydrate la session au démarrage; `POST /auth/logout` invalide la session côté serveur et expire le cookie. Le client ne stocke pas de token bearer dans Redux ou localStorage.

### Création et suivi de commande

1. Le navigateur soumet `items[{productId, quantity}]`, `deliveryAddress` et `paymentMethod`, avec `Idempotency-Key`; il ne soumet aucun montant faisant foi.
2. Le serveur valide l’adresse et le panier, vérifie session/propriété, stock, prix et frais, puis crée commande et snapshots dans la transaction décrite plus haut.
3. `201 Created` retourne `Order` et `Location`. Le frontend vide le panier seulement après ce succès, puis navigue vers la confirmation avec l’identifiant de commande.
4. Les pages de commande lisent `GET /orders` et `GET /orders/:orderId`; l’accès à une commande d’un autre compte répond `404` (ne pas révéler son existence).

Le paiement à la livraison est la seule méthode proposée par le parcours actuel. Aucun paiement en ligne ne doit être simulé par cette API.

## 10. Ordre d’implémentation recommandé pour le MVP

1. Confirmer la grille d’expédition, les produits/prix réels, le stock de départ et les règles de compte.
2. Ajouter les Route Handlers `/api/v1` au projet Next.js; placer contrats Zod et cas d’usage dans les couches actuelles, et Prisma 7/PostgreSQL derrière les adaptateurs `infrastructure`.
3. Créer la première migration avec `categories`, `products`, `users`, `sessions`, `orders` et `order_items`; laisser promotions et avis pour une migration ultérieure si leur besoin est confirmé.
4. Implémenter le catalogue public et remplacer Fake Store par le repository HTTP existant.
5. Implémenter inscription, connexion par cookie de session et `/auth/me`; aligner l’interface existante sur ces routes.
6. Implémenter création/liste/détail des commandes, recalcul des montants, contrôle du stock, transaction et idempotence; connecter ensuite le checkout et la confirmation.
7. Vérifier le parcours complet catalogue → compte → panier → commande et les erreurs de validation/conflit avant le déploiement.

À chaque étape, le frontend valide les DTO reçus à la frontière avec Zod, mappe les DTO vers ses modèles de présentation et garde les URL/appels HTTP dans `infrastructure`. Les contrôles d’accès et règles de validation sont toujours répétés côté serveur : la validation du navigateur améliore l’UX mais ne protège pas l’API.

## 11. Décisions à confirmer avant les migrations

- **Compte obligatoire :** le middleware actuel protège panier/checkout. Le MVP suit ce parcours et lie chaque commande à un compte; si l’achat invité est souhaité, le périmètre et l’accès sécurisé au suivi devront être revus.
- **Stock :** choisir la politique de réservation, son expiration éventuelle, et la transition/annulation qui restaure le stock.
- **Expédition :** confirmer les zones desservies, la grille (actuellement seuils 10 000/20 000 XOF) et les suppléments éventuels.
- **Nouveautés/promotions :** fixer la fenêtre d’arrivée et les personnes/outils autorisés à gérer les produits et promotions.
- **Identifiants :** confirmer IDs numériques compatibles frontend ou UUID internes avec mapping; la recommandation est UUID internes et identifiants frontend opaques en chaîne.
- **Comptes et avis :** confirmer unicité/normalisation username, longueur minimale du mot de passe (frontend actuel : 6), vérification d’achat, modération et règles de suppression.

Ces points ne bloquent pas l’ajout des Route Handlers ou le démarrage de la migration catalogue. Il faut toutefois confirmer expédition, stock initial et règles de compte avant de figer la création de commande en production.

## 12. Hors périmètre MVP et évolution

- **MVP :** catalogue, catégories, inscription, connexion/session, commande à la livraison et consultation par le compte propriétaire.
- **Après MVP :** promotions administrables, fenêtre de nouveautés configurable, avis, outil d’administration, récupération de mot de passe et automatisation de livraison.
- **Non prévu sans nouveau besoin :** paiement en ligne, coupons et panier synchronisé entre appareils.

Le déploiement MVP reste celui de l’application Next.js; il faut une base PostgreSQL accessible depuis l’environnement de déploiement et les variables de connexion documentées sans secrets dans Git. Un backend séparé NestJS ne sera envisagé que si le produit nécessite plus tard un service indépendant (autres clients, équipe dédiée, charge ou cycle de déploiement distincts).
