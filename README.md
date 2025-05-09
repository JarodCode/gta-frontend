# GameBoxd

GameBoxd est une application web inspirée de Letterboxd, mais dédiée aux jeux vidéo. Elle permet aux utilisateurs de noter, critiquer et cataloguer leurs jeux préférés.

## Fonctionnalités principales

- Parcourir une base de données de jeux vidéo.
- Ajouter des critiques, des notes et des listes personnalisées.
- Interface responsive en HTML/CSS/JavaScript pur.
- Serveur statique en Deno (aucun framework utilisé).

## Lancement du projet

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/ton-utilisateur/gameboxd.git
   ```

2. Lancer un serveur local avec Deno :
   ```bash
   deno run --allow-net --allow-read server.ts
   ```

## Arborescence du projet

- `index.html` — Page d'accueil
- `style.css` — Feuille de style principale
- `app.js` — Logique de l'application
- `server.ts` — Serveur Deno pour héberger les fichiers statiques

## À venir

- Authentification utilisateur
- Intégration d'une API de jeux (IGDB ou RAWG)
- Système de commentaires


