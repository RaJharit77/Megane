document.addEventListener('DOMContentLoaded', function () {
    // Éléments DOM
    const elements = {
        formSection: document.getElementById('formSection'),
        resultSection: document.getElementById('resultSection'),
        flowerForm: document.getElementById('flowerForm'),
        backBtn: document.getElementById('backBtn'),
        generateBtn: document.getElementById('generateBtn'),
        nameInput: document.getElementById('nameInput'),
        flowerType: document.getElementById('flowerType'),
        flowerColor: document.getElementById('flowerColor'),
        flowerPetals: document.getElementById('flowerPetals'),
        flowerAdjective: document.getElementById('flowerAdjective'),
        flowerEffect: document.getElementById('flowerEffect'),
        flowerMessage: document.getElementById('flowerMessage'),
        flowerId: document.getElementById('flowerId'),
        compatibilityBar: document.getElementById('compatibilityBar'),
        compatibilityPercent: document.getElementById('compatibilityPercent'),
        compatibilityText: document.getElementById('compatibilityText'),
        successMessage: document.getElementById('successMessage'),
        downloadImageBtn: document.getElementById('downloadImageBtn'),
        downloadPdfBtn: document.getElementById('downloadPdfBtn'),
        flowerContainer: document.getElementById('flowerContainer')
    };

    let currentFlower = null;

    // Événements
    initializeEvents();

    function initializeEvents() {
        elements.flowerForm.addEventListener('submit', handleFormSubmit);
        elements.backBtn.addEventListener('click', handleBackClick);
        elements.downloadImageBtn.addEventListener('click', handleImageDownload);
        elements.downloadPdfBtn.addEventListener('click', handlePdfDownload);

        // Focus sur l'input au chargement
        elements.nameInput.focus();
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        const name = elements.nameInput.value.trim() || "Mon Amour";
        elements.generateBtn.disabled = true;
        elements.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération en cours...';

        try {
            const flower = await generateFlower(name);
            currentFlower = flower;

            updateFlowerDisplay(flower);

            // Transition vers la section résultats
            setTimeout(() => {
                switchToResultSection();
                showSuccessMessage();
                createConfetti();
            }, 500);

        } catch (error) {
            console.error('Erreur:', error);
            alert("Une erreur s'est produite. Veuillez réessayer.");
        } finally {
            elements.generateBtn.disabled = false;
            elements.generateBtn.innerHTML = '<i class="fas fa-magic"></i> 🌸 Faire pousser une fleur magique 🌸';
        }
    }

    async function generateFlower(name) {
        const response = await fetch('/api/generate_flower', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    }

    function updateFlowerDisplay(flower) {
        // Mettre à jour les textes
        elements.flowerType.textContent = flower.type;
        elements.flowerColor.textContent = flower.color;
        elements.flowerPetals.textContent = flower.petals;
        elements.flowerAdjective.textContent = flower.adjective;
        elements.flowerEffect.textContent = flower.effect;
        elements.flowerMessage.textContent = flower.message;
        elements.flowerId.textContent = flower.unique_id;

        // Compatibilité
        elements.compatibilityPercent.textContent = flower.compatibility;
        elements.compatibilityBar.style.width = `${flower.compatibility}%`;
        elements.compatibilityText.textContent = getCompatibilityText(flower.compatibility);

        // Créer la fleur visuelle
        createRealisticFlower(flower);
    }

    function getCompatibilityText(percent) {
        if (percent >= 95) return "une connexion magique et éternelle";
        if (percent >= 85) return "une relation profonde et sincère";
        if (percent >= 75) return "une belle harmonie";
        return "une belle connexion";
    }

    function createRealisticFlower(flower) {
        elements.flowerContainer.innerHTML = '';

        const petalCount = flower.petals;
        const color = flower.color_hex;
        const isMulticolor = flower.color === "Multicolore";

        // Créer la fleur
        const flowerDiv = document.createElement('div');
        flowerDiv.className = 'flower-animated';

        // Pétales
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'flower-petal';

            // Position et rotation
            const angle = (i / petalCount) * 360;
            const radius = 80;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;

            // Style
            petal.style.transform = `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;

            // Couleur
            if (isMulticolor) {
                const hue = (i * 30) % 360;
                petal.style.background = `linear-gradient(135deg, hsl(${hue}, 100%, 65%), hsl(${hue + 20}, 100%, 55%))`;
            } else {
                petal.style.background = color;
            }

            flowerDiv.appendChild(petal);
        }

        // Centre de la fleur
        const center = document.createElement('div');
        center.className = 'flower-center';
        flowerDiv.appendChild(center);

        elements.flowerContainer.appendChild(flowerDiv);

        // Ajouter des styles CSS dynamiques
        addFlowerStyles();
    }

    function addFlowerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .flower-animated {
                position: relative;
                width: 200px;
                height: 200px;
                animation: float 3s ease-in-out infinite;
            }
            
            .flower-petal {
                position: absolute;
                width: 40px;
                height: 80px;
                border-radius: 50%;
                top: 50%;
                left: 50%;
                margin: -40px 0 0 -20px;
                animation: pulse-heart 2s ease-in-out infinite;
                animation-delay: calc(var(--i, 0) * 0.1s);
            }
            
            .flower-center {
                position: absolute;
                width: 50px;
                height: 50px;
                background: radial-gradient(circle, #ffd700, #ffaa00);
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: pulse-heart 1.5s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    function handleBackClick() {
        elements.resultSection.classList.add('hidden');
        elements.formSection.classList.remove('hidden');
        elements.formSection.classList.add('active');
        elements.nameInput.value = '';
        elements.nameInput.focus();
    }

    async function handleImageDownload() {
        if (!currentFlower) {
            alert("Veuillez d'abord générer une fleur.");
            return;
        }

        const originalText = elements.downloadImageBtn.innerHTML;
        elements.downloadImageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';

        try {
            const response = await fetch('/api/download_card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentFlower)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fleur_magique_${currentFlower.unique_id}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur lors du téléchargement.");
        } finally {
            elements.downloadImageBtn.innerHTML = originalText;
        }
    }

    async function handlePdfDownload() {
        if (!currentFlower) {
            alert("Veuillez d'abord générer une fleur.");
            return;
        }

        const originalText = elements.downloadPdfBtn.innerHTML;
        elements.downloadPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Préparation...';

        try {
            // Utiliser html2canvas pour capturer la section
            const canvas = await html2canvas(elements.resultSection, {
                scale: 2,
                backgroundColor: null,
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`fleur_magique_${currentFlower.unique_id}.pdf`);

        } catch (error) {
            console.error('Erreur:', error);
            alert("Impossible de générer le PDF. Veuillez réessayer.");
        } finally {
            elements.downloadPdfBtn.innerHTML = originalText;
        }
    }

    function switchToResultSection() {
        elements.formSection.classList.remove('active');
        elements.resultSection.classList.remove('hidden');
        elements.resultSection.classList.add('active');
    }

    function showSuccessMessage() {
        elements.successMessage.classList.remove('hidden');
        setTimeout(() => {
            elements.successMessage.classList.add('hidden');
        }, 3000);
    }

    function createConfetti() {
        const emojis = ['💖', '🌸', '🌷', '🌹', '💐', '✨', '🥰', '😍', '💝', '🎀'];

        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-30px';

            document.body.appendChild(confetti);

            // Animation
            const duration = 2 + Math.random();
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(100vh) rotate(${360}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });

            setTimeout(() => confetti.remove(), duration * 1000);
        }
    }

    // Ajouter le style pour les confettis
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        .confetti {
            position: fixed;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 1000;
        }
    `;
    document.head.appendChild(confettiStyle);
});