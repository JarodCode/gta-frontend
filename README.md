# GameTrackr Frontend

GameTrackr est une plateforme web inspirée de Letterboxd, dédiée aux jeux vidéo. Ce dépôt contient le frontend de l'application, développé en HTML, CSS et JavaScript pur sans framework.

## Fonctionnalités

- Interface utilisateur complète et responsive
- Parcourir et rechercher une base de données de jeux vidéo
- Système de notation et critiques de jeux
- Authentification sécurisée avec JWT
- Communication avec l'API backend via Fetch API

## Prérequis

- [Deno](https://deno.land/) v1.44 ou supérieur
- Navigateur web moderne (Chrome, Firefox, Edge, Safari)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/gametrackr-frontend.git
   cd gametrackr-frontend
   ```

2. Copier le fichier d'environnement exemple :
   ```bash
   cp .env.example .env
   ```

3. Configurer les variables d'environnement dans le fichier `.env`

## Lancement du serveur de développement

```bash
deno task dev
```

Par défaut, le serveur démarre sur le port 3000. Vous pouvez accéder à l'application à l'adresse [http://localhost:3000](http://localhost:3000).

## Structure du projet

- `index.html` — Page d'accueil de l'application
- `components/` — Composants HTML réutilisables (header, footer, etc.)
- `pages/` — Pages de l'application (jeux, profil, login, etc.)
- `css/` — Feuilles de style CSS
  - `global.css` — Styles globaux et variables
  - `components/` — Styles spécifiques aux composants
- `js/` — Scripts JavaScript
  - `api/` — Modules de communication avec l'API
  - `utils/` — Fonctions utilitaires
- `images/` — Ressources graphiques
- `data/` — Données locales (utilisateurs, critiques, etc.)
- `server.js` — Serveur Deno pour le développement

## Fonctionnalités principales

### Authentification
- Inscription et connexion des utilisateurs
- Gestion des sessions avec JWT
- Protection des routes nécessitant une authentification

### Catalogue de jeux
- Recherche et filtrage des jeux
- Affichage détaillé des informations de jeux
- Tri par popularité, date de sortie, etc.

### Système de critiques
- Notation des jeux (de 1 à 5 étoiles)
- Rédaction de critiques textuelles
- Consultation des critiques d'autres utilisateurs

### Profil utilisateur
- Affichage des jeux notés
- Statistiques personnelles
- Gestion des informations du compte




