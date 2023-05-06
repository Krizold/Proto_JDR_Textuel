// Création de la classe Personnage
class Personnage {
    constructor(nom, classe, vie, force, agilite, furtivite, intelligence) {
        this.nom = nom;
        this.classe = classe;
        this.vie = vie;
        this.force = force;
        this.agilite = agilite;
        this.furtivite = furtivite;
        this.intelligence = intelligence;
    }
}

let joueur;
let evenementsRestants = Math.floor(Math.random() * 11) + 5;

// Sélection de la classe et création du personnage
function selectClass(classe) {
    let nom = document.getElementById("nom").value;
    if (nom === "") {
        alert("Veuillez entrer un nom de personnage.");
        return;
    }

    let force = Math.floor(Math.random() * 11);
    let agilite = Math.floor(Math.random() * 11);
    let furtivite = Math.floor(Math.random() * 11);
    let intelligence = Math.floor(Math.random() * 11);

    switch (classe) {
        case 'Guerrier':
            force += 2;
            break;
        case 'Archer':
            agilite += 2;
            break;
        case 'Voleur':
            furtivite += 2;
            break;
        case 'Mage':
            intelligence += 2;
            break;
    }

    joueur = new Personnage(nom, classe, 20, force, agilite, furtivite, intelligence);

    document.getElementById("character-name").textContent = `${joueur.nom} le ${joueur.classe}`;

    // Mise à jour des statistiques du joueur
    updateStats();

    // Affichage du jeu
    document.getElementById("game").style.display = "block";
    document.getElementById("class-selection").style.display = "none";
}

// Mise à jour des statistiques affichées
function updateStats() {
    document.getElementById("stats").innerHTML = `
        Vie: ${joueur.vie} <br>
        Force: ${joueur.force} <br>
        Agilité: ${joueur.agilite} <br>
        Furtivité: ${joueur.furtivite} <br>
        Intelligence: ${joueur.intelligence}
    `;
}

// Gestion des déplacements du joueur
function goLeft() {
    processEvent();
}

function goRight() {
    processEvent();
}

function goStraight() {
    processEvent();
}

// Traitement des événements lors d'un déplacement
function processEvent() {
    if (evenementsRestants > 0) {
        evenementsRestants--;

        let eventType = Math.floor(Math.random() * 3);
        let message;

        switch (eventType) {
            case 0: // Rencontre positive
                message = handlePositiveEncounter();
                break;
            case 1: // Piège
                message = handleTrap();
                break;
            case 2: // Ennemi
                message = handleEnemyEncounter();
                break;
        }

        document.getElementById("message").innerHTML = message;
        updateStats();
    } else {
        document.getElementById("message").innerHTML = "Félicitations ! Vous avez trouvé le trésor !";
        document.getElementById("game").innerHTML = "<h2>Fin du jeu</h2>";
    }
}

// Gestion des rencontres positives
function handlePositiveEncounter() {
    let bonusType = Math.floor(Math.random() * 4);
    let bonusValue = Math.floor(Math.random() * 3) + 1;

    switch (bonusType) {
        case 0:
            joueur.force += bonusValue;
            return `Vous avez trouvé un objet qui augmente votre force de ${bonusValue} point(s).`;
        case 1:
            joueur.agilite += bonusValue;
            return `Vous avez trouvé un objet qui augmente votre agilité de ${bonusValue} point(s).`;
        case 2:
            joueur.furtivite += bonusValue;
            return `Vous avez trouvé un objet qui augmente votre furtivité de ${bonusValue} point(s).`;
        case 3:
            joueur.intelligence += bonusValue;
            return `Vous avez trouvé un objet qui augmente votre intelligence de ${bonusValue} point(s).`;
    }
}

// Gestion des pièges
function handleTrap() {
    let malusType = Math.floor(Math.random() * 4);
    let malusValue = Math.floor(Math.random() * 3) + 1;

    switch (malusType) {
        case 0:
            joueur.force = Math.max(0, joueur.force - malusValue);
            return `Vous êtes tombé dans un piège qui diminue votre force de ${malusValue} point(s).`;
        case 1:
            joueur.agilite = Math.max(0, joueur.agilite - malusValue);
            return `Vous êtes tombé dans un piège qui diminue votre agilité de ${malusValue} point(s).`;
        case 2:
            joueur.furtivite = Math.max(0, joueur.furtivite - malusValue);
            return `Vous êtes tombé dans un piège qui diminue votre furtivité de ${malusValue} point(s).`;
        case 3:
            joueur.intelligence = Math.max(0, joueur.intelligence - malusValue);
            return `Vous êtes tombé dans un piège qui diminue votre intelligence de ${malusValue} point(s).`;
    }
}

