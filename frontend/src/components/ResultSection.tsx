import { motion } from 'framer-motion'
import { ArrowLeft, FileImage, FileText, Heart, Star } from 'lucide-react'
import Flower3D from './Flower3D'
import { useState } from 'react'

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
    const [downloading, setDownloading] = useState<'image' | 'pdf' | null>(null)

    const handleDownload = async (type: 'image' | 'pdf') => {
        setDownloading(type)
        try {
            if (type === 'image') {
                const response = await fetch('/api/download_card', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(flower)
                })
                if (response.ok) {
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `fleur_magique_${flower.unique_id}.png`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                }
            } else {
                // PDF download logic here
                console.log('PDF download not implemented yet')
            }
        } catch (error) {
            console.error('Download error:', error)
        } finally {
            setDownloading(null)
        }
    }

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
            className="space-y-8"
        >
            {/* Back Button */}
            <motion.button
                whileHover={{ x: -5 }}
                onClick={onReset}
                className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Créer une autre fleur
            </motion.button>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Flower Display */}
                <div className="space-y-6">
                    <div className="bg-linear-to-br from-pink-50 to-white rounded-2xl p-8 shadow-lg">
                        <div className="relative h-100">
                            <Flower3D flower={flower} />

                            {/* Decorations */}
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity }
                                }}
                                className="absolute top-4 left-4 text-3xl text-yellow-400"
                            >
                                ✦
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-4 right-4 text-3xl text-pink-300"
                            >
                                ❀
                            </motion.div>
                            <motion.div
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-3xl text-purple-300"
                            >
                                ✧
                            </motion.div>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-3 bg-pink-100/50 rounded-full py-3 px-6 border border-pink-200">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-3 h-3 bg-linear-to-r from-primary to-secondary rounded-full"
                            />
                            <span className="font-semibold text-primary">
                                {flower.adjective} fleur réaliste générée !
                            </span>
                        </div>
                    </div>

                    {/* Download Buttons */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDownload('image')}
                            disabled={downloading === 'image'}
                            className="p-4 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {downloading === 'image' ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    ⏳
                                </motion.div>
                            ) : (
                                <FileImage className="w-5 h-5" />
                            )}
                            Télécharger l'image HD
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDownload('pdf')}
                            disabled={downloading === 'pdf'}
                            className="p-4 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {downloading === 'pdf' ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    ⏳
                                </motion.div>
                            ) : (
                                <FileText className="w-5 h-5" />
                            )}
                            Télécharger en PDF
                        </motion.button>
                    </div>
                </div>

                {/* Flower Details */}
                <div className="space-y-6">
                    {/* Flower Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" fill="white" />
                            </div>
                            <h3 className="font-dancing text-3xl text-primary">
                                Votre fleur magique réaliste
                            </h3>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-pink-50 p-4 rounded-xl border-l-4 border-primary">
                                <span className="text-sm text-gray-600">🌸 Type</span>
                                <p className="text-lg font-semibold text-primary">{flower.type}</p>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-xl border-l-4 border-primary">
                                <span className="text-sm text-gray-600">🎨 Couleur</span>
                                <p className="text-lg font-semibold text-primary">{flower.color}</p>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-xl border-l-4 border-primary">
                                <span className="text-sm text-gray-600">🌺 Pétales</span>
                                <p className="text-lg font-semibold text-primary">{flower.petals}</p>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-xl border-l-4 border-primary">
                                <span className="text-sm text-gray-600">✨ Effet magique</span>
                                <p className="text-lg font-semibold text-primary">{flower.effect}</p>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="bg-linear-to-r from-pink-50 to-white p-6 rounded-xl border-l-4 border-primary">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl text-pink-300">"</span>
                                <div>
                                    <p className="text-lg italic text-gray-700 leading-relaxed">
                                        {flower.message}
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="w-2 h-2 bg-primary rounded-full"
                                        />
                                        <span>Message unique généré spécialement pour vous</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compatibility */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" fill="white" />
                            </div>
                            <h4 className="font-dancing text-2xl text-primary">
                                Compatibilité magique
                            </h4>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
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
                                <div className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    {flower.compatibility}%
                                </div>
                            </div>

                            <p className="text-gray-700">
                                Cette fleur représente <span className="font-semibold text-primary">
                                    {getCompatibilityText(flower.compatibility)}
                                </span>
                                <br />
                                <small className="text-gray-500">Basé sur l'énergie positive de votre message</small>
                            </p>
                        </div>
                    </div>

                    {/* Flower ID */}
                    <div className="text-center text-gray-600">
                        <div className="flex items-center justify-center gap-2">
                            <Star className="w-4 h-4 text-primary" />
                            <span>Votre fleur est unique ! ID:</span>
                            <span className="font-mono font-semibold text-primary">
                                {flower.unique_id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}