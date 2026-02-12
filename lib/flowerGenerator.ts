import { REALISTIC_COLORS } from './canvasUtils';

const FLOWER_TYPES = [
    'Rose Passionnée',
    'Tulipe Élégante',
    'Orchidée Mystique',
    'Lys Majestueux',
    'Marguerite Innocente',
    'Pivoine Royale',
    'Tournesol Radieux',
    'Lavande Apaisante',
    'Hortensia Délicat',
    'Jasmin Parfumé',
    'Coquelicot Sauvage',
    'Œillet Passionné',
];

const COLORS = [...Object.keys(REALISTIC_COLORS), 'Multicolore Arc-en-ciel'];

const ADJECTIVES = [
    'Magnifique',
    'Enchantée',
    'Magique',
    'Éblouissante',
    'Divine',
    'Élégante',
    'Radieuse',
    'Mystique',
    'Céleste',
    'Envoûtante',
    'Lumineuse',
    'Éternelle',
];

const FLOWER_MESSAGES = [
    'Chaque pétale de cette fleur représente un moment précieux avec toi. 🌸',
    'Comme cette fleur unique, tu es la lumière de ma vie. ✨',
    'Mon amour pour toi fleurit chaque jour davantage. 🌹',
    'Cette fleur magique porte en elle toute la tendresse que j\'ai pour toi. 💖',
    'Pour toi, une fleur aussi rare et précieuse que ton sourire. 🌺',
    'Chaque couleur de cette fleur raconte une histoire d\'amour avec toi. 🌈',
    'Cette fleur pousse grâce à la douceur infinie de ton cœur. ❤️',
    'Comme cette fleur s\'épanouit, mon amour pour toi grandit chaque jour. 🌷',
    'Tu es la fleur la plus magnifique du jardin de ma vie. 💐',
    'Cette fleur porte le message de mon amour éternel pour toi. 💝',
];

const EFFECTS = [
    '✨ Brille dans l\'obscurité',
    '🌈 Change de couleur avec l\'amour',
    '🌟 Émet une douce lumière',
    '💫 Tourbillonne magiquement',
    '🌙 Répond aux émotions',
    '☀️ Réchauffe le cœur',
    '💖 Bat au rythme des cœurs',
    '🎶 Émet une mélodie douce',
];

export function generateFlowerData(name: string) {
    const type = FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)];
    const colorName = COLORS[Math.floor(Math.random() * COLORS.length)];
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const petals = Math.floor(Math.random() * 8) + 5; // 5-12
    const unique_id = `FL${Math.floor(Math.random() * 90000) + 10000}`;
    const generated_at = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    const message = `Pour ${name}, ${FLOWER_MESSAGES[Math.floor(Math.random() * FLOWER_MESSAGES.length)]}`;
    const effect = EFFECTS[Math.floor(Math.random() * EFFECTS.length)];

    let compatibility = Math.floor(Math.random() * 26) + 70; // 70-95
    if (colorName.includes('Passion') || type.includes('Passion')) {
        compatibility = Math.min(100, compatibility + Math.floor(Math.random() * 6) + 5);
    }

    let color_hex: string;
    if (colorName === 'Multicolore Arc-en-ciel') {
        color_hex = 'linear-gradient(45deg, #e63946, #ffafcc, #ffd166, #9b5de5)';
    } else {
        color_hex = REALISTIC_COLORS[colorName]?.hex ?? '#e63946';
    }

    return {
        type,
        color: colorName,
        adjective,
        petals,
        unique_id,
        generated_at,
        message,
        effect,
        compatibility,
        color_hex,
    };
}