from flask import Flask, render_template, jsonify, request # type: ignore
import random
import os

app = Flask(__name__, static_folder='static')

# Messages doux pour la fleur
flower_messages = [
    "Tu es aussi unique que cette fleur. 🌸",
    "Comme cette fleur, tu illumines ma vie. 💖",
    "Chaque pétale représente un de tes sourires. 😊",
    "Cette fleur est aussi belle que ton âme. 🌺",
    "Pour toi, une fleur spéciale pour une personne spéciale. 🌷",
    "Mon amour pour toi fleurit chaque jour. 🌹",
    "Tu es la fleur la plus rare de mon jardin. 💐",
    "Cette fleur pousse grâce à la douceur de ton cœur. ❤️",
    "Chaque couleur représente une qualité que j'aime chez toi. 🌈",
    "Comme cette fleur, mon amour pour toi est unique. ✨"
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/generate_flower', methods=['POST'])
def generate_flower():
    """Génère une fleur avec un message personnalisé"""
    data = request.get_json()
    name = data.get('name', 'Mon Amour')
    
    # Types de fleurs
    flower_types = ["Rose", "Tulipe", "Orchidée", "Lys", "Marguerite", "Pivoine", "Tournesol", "Lavande"]
    colors = ["Rouge", "Rose", "Blanc", "Jaune", "Violet", "Orange", "Bleu", "Multicolore"]
    adjectives = ["Magnifique", "Enchantée", "Magique", "Éblouissante", "Divine", "Élégante", "Radieuse", "Mystique"]
    
    # Générer la fleur
    flower = {
        "type": random.choice(flower_types),
        "color": random.choice(colors),
        "adjective": random.choice(adjectives),
        "petals": random.randint(5, 12),
        "message": f"Pour {name}, {random.choice(flower_messages)}",
        "unique_id": random.randint(1000, 9999)
    }
    
    # Ajouter des effets spéciaux
    effects = ["✨ Brille dans le noir", "🌈 Change de couleur", "🌟 Étincelante", "💫 Lumineuse", "🌙 Énergétique"]
    flower["effect"] = random.choice(effects)
    
    # Générer un pourcentage de compatibilité amoureuse (pour le fun)
    flower["compatibility"] = random.randint(70, 100)
    
    return jsonify(flower)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)