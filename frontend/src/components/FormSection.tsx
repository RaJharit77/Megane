import { motion } from 'framer-motion'
import { useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'

interface FormSectionProps {
    onGenerate: (name: string) => Promise<void>
    isGenerating: boolean
}

export default function FormSection({ onGenerate, isGenerating }: FormSectionProps) {
    const [name, setName] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            await onGenerate(name)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
        >
            <div className="text-center mb-12">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="w-24 h-24 mx-auto mb-6 bg-linear-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center"
                >
                    <Heart className="w-12 h-12 text-white" fill="currentColor" />
                </motion.div>

                <h2 className="font-dancing text-4xl md:text-5xl text-primary mb-4">
                    Créer votre fleur réaliste unique
                </h2>
                <p className="text-lg text-gray-600">
                    Entrez le nom de la personne spéciale pour qui vous créez cette fleur magique
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Exemple : Marie, Pierre, Mon Amour..."
                        className="w-full p-6 text-lg border-2 border-pink-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                        required
                        autoFocus
                    />
                    <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary w-6 h-6" />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isGenerating}
                    className="w-full p-6 text-lg font-semibold bg-linear-to-r from-primary to-secondary text-white rounded-2xl shadow-lg shadow-pink-300/50 hover:shadow-xl hover:shadow-pink-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <span className="flex items-center justify-center gap-2">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block"
                            >
                                ⏳
                            </motion.span>
                            Génération en cours...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            🌸 Faire pousser une fleur magique réaliste 🌸
                            <Sparkles className="w-5 h-5" />
                        </span>
                    )}
                </motion.button>
            </form>
        </motion.div>
    )
}