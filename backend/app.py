import math
from flask import Flask, jsonify, request, send_file, Response # type: ignore
from flask_cors import CORS # type: ignore
import random
import os
from datetime import datetime
import io
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import base64

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

# Messages d'amour améliorés
FLOWER_MESSAGES = [
    "Chaque pétale de cette fleur représente un moment précieux avec toi. 🌸",
    "Comme cette fleur unique, tu es la lumière de ma vie. ✨",
    "Mon amour pour toi fleurit chaque jour davantage. 🌹",
    "Cette fleur magique porte en elle toute la tendresse que j'ai pour toi. 💖",
    "Pour toi, une fleur aussi rare et précieuse que ton sourire. 🌺",
    "Chaque couleur de cette fleur raconte une histoire d'amour avec toi. 🌈",
    "Cette fleur pousse grâce à la douceur infinie de ton cœur. ❤️",
    "Comme cette fleur s'épanouit, mon amour pour toi grandit chaque jour. 🌷",
    "Tu es la fleur la plus magnifique du jardin de ma vie. 💐",
    "Cette fleur porte le message de mon amour éternel pour toi. 💝"
]

# Dictionnaire de couleurs réalistes
REALISTIC_COLORS = {
    "Rouge Passion": {"hex": "#e63946", "rgb": (230, 57, 70)},
    "Rose Tendre": {"hex": "#ffafcc", "rgb": (255, 175, 204)},
    "Blanc Pur": {"hex": "#ffffff", "rgb": (255, 255, 255)},
    "Jaune Soleil": {"hex": "#ffd166", "rgb": (255, 209, 102)},
    "Violet Mystique": {"hex": "#9b5de5", "rgb": (155, 93, 229)},
    "Orange Flamboyant": {"hex": "#f48c06", "rgb": (244, 140, 6)},
    "Bleu Serein": {"hex": "#4cc9f0", "rgb": (76, 201, 240)},
}

@app.route('/')
def home():
    return "API is running correctly", 200

@app.route('/api/generate_flower', methods=['POST'])
def generate_flower():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json()
        name = data.get('name', 'Mon Amour').strip()
        
        # Configuration des fleurs
        FLOWER_TYPES = [
            "Rose Passionnée", "Tulipe Élégante", "Orchidée Mystique", 
            "Lys Majestueux", "Marguerite Innocente", "Pivoine Royale",
            "Tournesol Radieux", "Lavande Apaisante", "Hortensia Délicat",
            "Jasmin Parfumé", "Coquelicot Sauvage", "Œillet Passionné"
        ]
        
        COLORS = list(REALISTIC_COLORS.keys()) + ["Multicolore Arc-en-ciel"]
        
        ADJECTIVES = ["Magnifique", "Enchantée", "Magique", "Éblouissante", 
                     "Divine", "Élégante", "Radieuse", "Mystique", "Céleste",
                     "Envoûtante", "Lumineuse", "Éternelle"]
        
        # Générer les caractéristiques
        flower = {
            "type": random.choice(FLOWER_TYPES),
            "color": random.choice(COLORS),
            "adjective": random.choice(ADJECTIVES),
            "petals": random.randint(5, 12),
            "unique_id": f"FL{random.randint(10000, 99999)}",
            "generated_at": datetime.now().strftime("%d/%m/%Y %H:%M"),
            "message": f"Pour {name}, {random.choice(FLOWER_MESSAGES)}"
        }
        
        # Effets spéciaux
        EFFECTS = [
            "✨ Brille dans l'obscurité", "🌈 Change de couleur avec l'amour",
            "🌟 Émet une douce lumière", "💫 Tourbillonne magiquement",
            "🌙 Répond aux émotions", "☀️ Réchauffe le cœur",
            "💖 Bat au rythme des cœurs", "🎶 Émet une mélodie douce"
        ]
        flower["effect"] = random.choice(EFFECTS)
        
        # Compatibilité
        base_compat = random.randint(70, 95)
        if "Passion" in flower["color"] or "Passion" in flower["type"]:
            base_compat += random.randint(5, 10)
        flower["compatibility"] = min(100, base_compat)
        
        # Code couleur
        if flower["color"] == "Multicolore Arc-en-ciel":
            flower["color_hex"] = "linear-gradient(45deg, #e63946, #ffafcc, #ffd166, #9b5de5)"
        else:
            flower["color_hex"] = REALISTIC_COLORS.get(flower["color"], {}).get("hex", "#e63946")
        
        # Générer l'image réaliste de la fleur
        flower["realistic_image"] = generate_realistic_flower_image(flower)
        
        return jsonify(flower)
        
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": str(e)}), 500

