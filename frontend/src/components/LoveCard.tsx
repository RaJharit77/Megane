import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image' // Nouvelle importation
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

interface LoveCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flower: any
    children: React.ReactNode
}

export default function LoveCard({ flower, children }: LoveCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isGenerating, setIsGenerating] = useState<'image' | 'pdf' | null>(null)

    const generateCard = async (format: 'image' | 'pdf') => {
        if (!cardRef.current) return

        const toastId = toast.loading(
            format === 'image' ? 'Préparation de l\'image HD...' : 'Génération du PDF...'
        )

        setIsGenerating(format)

        try {
            // Petit délai pour assurer que le rendu 3D est stable
            await new Promise(resolve => setTimeout(resolve, 500))

            // Configuration pour html-to-image
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 3, // Haute résolution
                backgroundColor: '#ffffff',
                // Filtre pour éviter de capturer les éléments indésirables si besoin
                filter: (node) => {
                    // Exclure les éléments avec la classe 'exclude-shot' si vous en ajoutez
                    return !node.classList?.contains('exclude-shot')
                }
            })

            if (format === 'image') {
                const link = document.createElement('a')
                link.download = `fleur-magique-${flower.unique_id}.png`
                link.href = dataUrl
                link.click()
                toast.success('Image téléchargée avec succès !', { id: toastId })
            } else {
                // Pour le PDF, on récupère les dimensions de l'image générée
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
            setIsGenerating(null)
        }
    }

    return (
        <div className="space-y-4">
            {/* La carte à capturer */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-linear-to-br from-pink-50 via-white to-rose-50 rounded-3xl shadow-2xl p-8 overflow-hidden"
                style={{ boxShadow: '0 25px 50px -12px rgba(255,77,109,0.25)' }}
            >
                {/* Éléments décoratifs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
                </div>

                {/* Contenu */}
                <div className="relative z-10">
                    {children}
                </div>

                {/* Cachet de cire animé */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute bottom-6 right-6 w-16 h-16 bg-linear-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
                >
                    <span className="text-white text-2xl">❤️</span>
                </motion.div>
            </motion.div>

            {/* Boutons de téléchargement */}
            <div className="flex gap-4">
                <button
                    onClick={() => generateCard('image')}
                    disabled={!!isGenerating}
                    className="flex-1 py-4 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isGenerating === 'image' ? (
                        <span className="animate-spin">⏳</span>
                    ) : (
                        <>
                            <span>🖼️</span> Télécharger l'image HD
                        </>
                    )}
                </button>
                <button
                    onClick={() => generateCard('pdf')}
                    disabled={!!isGenerating}
                    className="flex-1 py-4 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                    {isGenerating === 'pdf' ? (
                        <span className="animate-spin">⏳</span>
                    ) : (
                        <>
                            <span>📄</span> Exporter en PDF
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}