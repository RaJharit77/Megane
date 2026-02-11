import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'
import Flower3D from './Flower3D'

interface LoveCardProps {
    flower: {
        unique_id: string
        realistic_image?: string
        // autres propriétés nécessaires pour Flower3D
        petals: number
        color: string
        color_hex: string
    }
    children: React.ReactNode
}

export default function LoveCard({ flower, children }: LoveCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isExporting, setIsExporting] = useState<'image' | 'pdf' | null>(null)

    // Bascule temporaire entre le canvas 3D et l'image statique pendant l'export
    const generateCard = async (format: 'image' | 'pdf') => {
        if (!cardRef.current) return
        if (!flower.realistic_image) {
            toast.error('Image de la fleur non disponible')
            return
        }

        const toastId = toast.loading(
            format === 'image' ? 'Préparation de l\'image HD...' : 'Génération du PDF...'
        )
        setIsExporting(format)

        try {
            // Petit délai pour que le DOM passe en mode export (remplacement image)
            await new Promise(resolve => setTimeout(resolve, 100))

            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                backgroundColor: '#ffffff',
                filter: (node) => !node.classList?.contains('no-export')
            })

            if (format === 'image') {
                const link = document.createElement('a')
                link.download = `fleur-magique-${flower.unique_id}.png`
                link.href = dataUrl
                link.click()
                toast.success('Image téléchargée avec succès !', { id: toastId })
            } else {
                const img = new Image()
                img.src = dataUrl
                img.onload = () => {
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'px',
                        format: [img.width / 3, img.height / 3],
                    })
                    pdf.addImage(dataUrl, 'PNG', 0, 0, img.width / 3, img.height / 3)
                    pdf.save(`fleur-magique-${flower.unique_id}.pdf`)
                    toast.success('PDF téléchargé avec succès !', { id: toastId })
                }
            }
        } catch (error) {
            console.error('Erreur génération carte:', error)
            toast.error('Échec de la génération. Veuillez réessayer.', { id: toastId })
        } finally {
            setIsExporting(null)
        }
    }

    return (
        <div className="space-y-4">
            {/* Carte à capturer */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-linear-to-br from-pink-50 via-white to-rose-50 rounded-3xl shadow-2xl p-4 md:p-8 overflow-hidden"
                style={{ boxShadow: '0 25px 50px -12px rgba(255,77,109,0.25)' }}
            >
                {/* Éléments décoratifs (conservés) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
                </div>

                {/* Contenu principal : grille responsive */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Partie fleur – remplacement dynamique */}
                    <div className="space-y-4">
                        <div className="bg-linear-to-br from-pink-50 to-white rounded-2xl p-4 md:p-6 shadow-lg">
                            <div className="relative w-full aspect-square md:h-100">
                                {isExporting && flower.realistic_image ? (
                                    // Mode export : image statique
                                    <img
                                        src={flower.realistic_image}
                                        alt="Fleur magique"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    // Mode normal : canvas 3D
                                    <Flower3D flower={flower} />
                                )}
                            </div>

                            {/* Badge "Fleur réaliste générée" */}
                            <div className="mt-4 md:mt-6 flex items-center justify-center gap-3 bg-pink-100/50 rounded-full py-2 md:py-3 px-4 md:px-6 border border-pink-200">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-2 h-2 md:w-3 md:h-3 bg-linear-to-r from-primary to-secondary rounded-full"
                                />
                                <span className="text-sm md:text-base font-semibold text-primary">
                                    ✦ Fleur réaliste générée !
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Partie détails (children) */}
                    <div className="space-y-6">{children}</div>
                </div>

                {/* Cachet de cire */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute bottom-4 md:bottom-6 right-4 md:right-6 w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
                >
                    <span className="text-white text-xl md:text-2xl">❤️</span>
                </motion.div>
            </motion.div>

            {/* Boutons de téléchargement */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                    onClick={() => generateCard('image')}
                    disabled={!!isExporting}
                    className="flex-1 py-3 md:py-4 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
                >
                    {isExporting === 'image' ? (
                        <span className="animate-spin">⏳</span>
                    ) : (
                        <>
                            Télécharger en Image HD
                        </>
                    )}
                </button>
                <button
                    onClick={() => generateCard('pdf')}
                    disabled={!!isExporting}
                    className="flex-1 py-3 md:py-4 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
                >
                    {isExporting === 'pdf' ? (
                        <span className="animate-spin">⏳</span>
                    ) : (
                        <>
                            Télécharger en PDF
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}