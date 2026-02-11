import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Star } from 'lucide-react'
import LoveCard from './LoveCard'

interface Flower {
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

interface ResultSectionProps {
    flower: Flower
    onReset: () => void
}

export default function ResultSection({ flower, onReset }: ResultSectionProps) {
    const getCompatibilityText = (percent: number) => {
        if (percent >= 95) return "une connexion magique et éternelle"
        if (percent >= 85) return "une relation profonde et sincère"
        if (percent >= 75) return "une belle harmonie"
        return "une belle connexion"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 md:space-y-8"
        >
            {/* Bouton retour */}
            <motion.button
                whileHover={{ x: -5 }}
                onClick={onReset}
                className="flex items-center gap-2 text-primary hover:text-secondary transition-colors text-sm md:text-base"
            >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                Créer une autre fleur
            </motion.button>

            {/* LoveCard intègre maintenant la fleur et reçoit les détails en children */}
            <LoveCard flower={flower}>
                {/* Détails de la fleur */}
                <div className="space-y-6">
                    {/* Carte d'identité */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-pink-100">
                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
                            </div>
                            <h3 className="font-dancing text-2xl md:text-3xl text-primary">
                                Votre fleur magique
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="bg-pink-50 p-3 md:p-4 rounded-xl border-l-4 border-primary">
                                <span className="text-xs md:text-sm text-gray-600">🌸 Type</span>
                                <p className="text-sm md:text-lg font-semibold text-primary wrap-break-word">{flower.type}</p>
                            </div>
                            <div className="bg-pink-50 p-3 md:p-4 rounded-xl border-l-4 border-primary">
                                <span className="text-xs md:text-sm text-gray-600">🎨 Couleur</span>
                                <p className="text-sm md:text-lg font-semibold text-primary wrap-break-word">{flower.color}</p>
                            </div>
                            <div className="bg-pink-50 p-3 md:p-4 rounded-xl border-l-4 border-primary">
                                <span className="text-xs md:text-sm text-gray-600">🌺 Pétales</span>
                                <p className="text-sm md:text-lg font-semibold text-primary">{flower.petals}</p>
                            </div>
                            <div className="bg-pink-50 p-3 md:p-4 rounded-xl border-l-4 border-primary">
                                <span className="text-xs md:text-sm text-gray-600">✨ Effet</span>
                                <p className="text-sm md:text-lg font-semibold text-primary wrap-break-word">{flower.effect}</p>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="bg-linear-to-r from-pink-50 to-white p-4 md:p-6 rounded-xl border-l-4 border-primary">
                            <div className="flex items-start gap-2 md:gap-3">
                                <span className="text-xl md:text-2xl text-pink-300">"</span>
                                <div>
                                    <p className="text-sm md:text-lg italic text-gray-700 leading-relaxed">
                                        {flower.message}
                                    </p>
                                    <div className="mt-3 md:mt-4 flex items-center gap-2 text-xs md:text-sm text-primary">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full"
                                        />
                                        <span>Message unique</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compatibilité */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-pink-100">
                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
                            </div>
                            <h4 className="font-dancing text-xl md:text-2xl text-primary">
                                Compatibilité
                            </h4>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="flex-1 h-3 md:h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${flower.compatibility}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-linear-to-r from-primary to-secondary rounded-full relative"
                                    >
                                        <motion.div
                                            animate={{ x: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                                        />
                                    </motion.div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {flower.compatibility}%
                                </div>
                            </div>
                            <p className="text-sm md:text-base text-gray-700">
                                Cette fleur représente <span className="font-semibold text-primary">
                                    {getCompatibilityText(flower.compatibility)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* ID unique */}
                    <div className="text-center text-gray-600 text-xs md:text-sm">
                        <div className="flex items-center justify-center gap-2">
                            <Star className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                            <span>ID :</span>
                            <span className="font-mono font-semibold text-primary">
                                {flower.unique_id}
                            </span>
                        </div>
                    </div>
                </div>
            </LoveCard>
        </motion.div>
    )
}