import math
from flask import Flask, render_template, jsonify, request, send_file, Response # type: ignore
from flask_cors import CORS # type: ignore
import random
import os
from datetime import datetime
import io
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops
import base64
import numpy as np

app = Flask(__name__)  

CORS(app, origins=["https://megane-flow-gen.vercel.app", "http://localhost:5173"])

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
        
        COLORS = list(REALISTIC_COLORS.keys()) + ["Multicolore Arc-en-ciel"]
        
        ADJECTIVES = ["Magnifique", "Enchantée", "Magique", "Éblouissante", 
                     "Divine", "Élégante", "Radieuse", "Mystique", "Céleste",
                     "Envoûtante", "Lumineuse", "Éternelle"]
        
        # Générer les caractéristiques
        flower = {
            "type": random.choice(FLOWER_TYPES),
            "color": random.choice(COLORS),
            "adjective": random.choice(ADJECTIVES),
            "petals": random.randint(5, 12),  # Plus réaliste
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
        if flower["color"] == "Multicolore Arc-en-ciel":
            flower["color_hex"] = "linear-gradient(45deg, #e63946, #ffafcc, #ffd166, #9b5de5)"
        else:
            flower["color_hex"] = REALISTIC_COLORS.get(flower["color"], {}).get("hex", "#e63946")
        
        # Générer l'image réaliste de la fleur
        flower["realistic_image"] = generate_realistic_flower_image(flower)
        
        return jsonify(flower)
        
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({"error": "Erreur lors de la génération"}), 500

def generate_realistic_flower_image(flower):
    """Génère une image réaliste de fleur"""
    try:
        # Créer une image avec fond transparent
        size = 400
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Couleurs
        if flower["color"] == "Multicolore Arc-en-ciel":
            colors = [
                (230, 57, 70, 200),    # Rouge
                (255, 175, 204, 200),  # Rose
                (255, 209, 102, 200),  # Jaune
                (155, 93, 229, 200)    # Violet
            ]
        else:
            color_info = REALISTIC_COLORS.get(flower["color"], {"rgb": (230, 57, 70)})
            base_rgb = color_info["rgb"]
            # Créer des variations de la couleur de base
            colors = [
                (base_rgb[0], base_rgb[1], base_rgb[2], 200),
                (min(base_rgb[0] + 30, 255), min(base_rgb[1] + 30, 255), min(base_rgb[2] + 30, 255), 180),
                (max(base_rgb[0] - 30, 0), max(base_rgb[1] - 30, 0), max(base_rgb[2] - 30, 0), 220)
            ]
        
        # Centre de la fleur
        center_x, center_y = size // 2, size // 2
        center_radius = 25
        
        # Dessiner le centre
        draw.ellipse([center_x - center_radius, center_y - center_radius,
                     center_x + center_radius, center_y + center_radius],
                    fill=(255, 215, 0, 230))  # Or
        
        # Ajouter des points au centre
        for i in range(50):
            angle = random.uniform(0, 2 * math.pi)
            radius = random.uniform(0, center_radius - 5)
            x = center_x + radius * math.cos(angle)
            y = center_y + radius * math.sin(angle)
            point_size = random.randint(1, 3)
            draw.ellipse([x - point_size, y - point_size,
                         x + point_size, y + point_size],
                        fill=(255, 235, 100, 200))
        
        # Dessiner les pétales
        petals = flower.get("petals", 8)
        petal_length = 120
        petal_width = 60
        
        for i in range(petals):
            angle = (2 * math.pi * i) / petals
            color = colors[i % len(colors)]
            
            # Position du pétale
            petal_x = center_x + (center_radius + 10) * math.cos(angle)
            petal_y = center_y + (center_radius + 10) * math.sin(angle)
            
            # Créer une ellipse pour le pétale
            petal_points = []
            for j in range(36):  # 36 points pour une ellipse lisse
                t = (2 * math.pi * j) / 36
                # Forme de pétale ovale
                px = petal_x + petal_width * math.cos(t + angle) * math.cos(angle) / 1.5
                py = petal_y + petal_length * math.sin(t + angle) * math.cos(angle) / 1.5
                petal_points.append((px, py))
            
            # Dessiner le pétale avec dégradé
            for j in range(len(petal_points) - 1):
                x1, y1 = petal_points[j]
                x2, y2 = petal_points[j + 1]
                # Créer un dégradé de couleur
                alpha = int(200 * (1 - j/36))
                draw.line([(x1, y1), (x2, y2)], 
                         fill=(color[0], color[1], color[2], alpha), 
                         width=2)
            
            # Remplir le pétale
            if len(petal_points) > 2:
                draw.polygon(petal_points, fill=(color[0], color[1], color[2], 100))
            
            # Ajouter des détails au pétale (veines)
            for _ in range(3):
                vein_length = random.uniform(20, 40)
                vein_angle = angle + random.uniform(-0.2, 0.2)
                vx1 = petal_x
                vy1 = petal_y
                vx2 = vx1 + vein_length * math.cos(vein_angle)
                vy2 = vy1 + vein_length * math.sin(vein_angle)
                draw.line([(vx1, vy1), (vx2, vy2)], 
                         fill=(min(color[0] + 30, 255), 
                               min(color[1] + 30, 255), 
                               min(color[2] + 30, 255), 150),
                         width=1)
        
        # Ajouter des étamines
        for i in range(20):
            angle = random.uniform(0, 2 * math.pi)
            length = random.uniform(30, 50)
            x1 = center_x + center_radius * math.cos(angle)
            y1 = center_y + center_radius * math.sin(angle)
            x2 = x1 + length * math.cos(angle)
            y2 = y1 + length * math.sin(angle)
            
            # Dessiner l'étamine
            draw.line([(x1, y1), (x2, y2)], 
                     fill=(255, 235, 59, 200), 
                     width=2)
            
            # Ajouter le pollen
            pollen_radius = random.randint(3, 6)
            draw.ellipse([x2 - pollen_radius, y2 - pollen_radius,
                         x2 + pollen_radius, y2 + pollen_radius],
                        fill=(255, 193, 7, 220))
        
        # Appliquer un flou doux pour un effet réaliste
        img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
        
        # Améliorer les couleurs
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.2)
        
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.1)
        
        # Convertir en base64
        buffer = io.BytesIO()
        img.save(buffer, format="PNG", optimize=True)
        return f"data:image/png;base64,{base64.b64encode(buffer.getvalue()).decode()}"
        
    except Exception as e:
        print(f"Erreur génération image réaliste: {e}")
        return ""

