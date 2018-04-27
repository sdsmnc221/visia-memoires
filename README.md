# Mémoires de Madame Charlotte Arbaleste

## Live Demo

    https://visia.antr.tech/memoires

## Démarrer

Le code source de tout le développement se trouve dans le dossier dev.
Le code compilé (ou la production) se trouve dans le dossier dist.
La transformation (et compilation, minification, etc.) du dev au dist se faire avec NodeJS, Gulp et Browserify (et autres).

### Mode Production

Héberger le dossier dist sur un serveur.

Accéder à la page index.html

    dist/index.html

(Attention, le fichier index.html peut être ouvrir en local, mais la récupération des données, qui se fait avec l'API Fetch - les requêtes HTTP(S) CORS en gros, ne marche pas sans serveur.)

### Mode Développement

Installer NodeJS et NPM.

Installer Gulp.

    $(sudo) npm i -g gulp

Installer les dépendanceS.

    $ (sudo) npm i -unsafe-perm

Lancer Gulp.

    $ gulp
    
    // s'il y a des erreurs de manque de dépendances X
    // (très rarement mais si c'est le cas, c'est souvent
    // babel-core, node-sass), il faudrait les installer :
    $ (sudo) npm i --save-dev --unsafe-perm babel-core node-sass etc 

Accéder au serveur. 

    http://localhost:8080

Et voilà !

## Développer

Lancer Gulp et modifier les fichiers du dossier dev, la page recharge automatiquement après tout changement (grâce à un serveur avec la possibilité de live-reload).

Attention :

- Javascript POO : les scripts sont structurés à peu près en classses/composants, services, et sont en Javascript ES6+ (qui sont compilés automatiquement en Javascript version adaptée à tout navigateur (enfin, moderne))) (à ne jamais chercher à comprendre dist/script/app.js)
- SASS modulaire : les feuilles de styles sont aussi structurés en modules (helpers/utils) et composants.
