document.addEventListener('DOMContentLoaded', function () {
    const formSection = document.getElementById('formSection');
    const resultSection = document.getElementById('resultSection');
    const flowerForm = document.getElementById('flowerForm');
    const backBtn = document.getElementById('backBtn');
    const generateBtn = document.getElementById('generateBtn');

    const nameInput = document.getElementById('nameInput');
    const flowerType = document.getElementById('flowerType');
    const flowerColor = document.getElementById('flowerColor');
    const flowerPetals = document.getElementById('flowerPetals');
    const flowerAdjective = document.getElementById('flowerAdjective');
    const flowerEffect = document.getElementById('flowerEffect');
    const flowerMessage = document.getElementById('flowerMessage');
    const flowerId = document.getElementById('flowerId');
    const compatibilityBar = document.getElementById('compatibilityBar');
    const compatibilityPercent = document.getElementById('compatibilityPercent');
    const compatibilityText = document.getElementById('compatibilityText');
    const successMessage = document.getElementById('successMessage');
    const shareBtn = document.getElementById('shareBtn');
    const saveBtn = document.getElementById('saveBtn');

    const colorClasses = {
        "Rouge": "flower-red",
        "Rose": "flower-pink",
        "Blanc": "flower-white",
        "Jaune": "flower-yellow",
        "Violet": "flower-purple",
        "Orange": "flower-orange",
        "Bleu": "flower-blue",
        "Multicolore": "flower-multi"
    };

    const compatibilityMessages = {
        95: "une connexion magique et éternelle",
        85: "une relation profonde et sincère",
        75: "une belle harmonie",
        65: "une attirance naturelle"
    };

    flowerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = nameInput.value.trim() || "Mon Amour";

        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Génération en cours...';

        try {
            const response = await fetch('/api/generate_flower', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name })
            });

            const flower = await response.json();

            updateFlowerDisplay(flower);

            setTimeout(() => {
                formSection.classList.add('hidden');
                resultSection.classList.remove('hidden');
                resultSection.classList.add('animate-fadeIn');

                generateBtn.disabled = false;
                generateBtn.innerHTML = '<i class="fas fa-magic mr-2"></i> 🌸 Faire pousser une fleur magique 🌸';

                successMessage.classList.remove('hidden');
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 3000);

                createConfetti();
            }, 500);

        } catch (error) {
            console.error('Erreur:', error);
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-magic mr-2"></i> 🌸 Faire pousser une fleur magique 🌸';
            alert("Une erreur s'est produite. Veuillez réessayer.");
        }
    });

    backBtn.addEventListener('click', function () {
        resultSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        formSection.classList.add('animate-fadeIn');

        nameInput.value = '';
        nameInput.focus();
    });

    shareBtn.addEventListener('click', function () {
        const message = `🌸 J'ai créé une fleur magique pour toi ! ${flowerMessage.textContent} 🌸`;

        if (navigator.share) {
            navigator.share({
                title: 'Ma Fleur Magique d\'Amour',
                text: message,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(message).then(() => {
                const originalText = shareBtn.innerHTML;
                shareBtn.innerHTML = '<i class="fas fa-check"></i> Copié !';
                setTimeout(() => {
                    shareBtn.innerHTML = originalText;
                }, 2000);
            });
        }
    });

    saveBtn.addEventListener('click', function () {
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Sauvegardé !';

        setTimeout(() => {
            saveBtn.innerHTML = originalText;
        }, 2000);
    });

    function updateFlowerDisplay(flower) {
        flowerType.textContent = flower.type;
        flowerColor.textContent = flower.color;
        flowerPetals.textContent = flower.petals;
        flowerAdjective.textContent = flower.adjective;
        flowerEffect.textContent = flower.effect;
        flowerMessage.textContent = flower.message;
        flowerId.textContent = flower.unique_id;

        compatibilityPercent.textContent = flower.compatibility;
        compatibilityBar.style.width = `${flower.compatibility}%`;

        let compMessage = "une belle connexion";
        if (flower.compatibility >= 95) compMessage = "une connexion magique et éternelle";
        else if (flower.compatibility >= 85) compMessage = "une relation profonde et sincère";
        else if (flower.compatibility >= 75) compMessage = "une belle harmonie";
        compatibilityText.textContent = compMessage;

        createPetals(flower);
    }

    function createPetals(flower) {
        const petalsContainer = document.getElementById('petalsContainer');
        petalsContainer.innerHTML = '';

        const petalCount = flower.petals;
        const colorClass = colorClasses[flower.color] || 'flower-red';

        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = `absolute ${colorClass} rounded-full`;
            petal.style.width = '60px';
            petal.style.height = '100px';
            petal.style.opacity = '0.9';
            petal.style.filter = 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))';

            const angle = (i / petalCount) * 360;
            const radius = 80; // Rayon du cercle
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);

            petal.style.left = `calc(50% + ${x}px - 30px)`;
            petal.style.top = `calc(50% + ${y}px - 50px)`;
            petal.style.transform = `rotate(${angle}deg)`;
            petal.style.transformOrigin = 'bottom center';

            petal.style.animation = `float ${3 + i * 0.2}s ease-in-out infinite`;
            petal.style.animationDelay = `${i * 0.1}s`;

            petalsContainer.appendChild(petal);
        }

        const flowerCenter = document.getElementById('flowerCenter');
        flowerCenter.style.animation = 'pulse-heart 2s ease-in-out infinite';

        if (flower.color === "Multicolore") {
            petalsContainer.style.animation = 'spin-petal 10s linear infinite';
        }
    }

    function createConfetti() {
        const emojis = ['💖', '🌸', '🌷', '🌹', '💐', '✨', '🥰', '😍', '💝', '🎀'];
        const colors = ['text-rose-400', 'text-pink-400', 'text-purple-400', 'text-yellow-400'];

        for (let i = 0; i < 25; i++) {
            const confetti = document.createElement('div');
            confetti.className = `fixed text-2xl pointer-events-none z-50 ${colors[Math.floor(Math.random() * colors.length)]}`;
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-30px';
            confetti.style.opacity = '0.8';

            document.body.appendChild(confetti);

            const duration = 2 + Math.random() * 2;
            const endX = (Math.random() - 0.5) * 200;

            confetti.animate([
                {
                    transform: 'translate(0, 0) rotate(0deg)',
                    opacity: 0.8
                },
                {
                    transform: `translate(${endX}px, ${window.innerHeight}px) rotate(${720}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });

            setTimeout(() => confetti.remove(), duration * 1000);
        }
    }

    nameInput.focus();
});