// Gestion des rencontres avec des ennemis
function handleEnemyEncounter() {
    let enemyClass = ['Guerrier', 'Archer', 'Voleur', 'Mage'][Math.floor(Math.random() * 4)];
    let enemy = generateRandomCharacter(enemyClass);
    let result = combat(joueur, enemy);

    if (result) {
        return `Vous avez vaincu un ${enemy.classe} ennemi !`;
    } else {
        joueur.vie = 0;
        updateStats();
        document.getElementById("game").innerHTML = "<h2>Vous êtes mort... Fin du jeu.</h2>";
        return `Vous avez été vaincu par un ${enemy.classe} ennemi...`;
    }
}

// Génération d'un personnage ennemi aléatoire
function generateRandomCharacter(classe) {
    let force = Math.floor(Math.random() * 11);
    let agilite = Math.floor(Math.random() * 11);
    let furtivite = Math.floor(Math.random() * 11);
    let intelligence = Math.floor(Math.random() * 11);

    switch (classe) {
        case 'Guerrier':
            force += 2;
            break;
        case 'Archer':
            agilite += 2;
            break;
        case 'Voleur':
            furtivite += 2;
            break;
        case 'Mage':
            intelligence += 2;
            break;
    }

    return new Personnage("Ennemi", classe, 20, force, agilite, furtivite, intelligence);
}

// Combat entre le joueur et l'ennemi
function combat(player, enemy) {
    while (player.vie > 0 && enemy.vie > 0) {
        let playerAttack = getPlayerAttack(player);
        let enemyAttack = getEnemyAttack(enemy);

        enemy.vie -= playerAttack.damage;
        if (enemy.vie <= 0) {
            player.vie += 2; // Récupérer 2 points de vie après avoir gagné
            if (player.vie > 20) { // Assurez-vous que la vie ne dépasse pas la valeur maximale
                player.vie = 20;
            }
            return true;
        }

        player.vie -= enemyAttack.damage;
        if (player.vie <= 0) {
            return false;
        }
    }
}


// Récupération des attaques du joueur selon sa classe et des attaques standard
function getPlayerAttack(player) {
    const attacks = [
        getStandardAttack(),
        getClassSpecificAttack(player)
    ];

    return attacks[Math.floor(Math.random() * attacks.length)];
}

// Récupération des attaques standard
function getStandardAttack() {
    return {
        name: "Attaque standard",
        damage: 2 // Vous pouvez modifier la valeur des dégâts de l'attaque standard
    };
}

// Récupération des attaques spécifiques à la classe du joueur
function getClassSpecificAttack(player) {
    switch (player.classe) {
        case 'Guerrier':
            return {
                name: "Attaque puissante",
                damage: player.force
            };
        case 'Archer':
            return {
                name: "Tir à l'arc",
                damage: player.agilite
            };
        case 'Voleur':
            return {
                name: "Attaque furtive",
                damage: player.furtivite
            };
        case 'Mage':
            return {
                name: "Boule de feu",
                damage: player.intelligence
            };
    }
}

// Récupération des attaques de l'ennemi selon sa classe et des attaques standard
function getEnemyAttack(enemy) {
    const attacks = [
        getEnemyStandardAttack(),
        getEnemyClassSpecificAttack(enemy)
    ];

    return attacks[Math.floor(Math.random() * attacks.length)];
}

// Récupération des attaques standard pour les ennemis
function getEnemyStandardAttack() {
    return {
        name: "Attaque standard",
        damage: 2 // Vous pouvez modifier la valeur des dégâts de l'attaque standard
    };
}

// Récupération des attaques spécifiques à la classe de l'ennemi
function getEnemyClassSpecificAttack(enemy) {
    switch (enemy.classe) {
        case 'Guerrier':
            return {
                name: "Attaque puissante",
                damage: enemy.force
            };
        case 'Archer':
            return {
                name: "Tir à l'arc",
                damage: enemy.agilite
            };
        case 'Voleur':
            return {
                name: "Attaque furtive",
                damage: enemy.furtivite
            };
        case 'Mage':
            return {
                name: "Boule de feu",
                damage: enemy.intelligence
            };
    }
}

