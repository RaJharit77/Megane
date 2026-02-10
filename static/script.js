document.addEventListener('DOMContentLoaded', function () {
    // Éléments DOM
    const generateBtn = document.getElementById('generateBtn');
    const generatePoemBtn = document.getElementById('generatePoemBtn');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const loadInfoBtn = document.getElementById('loadInfoBtn');

    // Éléments d'affichage
    const flowerType = document.getElementById('flowerType');
    const flowerColor = document.getElementById('flowerColor');
    const flowerPetals = document.getElementById('flowerPetals');
    const flowerSize = document.getElementById('flowerSize');
    const flowerScent = document.getElementById('flowerScent');
    const flowerEffect = document.getElementById('flowerEffect');
    const messageDisplay = document.getElementById('messageDisplay');
    const quoteDisplay = document.getElementById('quoteDisplay');
    const poemDisplay = document.getElementById('poemDisplay');
    const messageResponse = document.getElementById('messageResponse');
    const valentineFacts = document.getElementById('valentineFacts');

    // Couleurs pour les pétales
    const colorMap = {
        "Rouge": "#ff4d4d",
        "Rose": "#ff85a2",
        "Blanc": "#ffffff",
        "Jaune": "#ffdd59",
        "Violet": "#9b59b6",
        "Orange": "#ff9f43",
        "Bordeaux": "#b33939"
    };

    // Générer une fleur
    generateBtn.addEventListener('click', generateFlower);

    // Générer un poème
    generatePoemBtn.addEventListener('click', generatePoem);

    // Envoyer un message
    sendMessageBtn.addEventListener('click', sendMessage);

    // Charger les informations sur la Saint-Valentin
    loadInfoBtn.addEventListener('click', loadValentineInfo);

    // Générer une fleur initiale au chargement
    generateFlower();

    // Fonction pour générer une fleur
    async function generateFlower() {
        try {
            const response = await fetch('/api/generate_flower');
            const flower = await response.json();

            // Mettre à jour les informations sur la fleur
            flowerType.textContent = flower.type;
            flowerColor.textContent = flower.color;
            flowerPetals.textContent = flower.petals;
            flowerSize.textContent = flower.size;
            flowerScent.textContent = flower.scent;
            flowerEffect.textContent = flower.special_effect;

            // Mettre à jour le message d'amour
            messageDisplay.textContent = flower.message;
            messageDisplay.classList.add('animate-fadeIn');

            // Mettre à jour la citation
            quoteDisplay.innerHTML = `"${flower.quote.quote}"<br><em>- ${flower.quote.author}</em>`;
            quoteDisplay.classList.add('animate-fadeIn');

            // Générer la fleur visuelle
            createVisualFlower(flower);

            // Animation du bouton
            generateBtn.classList.add('animate-pulse');
            setTimeout(() => {
                generateBtn.classList.remove('animate-pulse');
            }, 1000);

        } catch (error) {
            console.error('Erreur lors de la génération de la fleur:', error);
            messageDisplay.textContent = "Une erreur s'est produite. Veuillez réessayer.";
        }
    }

    // Fonction pour créer la fleur visuelle
    function createVisualFlower(flower) {
        const petalsContainer = document.querySelector('.petals');
        petalsContainer.innerHTML = '';

        const petalCount = flower.petals;
        const color = colorMap[flower.color] || '#ff85a2';

        // Créer les pétales
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.backgroundColor = color;
            petal.style.border = `2px solid ${darkenColor(color, 20)}`;
            petal.style.boxShadow = `0 2px 5px ${darkenColor(color, 30)}`;

            // Positionner les pétales en cercle
            const angle = (i / petalCount) * 360;
            petal.style.transform = `rotate(${angle}deg) translateY(-40px)`;

            petalsContainer.appendChild(petal);
        }

        // Ajuster la tige en fonction de la taille
        const stem = document.querySelector('.stem');
        if (flower.size === "Petite") {
            stem.style.height = "100px";
        } else if (flower.size === "Moyenne") {
            stem.style.height = "150px";
        } else if (flower.size === "Grande") {
            stem.style.height = "200px";
        } else {
            stem.style.height = "250px";
        }

        // Ajouter un effet spécial visuel
        const flowerCenter = document.querySelector('.flower-center');
        if (flower.special_effect.includes("Brille")) {
            flowerCenter.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.9)";
            flowerCenter.style.animation = "pulse 2s infinite";
        } else if (flower.special_effect.includes("Change de couleur")) {
            flowerCenter.style.animation = "pulse 3s infinite alternate";
        }
    }

    // Fonction pour assombrir une couleur
    function darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;

        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // Fonction pour générer un poème
    async function generatePoem() {
        try {
            const response = await fetch('/api/generate_poem');
            const poem = await response.json();

            let poemHTML = `<h4>${poem.title}</h4>`;
            poem.poem.forEach(line => {
                poemHTML += `<p>${line}</p>`;
            });
            poemHTML += `<p><em>${poem.author}</em></p>`;

            poemDisplay.innerHTML = poemHTML;
            poemDisplay.classList.add('animate-fadeIn');

            // Animation du bouton
            generatePoemBtn.classList.add('animate-pulse');
            setTimeout(() => {
                generatePoemBtn.classList.remove('animate-pulse');
            }, 1000);

        } catch (error) {
            console.error('Erreur lors de la génération du poème:', error);
            poemDisplay.innerHTML = "<p>Impossible de générer un poème pour le moment.</p>";
        }
    }

    // Fonction pour envoyer un message
    async function sendMessage() {
        const name = document.getElementById('senderName').value.trim();
        const message = document.getElementById('loveMessage').value.trim();

        if (!message) {
            showResponse("Veuillez écrire un message d'amour.", "error");
            return;
        }

        try {
            const response = await fetch('/api/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name || 'Anonyme',
                    message: message
                })
            });

            const result = await response.json();

            if (response.ok) {
                showResponse(result.data.confirmation, "success");
                document.getElementById('loveMessage').value = '';

                // Animation du bouton
                sendMessageBtn.classList.add('animate-pulse');
                setTimeout(() => {
                    sendMessageBtn.classList.remove('animate-pulse');
                }, 1000);
            } else {
                showResponse(result.error || "Une erreur s'est produite.", "error");
            }

        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            showResponse("Erreur de connexion. Veuillez réessayer.", "error");
        }
    }

    // Fonction pour afficher la réponse
    function showResponse(message, type) {
        messageResponse.textContent = message;
        messageResponse.style.display = 'block';

        if (type === "success") {
            messageResponse.style.backgroundColor = "#e6f7ff";
            messageResponse.style.color = "#0066cc";
            messageResponse.style.borderLeftColor = "#0066cc";
        } else {
            messageResponse.style.backgroundColor = "#ffe6e6";
            messageResponse.style.color = "#cc0000";
            messageResponse.style.borderLeftColor = "#cc0000";
        }

        setTimeout(() => {
            messageResponse.style.display = 'none';
        }, 5000);
    }

    // Fonction pour charger les informations sur la Saint-Valentin
    async function loadValentineInfo() {
        try {
            const response = await fetch('/api/valentine_info');
            const info = await response.json();

            let factsHTML = `
                <div class="fact-item">
                    <h4>📅 Date</h4>
                    <p>${info.date}</p>
                </div>
                <div class="fact-item">
                    <h4>📜 Origine</h4>
                    <p>${info.origin}</p>
                </div>
            `;

            // Symboles
            factsHTML += `
                <div class="fact-item">
                    <h4>💖 Symboles</h4>
                    <p>${info.symbols.join(', ')}</p>
                </div>
            `;

            // Traditions
            factsHTML += `
                <div class="fact-item">
                    <h4>🎁 Traditions</h4>
                    <ul>${info.traditions.map(t => `<li>${t}</li>`).join('')}</ul>
                </div>
            `;

            // Faits intéressants
            info.facts.forEach(fact => {
                factsHTML += `
                    <div class="fact-item">
                        <h4>✨ Fait intéressant</h4>
                        <p>${fact}</p>
                    </div>
                `;
            });

            valentineFacts.innerHTML = factsHTML;
            valentineFacts.classList.add('animate-fadeIn');

            // Animation du bouton
            loadInfoBtn.classList.add('animate-pulse');
            setTimeout(() => {
                loadInfoBtn.classList.remove('animate-pulse');
            }, 1000);

        } catch (error) {
            console.error('Erreur lors du chargement des informations:', error);
            valentineFacts.innerHTML = "<p>Impossible de charger les informations sur la Saint-Valentin.</p>";
        }
    }

    // Effets sonores (optionnels)
    function playSound(sound) {
        // Pour une vraie application, vous pourriez ajouter des effets sonores
        console.log(`Son joué: ${sound}`);
    }
});