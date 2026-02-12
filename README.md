# 🌸 Megane

<div align="center">
  <p><strong>Communicate any way any how</strong></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Three.js-0.182.0-000000?style=flat-square&logo=three.js" alt="Three.js" />
    <img src="https://img.shields.io/badge/Framer_Motion-12.34.0-0055FF?style=flat-square&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Canvas-3.2.1-E34F26?style=flat-square&logo=html5" alt="Canvas" />
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel" alt="Vercel" />
  </p>
</div>

---

## ✨ À propos

**Megane** est une application web full‑stack qui génère des **fleurs 3D réalistes et uniques** accompagnées d’un message personnalisé.  
Chaque fleur est créée de manière procédurale : nombre de pétales, couleur, effet magique, message d’amour et même un score de compatibilité.  
L’utilisateur peut télécharger sa création en **image HD** ou en **PDF** et la partager avec ses proches.

> « Communicate any way any how » – Exprimez vos sentiments de façon créative et magique.

---

## 🚀 Fonctionnalités

- **Génération instantanée** – Saisissez un prénom, recevez une fleur unique.
- **Fleur 3D interactive** – Rotation, animation et ombres réalistes grâce à `@react-three/fiber` & `drei`.
- **Détails personnalisés** – Type, couleur, nombre de pétales, effet spécial, message romantique, compatibilité.
- **Carte d’amour intégrée** – Mise en page élégante combinant la vue 3D et les caractéristiques.
- **Export HD** – Téléchargez la carte complète en **PNG** ou en **PDF** (via `html-to-image` + `jspdf`).
- **API intégrée** – Logique de génération et dessin 2D côté serveur (Node `canvas`).
- **Responsive** – Parfaitement adapté aux mobiles, tablettes et desktop.

---

## 🧰 Technologies utilisées

| Domaine          | Technologie                                                                                                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**    | [Next.js 16](https://nextjs.org/) (App Router)                                                                                                                                                            |
| **UI / Styles**  | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)                                                                               |
| **3D / WebGL**   | [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://drei.pmnd.rs/)                                                               |
| **Backend**      | API Routes Next.js, [node-canvas](https://github.com/Automattic/node-canvas) pour la génération d’images 2D réalistes                                                                                    |
| **Export**       | [html-to-image](https://github.com/bubkoo/html-to-image), [jspdf](https://github.com/parallax/jsPDF)                                                                                                      |
| **Icônes**       | [Lucide React](https://lucide.dev/)                                                                                                                                                                       |
| **Notifications**| [react-hot-toast](https://react-hot-toast.com/)                                                                                                                                                           |
| **Confettis**    | [react-confetti](https://github.com/alampros/react-confetti)                                                                                                                                              |
| **Analytics**    | [@vercel/analytics](https://vercel.com/docs/analytics)                                                                                                                                                    |
| **Déploiement**  | [Vercel](https://vercel.com/)                                                                                                                                                                             |

---

## 🌐 API Routes

| Route                     | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| `POST /api/generate_flower` | Génère les métadonnées de la fleur + une image 2D (data‑URL) à partir d’un prénom. |
| `POST /api/download_card`   | Génère une image PNG prête à télécharger (conservé pour compatibilité).        |

Toute la logique métier (choix aléatoire des types, couleurs, messages) est exécutée côté serveur, garantissant une expérience rapide et sécurisée.

---

## 🖼️ Aperçu

> *Aucune capture d’écran n’est incluse, mais vous pouvez essayer la [démo en ligne](https://megane-gen.vercel.app/) pour découvrir la magie.*

---

## 📦 Déploiement

L’application est optimisée pour **Vercel** et peut être déployée en un clic :

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-repo/megane)

La dépendance `canvas` est automatiquement prise en charge par l’environnement Vercel.

---

## 📄 Licence

Ce projet est sous licence **ISC**. Vous êtes libre de l’utiliser et de l’adapter selon vos besoins.

---

<div align="center">
  <sub>✨ Créé avec amour pour la Saint-Valentin et au‑delà. ✨</sub>
</div>