def generate_realistic_flower_image(flower):
    """Génère une image réaliste de fleur"""
    try:
        size = 400
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        if flower["color"] == "Multicolore Arc-en-ciel":
            colors = [
                (230, 57, 70, 200), (255, 175, 204, 200),
                (255, 209, 102, 200), (155, 93, 229, 200)
            ]
        else:
            color_info = REALISTIC_COLORS.get(flower["color"], {"rgb": (230, 57, 70)})
            base_rgb = color_info["rgb"]
            colors = [
                (base_rgb[0], base_rgb[1], base_rgb[2], 200),
                (min(base_rgb[0] + 30, 255), min(base_rgb[1] + 30, 255), min(base_rgb[2] + 30, 255), 180),
                (max(base_rgb[0] - 30, 0), max(base_rgb[1] - 30, 0), max(base_rgb[2] - 30, 0), 220)
            ]
        
        center_x, center_y = size // 2, size // 2
        center_radius = 25
        
        # Dessiner le centre
        draw.ellipse([center_x - center_radius, center_y - center_radius,
                     center_x + center_radius, center_y + center_radius],
                    fill=(255, 215, 0, 230))
        
        # Dessiner les pétales
        petals = flower.get("petals", 8)
        petal_length = 120
        petal_width = 60
        
        for i in range(petals):
            angle = (2 * math.pi * i) / petals
            color = colors[i % len(colors)]
            
            petal_x = center_x + (center_radius + 10) * math.cos(angle)
            petal_y = center_y + (center_radius + 10) * math.sin(angle)
            
            petal_points = []
            for j in range(36):
                t = (2 * math.pi * j) / 36
                px = petal_x + petal_width * math.cos(t + angle) * math.cos(angle) / 1.5
                py = petal_y + petal_length * math.sin(t + angle) * math.cos(angle) / 1.5
                petal_points.append((px, py))
            
            if len(petal_points) > 2:
                draw.polygon(petal_points, fill=(color[0], color[1], color[2], 180))
        
        img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
        
        buffer = io.BytesIO()
        img.save(buffer, format="PNG", optimize=True)
        return f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"
        
    except Exception as e:
        print(f"Erreur génération image réaliste: {e}")
        return ""

@app.route('/api/download_card', methods=['POST', 'OPTIONS'])
def download_card():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:
        data = request.get_json()
        
        img = Image.new('RGB', (1200, 800), color='white')
        draw = ImageDraw.Draw(img)
        
        # Police par défaut pour éviter les erreurs de fichier .ttf manquant
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        
        # Fond simple
        draw.rectangle([0, 0, 1200, 800], fill='#fff0f5')
        
        # Titre
        draw.text((600, 50), "FLEUR MAGIQUE D'AMOUR", fill='#ff4d6d', anchor='ms')
        
        # Informations basiques
        draw.text((100, 150), f"Pour: {data.get('message', '')}", fill='#5a3d5c')
        draw.text((100, 200), f"Fleur: {data.get('type', 'Rose')}", fill='#5a3d5c')
        
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        if data.get('preview', False):
            return Response(img_buffer.getvalue(), mimetype='image/png')
        else:
            return send_file(
                img_buffer,
                mimetype='image/png',
                as_attachment=True,
                download_name=f"fleur_{data.get('unique_id', '000')}.png"
            )
        
    except Exception as e:
        print(f"Erreur génération image: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)