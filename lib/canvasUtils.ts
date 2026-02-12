import { createCanvas } from 'canvas';

export interface FlowerData {
    petals: number;
    color: string;
    color_hex: string;
}

// Palettes de couleurs réalistes (copie exacte de l'original)
export const REALISTIC_COLORS: Record<string, { hex: string; rgb: [number, number, number] }> = {
    'Rouge Passion': { hex: '#e63946', rgb: [230, 57, 70] },
    'Rose Tendre': { hex: '#ffafcc', rgb: [255, 175, 204] },
    'Blanc Pur': { hex: '#ffffff', rgb: [255, 255, 255] },
    'Jaune Soleil': { hex: '#ffd166', rgb: [255, 209, 102] },
    'Violet Mystique': { hex: '#9b5de5', rgb: [155, 93, 229] },
    'Orange Flamboyant': { hex: '#f48c06', rgb: [244, 140, 6] },
    'Bleu Serein': { hex: '#4cc9f0', rgb: [76, 201, 240] },
};

export function generateRealisticFlowerImage(flower: FlowerData): string {
    try {
        const size = 400;
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');

        // Fond transparent
        ctx.clearRect(0, 0, size, size);

        // Couleurs des pétales
        let colors: [number, number, number, number][];
        if (flower.color === 'Multicolore Arc-en-ciel') {
            colors = [
                [230, 57, 70, 200],
                [255, 175, 204, 200],
                [255, 209, 102, 200],
                [155, 93, 229, 200],
            ];
        } else {
            const base = REALISTIC_COLORS[flower.color]?.rgb ?? [230, 57, 70];
            colors = [
                [...base, 200],
                [Math.min(base[0] + 30, 255), Math.min(base[1] + 30, 255), Math.min(base[2] + 30, 255), 180],
                [Math.max(base[0] - 30, 0), Math.max(base[1] - 30, 0), Math.max(base[2] - 30, 0), 220],
            ];
        }

        const centerX = size / 2;
        const centerY = size / 2;
        const centerRadius = 25;

        // Centre de la fleur
        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        ctx.fill();

        // Pétales
        const petalCount = Math.min(flower.petals, 12);
        const petalLength = 120;
        const petalWidth = 60;

        for (let i = 0; i < petalCount; i++) {
            const angle = (2 * Math.PI * i) / petalCount;
            const col = colors[i % colors.length];
            const fillColor = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${col[3] / 255})`;

            const petalX = centerX + (centerRadius + 10) * Math.cos(angle);
            const petalY = centerY + (centerRadius + 10) * Math.sin(angle);

            ctx.save();
            ctx.translate(petalX, petalY);
            ctx.rotate(angle);
            ctx.scale(0.8, 1.2); // Aplatissement pour forme de pétale
            ctx.beginPath();
            ctx.ellipse(0, 0, petalWidth / 2, petalLength / 2, 0, 0, 2 * Math.PI);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.restore();
        }

        // Léger flou gaussien (simulation)
        // On peut appliquer un filtre de flou via un petit redessin, mais on garde simple

        const buffer = canvas.toBuffer('image/png');
        return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error('Erreur génération image 2D:', error);
        return '';
    }
}