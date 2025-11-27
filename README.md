# Projet Formations Angular

Application Angular pour la gestion de formations avec TailwindCSS et Angular Material.

## Prérequis

- Node.js (version 18 ou supérieure)
- npm (généralement inclus avec Node.js)

## Installation

1. Naviguez dans le dossier du projet :
```bash
cd formations-src
```

2. Installez les dépendances :
```bash
npm install
```

## Lancement de l'application

Pour lancer le serveur de développement :

```bash
ng serve
```

ou

```bash
npm start
```

L'application sera accessible à l'adresse : `http://localhost:4200`

## Structure du projet

- `src/app/` - Code source de l'application
  - `pages/` - Composants de pages (Home, Catalog, Create, Detail, Profile)
  - `layout/` - Composants de mise en page (Navbar)
  - `shared/` - Composants partagés (FormationCard, DistanceFilter)
  - `services/` - Services Angular (FormationService, UserService, DistanceService)
  - `models/` - Modèles TypeScript

## Technologies utilisées

- Angular 18 (standalone components)
- Angular Material
- TailwindCSS
- TypeScript
- RxJS

## Fonctionnalités

- Catalogue de formations avec filtres
- Création de formations
- Détails des formations
- Profil utilisateur
- Gestion des rôles (admin/user)
- Calcul de distance
- Notifications avec MatSnackBar

