PLANIT AI

Présentation

PLANIT AI est une application web qui permet de créer et de gérer des projets. Le but est de transformer un brief en plusieurs tâches à l'aide de l'intelligence artificielle et de suivre l'avancement du projet.

Fonctionnalités

- Création et suppression des projets.
- Génération automatique des tâches.
- Validation du formulaire.
- Affichage des statistiques sur le Dashboard.
- Gestion des tâches avec un tableau Kanban (To Do, In Progress, Done).
- Modification et suppression des tâches.
- Gestion des dépendances entre les tâches.
- Sauvegarde des projets dans le LocalStorage.

L'application contient deux modes :

Mode Demo : utilisation d'un fichier JSON local pour générer les tâches sans API.

Mode Real : utilisation de l'API Groq pour générer les tâches à partir du brief.

Technologies utilisées

HTML, CSS, Tailwind CSS, JavaScript, JSON, Fetch API, LocalStorage, SessionStorage, Groq API, Git et GitHub.

Les pages du projet

index.html : Dashboard et affichage des projets.

new-project.html : formulaire de création d'un projet.

project.html : affichage et gestion des tâches.

Organisation des fichiers JavaScript

main.js : initialisation de l'application.

api.js : communication avec l'API.

prompt.js : préparation du prompt.

ui.js : affichage et manipulation du DOM.

project.js : gestion des projets et des tâches.

storage.js : sauvegarde des données.

state.js : gestion de l'état de l'application.

validation.js : validation des données générées.

utils.js : calcul de la progression et des statistiques.

Comment lancer le projet

Cloner le repository GitHub, ouvrir le dossier dans VS Code et lancer index.html avec Live Server.

Pour utiliser le mode Real, il faut ajouter une clé API Groq dans les paramètres de l'application. La clé est enregistrée dans le SessionStorage.

Auteur : Ayoub Boussih

Formation : Développement Full Stack - YouCode

Projet réalisé en novembre 2026.
