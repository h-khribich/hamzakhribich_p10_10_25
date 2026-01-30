<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>
<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs

# Installation et démarrage
Clonez le projet pour le récupérer
``` 
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```
Pour démarrer l'API avec ça base de données.
```
docker compose up -d
```
# Pour démarrer le frontend de l'applicatif
Rendez-vous dans le dossier frontend
```
cd ./frontend
```
Installez les dépendances du projet
```
npm i
ou
npm install (si vous préférez)
```
# Ouvrir l'interface graphique

Cypress dispose d'une interface graphique pour visualiser le processus de  test.

Pour utiliser cette interface, entrez dans la console:

`npx cypress open`

Cette dernière est constituée du test en cours et un aperçu de l'application

![Capture d'écran interface graphique](https://docs.cypress.io/img/app/core-concepts/open-mode/first-test-console-output.png)

# (Optionnel) Lancer les tests sur le terminal

Cette commande n'ouvrira pas l'interface graphique mais exécutera les tests sur le terminal. Cela peut être utile quand il n'y a pas besoin de visuel et permet une exécution plus rapide des tests (pertinent pour de la non-régression par example)

`npx cypress run`

![Capture d'écran tests sur terminal](https://browserstack.wpenginepowered.com/wp-content/uploads/2021/07/11.png)

# Obtenir un rapport de test

Cette commande lancera un test qui fournira un rapport complet. Elle créera également un dossier "reports" dans lequel un fichier index.html pourra être ouvert avec le navigateur et fournir un rapport clair et lisible

`npm run test:report`

![Rapport Mochawesome](/rapport.png)


# Structure du projet

Les projets Cypress disposent d'une structure simple:


- Un fichier **e2e**, nos tests réunis dans des scénarios qui regroupent plusieurs tests communs (login, capteurs, évènements...)


- Un fichier **fixtures** qui contient des jeux de données statiques (non dynamiques, tels que des identifiants, mots de passe...) utilisés pour mocker de la data nécessaire à certaines requêtes utilisateur par example

- Le fichier **support** peut contenir nos commandes personnalisées (par exemple une commande Cypress pour attraper un certain élément HTML que l'on utlise souvent). On peut aussi y mettre des hooks de cycle de vie, ce sont des évènements qui s'éxécuteront à un stade spécifique d'un test (juste avant ou juste après, pour nettoyer l'environnement par exemple)

- Divers fichiers de **configuration**, comme celui de Cypress ou la configuration GitLab
```
cypress/
├── e2e/
│   ├── home.cy.js          # Test page d'accueil
│   ├── login.cy.js         # Test d'authentification
│   └── ...
├── fixtures/               # Jeux de données statiques
│   └── users.json
├── support/
│   ├── commands.js         # Commandes personnalisées
│   ├── utils.js            # Fonctions utilitaires
│   └── e2e.js              # Hooks cycle de vie
cypress.config.js           # Configuration Cypress
.gitlab-ci.yml              # Configuration GitLab CLI
```

# Structure d'un test

La structure d'un test automatique Cypress est assez similaire à l'approche **Gherkin** de rédaction de test.

1. **Étant donné** que je suis sur la page de login

2. **Quand** je clique sur _"Se connecter"_

3. **Alors** je suis dirigé vers le dashboard

Dans son essence la plus simple, un test auto doit donc disposer d'une **mise en situation** initiale, une **assertion** doit être effectué et cette dernière doit être **verifiée**.


```
describe('Login', () => {
  it('should log in successfully with valid credentials', () => {
    cy.visit('/login')

    cy.get('[data-e2e=email]').type('demodws@itk.fr')
    cy.get('[data-e2e=password]').type('securePassword123')
    cy.get('[data-e2e=submit]').click()

    cy.url().should('include', '/dashboard')
    cy.contains('Welcome, John Doe').should('be.visible')
  })
})
```

La principale fonction de Cypress sera de vérifier des assertions, nous pouvons "chainer" ces assertions pour les valider les unes après les autres comme suit:

- `cy.url(...).should(...)` → Verifie le routing URL

- `cy.contains(...).should(...)` → Valide la présence d'un text

- `cy.get(...).should(...)` → Confirme l'état du DOM

- `cy.intercept(...)` → Verifie le comportement d'une API




