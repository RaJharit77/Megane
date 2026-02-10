import math
from flask import Flask, render_template, jsonify, request, send_file # type: ignore
import random
import os
from datetime import datetime
import io
from PIL import Image, ImageDraw, ImageFont, ImageFilter

app = Flask(__name__, static_folder='static', template_folder='templates')

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

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/generate_flower', methods=['POST'])
def generate_flower():
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
        
        COLORS = ["Rouge Passion", "Rose Tendre", "Blanc Pur", "Jaune Soleil", 
                 "Violet Mystique", "Orange Flamboyant", "Bleu Serein", 
                 "Multicolore Arc-en-ciel"]
        
        ADJECTIVES = ["Magnifique", "Enchantée", "Magique", "Éblouissante", 
                     "Divine", "Élégante", "Radieuse", "Mystique", "Céleste",
                     "Envoûtante", "Lumineuse", "Éternelle"]
        
        # Générer les caractéristiques
        flower = {
            "type": random.choice(FLOWER_TYPES),
            "color": random.choice(COLORS),
            "adjective": random.choice(ADJECTIVES),
            "petals": random.randint(5, 15),
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
        
        # Compatibilité (plus réaliste)
        base_compat = random.randint(70, 95)
        if "Passion" in flower["color"] or "Passion" in flower["type"]:
            base_compat += random.randint(5, 10)
        flower["compatibility"] = min(100, base_compat)
        
        # Code couleur
        COLOR_HEX = {
            "Rouge Passion": "#ff4d4d",
            "Rose Tendre": "#ff85a2",
            "Blanc Pur": "#ffffff",
            "Jaune Soleil": "#ffdd59",
            "Violet Mystique": "#9b59b6",
            "Orange Flamboyant": "#ff9f43",
            "Bleu Serein": "#3498db",
            "Multicolore Arc-en-ciel": "linear-gradient(45deg, #ff4d4d, #ff85a2, #ffdd59, #9b59b6)"
        }
        flower["color_hex"] = COLOR_HEX.get(flower["color"], "#ff4d4d")
        
        return jsonify(flower)
        
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de la génération"}), 500

@app.route('/api/download_card', methods=['POST'])
def download_card():
    try:
        data = request.get_json()
        
        # Créer une image HD
        img = Image.new('RGB', (1200, 800), color='white')
        draw = ImageDraw.Draw(img)
        
        # Charger une police (essayer plusieurs polices)
        fonts = []
        for font_name in ['arial.ttf', 'DejaVuSans.ttf', 'LiberationSans-Regular.ttf']:
            try:
                fonts.append(ImageFont.truetype(font_name, 36))
                fonts.append(ImageFont.truetype(font_name, 24))
                fonts.append(ImageFont.truetype(font_name, 18))
            except:
                pass
        
        if not fonts:
            fonts = [ImageFont.load_default()] * 3
        
        title_font, subtitle_font, text_font = fonts[0], fonts[1], fonts[2]
        
        # Dessiner un fond dégradé
        for i in range(800):
            r = int(255 - i * 0.1)
            g = int(230 - i * 0.2)
            b = int(255 - i * 0.1)
            draw.line([(0, i), (1200, i)], fill=(r, g, b))
        
        # Titre
        draw.text((600, 50), "🌷 FLEUR MAGIQUE D'AMOUR 🌷", 
                 fill='#ff4d6d', font=title_font, anchor='mm')
        
        # Informations
        info_y = 150
        infos = [
            f"🌸 Type: {data.get('type', 'Rose Passionnée')}",
            f"🎨 Couleur: {data.get('color', 'Rouge Passion')}",
            f"🌺 Pétales: {data.get('petals', 8)}",
            f"✨ Effet: {data.get('effect', 'Brille dans l\'obscurité')}",
            f"💝 Message: {data.get('message', '')}",
            f"🔮 Compatibilité: {data.get('compatibility', 85)}%",
            f"📅 Généré le: {data.get('generated_at', datetime.now().strftime('%d/%m/%Y %H:%M'))}",
            f"🆔 ID Unique: {data.get('unique_id', 'FL00000')}"
        ]
        
        for i, info in enumerate(infos):
            draw.text((100, info_y + i * 40), info, 
                     fill='#5a3d5c', font=subtitle_font)
        
        # Dessiner une fleur stylisée
        flower_center = (900, 300)
        
        # Pétales
        petals = data.get('petals', 8)
        for i in range(petals):
            angle = (i / petals) * 360
            x = flower_center[0] + 100 * math.cos(math.radians(angle))
            y = flower_center[1] + 100 * math.sin(math.radians(angle))
            
            # Créer un pétale
            draw.ellipse([x-40, y-20, x+40, y+20], 
                        fill='#ff4d4d', outline='#b33939', width=3)
        
        # Centre de la fleur
        draw.ellipse([flower_center[0]-30, flower_center[1]-30, 
                     flower_center[0]+30, flower_center[1]+30], 
                    fill='#ffd700', outline='#ffaa00', width=3)
        
        # Tige
        draw.rectangle([flower_center[0]-5, flower_center[1]+30, 
                       flower_center[0]+5, flower_center[1]+150], 
                      fill='#2e8b57', outline='#1e6b47', width=2)
        
        # Feuilles
        draw.ellipse([flower_center[0]-40, flower_center[1]+80, 
                     flower_center[0]+10, flower_center[1]+120], 
                    fill='#3cb371', outline='#2e8b57', width=2)
        draw.ellipse([flower_center[0]-10, flower_center[1]+80, 
                     flower_center[0]+40, flower_center[1]+120], 
                    fill='#3cb371', outline='#2e8b57', width=2)
        
        # Pied de page
        draw.text((600, 750), "❤️ Créé avec amour pour la Saint-Valentin ❤️", 
                 fill='#ff6b8b', font=text_font, anchor='mm')
        
        # Appliquer un effet de flou artistique
        img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
        
        # Sauvegarder
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG', quality=95)
        img_buffer.seek(0)
        
        return send_file(
            img_buffer,
            mimetype='image/png',
            as_attachment=True,
            download_name=f"fleur_magique_{data.get('unique_id', 'FL00000')}.png"
        )
        
    except Exception as e:
        print(f"Erreur génération image: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)