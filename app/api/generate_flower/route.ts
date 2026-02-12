import { NextRequest, NextResponse } from 'next/server';
import { generateFlowerData } from '@/lib/flowerGenerator';
import { generateRealisticFlowerImage } from '@/lib/canvasUtils';

export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();
        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Le champ "name" est requis' }, { status: 400 });
        }

        const flower = generateFlowerData(name.trim());

        // Génération de l'image réaliste 2D (optionnelle mais conservée)
        const realistic_image = generateRealisticFlowerImage({
            petals: flower.petals,
            color: flower.color,
            color_hex: flower.color_hex,
        });

        return NextResponse.json({
            ...flower,
            realistic_image,
        });
    } catch (error) {
        console.error('Erreur /api/generate_flower:', error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}