@app.route('/api/download_card', methods=['POST'])
def download_card():
    try:
        data = request.get_json()
        
        # Créer une image HD
        img = Image.new('RGB', (1200, 800), color='white')
        draw = ImageDraw.Draw(img)
        
        # Charger une police
        try:
            title_font = ImageFont.truetype("arial.ttf", 40)
            subtitle_font = ImageFont.truetype("arial.ttf", 28)
            text_font = ImageFont.truetype("arial.ttf", 20)
        except:
            # Police par défaut si arial n'est pas disponible
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            text_font = ImageFont.load_default()
        
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
        
        # Dessiner une fleur réaliste
        flower_center = (900, 300)
        
        try:
            # Générer une fleur pour la carte
            if data.get('color') == "Multicolore Arc-en-ciel":
                colors = [(230, 57, 70), (255, 175, 204), (255, 209, 102), (155, 93, 229)]
            else:
                color_info = REALISTIC_COLORS.get(data.get('color', "Rouge Passion"), {"rgb": (230, 57, 70)})
                colors = [color_info["rgb"]]
            
            # Centre de la fleur
            draw.ellipse([flower_center[0]-25, flower_center[1]-25, 
                         flower_center[0]+25, flower_center[1]+25], 
                        fill='#ffd700', outline='#ffaa00', width=3)
            
            # Pétales
            petals = data.get('petals', 8)
            for i in range(petals):
                angle = (i / petals) * 360
                color = colors[i % len(colors)]
                x = flower_center[0] + 100 * math.cos(math.radians(angle))
                y = flower_center[1] + 100 * math.sin(math.radians(angle))
                
                # Pétale ovale
                draw.ellipse([x-40, y-60, x+40, y+60], 
                            fill=color, outline=tuple(max(c-40, 0) for c in color), width=2)
                
                # Ajouter des détails
                for j in range(3):
                    offset = j * 2
                    draw.ellipse([x-35+offset, y-55+offset, x+35+offset, y+55+offset], 
                                outline=tuple(min(c+30, 255) for c in color), width=1)
            
            # Tige
            draw.rectangle([flower_center[0]-7, flower_center[1]+25, 
                           flower_center[0]+7, flower_center[1]+180], 
                          fill='#2e8b57', outline='#1e6b47', width=3)
            
            # Feuilles
            draw.ellipse([flower_center[0]-50, flower_center[1]+80, 
                         flower_center[0]+0, flower_center[1]+140], 
                        fill='#3cb371', outline='#2e8b57', width=2)
            draw.ellipse([flower_center[0]-0, flower_center[1]+80, 
                         flower_center[0]+50, flower_center[1]+140], 
                        fill='#3cb371', outline='#2e8b57', width=2)
            
        except Exception as e:
            print(f"Erreur dessin fleur: {e}")
        
        # Pied de page
        draw.text((600, 750), "❤️ Créé avec amour pour la Saint-Valentin ❤️", 
                 fill='#ff6b8b', font=text_font, anchor='mm')
        
        # Appliquer un effet de flou artistique
        img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
        
        # Sauvegarder
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG', quality=95)
        img_buffer.seek(0)
        
        # Déterminer si c'est un préview ou un téléchargement
        preview = data.get('preview', False)
        
        if preview:
            return Response(img_buffer.getvalue(), mimetype='image/png')
        else:
            return send_file(
                img_buffer,
                mimetype='image/png',
                as_attachment=True,
                download_name=f"fleur_magique_{data.get('unique_id', 'FL00000')}.png"
            )
        
    except Exception as e:
        print(f"Erreur génération image: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/preview_card', methods=['POST'])
def preview_card():
    """Endpoint pour la prévisualisation de la carte"""
    try:
        data = request.get_json()
        # Réutiliser la fonction download_card avec le paramètre preview
        data['preview'] = True
        return download_card()
    except Exception as e:
        print(f"Erreur prévisualisation: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)