import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormSection from './components/FormSection'
import ResultSection from './components/ResultSection'
import Confetti from 'react-confetti'
import { Toaster } from 'react-hot-toast'

type Flower = {
  type: string
  color: string
  adjective: string
  petals: number
  unique_id: string
  generated_at: string
  message: string
  effect: string
  compatibility: number
  color_hex: string
  realistic_image?: string
}

function App() {
  const [flower, setFlower] = useState<Flower | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleGenerateFlower = async (name: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate_flower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      if (response.ok) {
        const data = await response.json()
        setFlower(data)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setFlower(null)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="max-w-6xl mx-auto bg-white/95 rounded-3xl shadow-2xl shadow-pink-200/50 overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 px-4 border-b-2 border-dashed border-secondary"
        >
          <h1 className="font-dancing text-4xl md:text-6xl text-primary flex items-center justify-center gap-4 flex-wrap">
            <span className="animate-pulse">💖</span>
            Fleur Magique d'Amour
            <span className="animate-pulse">💖</span>
          </h1>
          <p className="mt-4 text-lg text-pink-800/80">
            Créez une fleur réaliste unique avec un message personnalisé pour votre être cher
          </p>
        </motion.header>

        <main className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            {!flower ? (
              <FormSection
                onGenerate={handleGenerateFlower}
                isGenerating={isGenerating}
              />
            ) : (
              <ResultSection
                flower={flower}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 border-t-2 border-dashed border-pink-200 text-center">
          <h3 className="font-dancing text-3xl text-primary mb-4">
            ❤️ Créé avec amour pour la Saint-Valentin ❤️
          </h3>
          <p className="max-w-2xl mx-auto text-gray-600 mb-6">
            Cette application génère des fleurs réalistes uniques avec des messages personnalisés.
            Parfait pour exprimer vos sentiments de manière créative et magique !
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {['🌸 Fleurs réalistes', '💝 Messages personnalisés', '📥 Téléchargement HD gratuit', '📄 Export PDF'].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-600">
                <span className="text-primary">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </footer>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#5a3d5c',
            boxShadow: '0 10px 25px -5px rgba(255,77,109,0.2)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            icon: '✨',
            style: {
              border: '1px solid #ff4d6d',
            },
          },
          error: {
            icon: '❌',
            style: {
              border: '1px solid #e63946',
            },
          },
          loading: {
            icon: '⏳',
          },
        }}
      />
    </div>
  )
}

export default App