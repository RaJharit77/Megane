import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { message, type, unique_id } = data;

        const width = 1200;
        const height = 800;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Fond
        ctx.fillStyle = '#fff0f5';
        ctx.fillRect(0, 0, width, height);

        // Titre
        ctx.font = 'bold 48px "Dancing Script", cursive';
        ctx.fillStyle = '#ff4d6d';
        ctx.textAlign = 'center';
        ctx.fillText('FLEUR MAGIQUE D\'AMOUR', width / 2, 80);

        // Informations
        ctx.font = '24px Poppins, sans-serif';
        ctx.fillStyle = '#5a3d5c';
        ctx.textAlign = 'left';
        ctx.fillText(`Pour: ${message || ''}`, 100, 200);
        ctx.fillText(`Fleur: ${type || 'Rose'}`, 100, 280);

        const buffer = canvas.toBuffer('image/png');
        // Convertir Buffer -> Uint8Array (compatible BodyInit)
        const uint8Array = new Uint8Array(buffer);

        const preview = data.preview === true;

        if (preview) {
            return new NextResponse(uint8Array, {
                status: 200,
                headers: {
                    'Content-Type': 'image/png',
                },
            });
        } else {
            return new NextResponse(uint8Array, {
                status: 200,
                headers: {
                    'Content-Type': 'image/png',
                    'Content-Disposition': `attachment; filename="fleur-${unique_id || 'carte'}.png"`,
                },
            });
        }
    } catch (error) {
        console.error('Erreur /api/download_card:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}