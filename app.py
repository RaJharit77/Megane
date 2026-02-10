from flask import Flask, render_template, jsonify, request
import random
from datetime import datetime
import json
import os

app = Flask(__name__)

valentine_messages = [
    "Tu es la raison de mon sourire.",
    "Je t'aime plus que les mots ne peuvent le dire.",
    "Mon cœur bat au rythme de ton nom.",
    "Avec toi, chaque jour est la Saint-Valentin.",
    "Tu es la plus belle fleur de mon jardin.",
    "Mon amour pour toi grandit chaque jour.",
    "Tu es mon rayon de soleil.",
    "Je suis tombé amoureux de ton sourire.",
    "Tu es mon souhait le plus cher.",
    "Mon cœur est à toi pour toujours."
]

love_quotes = [
    {"author": "Victor Hugo", "quote": "Aimer, ce n'est pas se regarder l'un l'autre, c'est regarder ensemble dans la même direction."},
    {"author": "Antoine de Saint-Exupéry", "quote": "Aimer, ce n'est pas se regarder l'un l'autre, c'est regarder ensemble dans la même direction."},
    {"author": "Alfred de Musset", "quote": "L'amour, c'est l'histoire de la vie des femmes, c'est un épisode dans celle des hommes."},
    {"author": "William Shakespeare", "quote": "Doute que les étoiles soient de feu, Doute que le soleil se meuve, Doute que la vérité soit menteuse, Mais ne doute jamais de mon amour."},
    {"author": "Platon", "quote": "Au toucher de l'amour, tout le monde devient poète."}
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/generate_flower')
def generate_flower():
    """Génère une fleur aléatoire avec ses caractéristiques"""
    flower_types = ["Rose", "Tulipe", "Orchidée", "Lys", "Marguerite", "Pivoine", "Géranium"]
    colors = ["Rouge", "Rose", "Blanc", "Jaune", "Violet", "Orange", "Bordeaux"]
    
    flower = {
        "type": random.choice(flower_types),
        "color": random.choice(colors),
        "petals": random.randint(5, 12),
        "size": random.choice(["Petite", "Moyenne", "Grande", "Géante"]),
        "scent": random.choice(["Doux", "Parfumé", "Léger", "Intense", "Délicat"]),
        "message": random.choice(valentine_messages),
        "quote": random.choice(love_quotes)
    }
    
    # Ajouter un effet spécial aléatoire
    effects = ["Brille dans l'obscurité", "Change de couleur", "Pétales lumineux", "Parfum magique", "Croissance rapide"]
    flower["special_effect"] = random.choice(effects)
    
    return jsonify(flower)

@app.route('/api/send_message', methods=['POST'])
def send_message():
    """Envoie un message d'amour"""
    data = request.get_json()
    name = data.get('name', 'Anonyme')
    message = data.get('message', '')
    
    if not message:
        return jsonify({"error": "Le message est vide"}), 400
    
    response = {
        "status": "success",
        "message": f"Message de {name} envoyé avec succès!",
        "data": {
            "recipient": name,
            "message": message,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "confirmation": "❤️ Ton message d'amour a été enregistré dans le jardin éternel! ❤️"
        }
    }
    
    return jsonify(response)

@app.route('/api/valentine_info')
def valentine_info():
    """Informations sur la Saint-Valentin"""
    info = {
        "date": "14 février",
        "origin": "Fête des amoureux célébrée dans de nombreux pays",
        "symbols": ["Cœurs", "Fleurs", "Chocolats", "Cupidon", "Flèches"],
        "traditions": [
            "Échanger des cartes et des lettres d'amour",
            "Offrir des fleurs (surtout des roses)",
            "Partager un repas romantique",
            "S'offrir des chocolats",
            "Faire des cadeaux"
        ],
        "facts": [
            "Environ 1 milliard de cartes sont échangées chaque année",
            "La rose rouge symbolise l'amour passionné",
            "Les premiers chocolats de la Saint-Valentin ont été créés au 19ème siècle",
            "Dans certains pays, c'est aussi la fête de l'amitié"
        ]
    }
    return jsonify(info)

@app.route('/api/generate_poem')
def generate_poem():
    """Génère un poème d'amour aléatoire"""
    poem_lines = [
        ["Tes yeux sont deux soleils", "Qui éclairent mes nuits", "Ton sourire est un appel", "À des lendemains qui chantent"],
        ["Dans le jardin de mon cœur", "Fleurit ton doux visage", "Chaque pétale est un bonheur", "Chaque feuille est un message"],
        ["Si je pouvais compter", "Les étoiles du ciel bleu", "Je n'arriverais pas au nombre", "De fois où je pense à toi"],
        ["Comme la rose au printemps", "Mon amour s'épanouit", "Et chaque jour en aimant", "De nouveaux pétales surgit"],
        ["Tu es la mélodie", "Qui berce mon silence", "L'harmonie", "De mon existence"]
    ]
    
    poem = random.choice(poem_lines)
    return jsonify({
        "poem": poem,
        "title": "Poème pour mon amour",
        "author": "Cupidon Numérique"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)