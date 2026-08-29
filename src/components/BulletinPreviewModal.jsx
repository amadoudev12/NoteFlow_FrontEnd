import { useEffect, useState } from "react"

function BulletinPreviewModal({ isOpen, onClose, previewUrl, fileName, onDownload, downloading }) {
    const [iframeLoading, setIframeLoading] = useState(true)
    const [trackedUrl, setTrackedUrl] = useState(previewUrl)

    // Ajustement d'état pendant le rendu (pattern recommandé par React,
    // évite le warning react-hooks/set-state-in-effect)
    if (isOpen && previewUrl !== trackedUrl) {
        setTrackedUrl(previewUrl)
        setIframeLoading(true)
    }

    // Empêche le scroll du body pendant que la modale est ouverte
    useEffect(() => {
        if (isOpen) {
            const original = document.body.style.overflow
            document.body.style.overflow = "hidden"
            return () => {
                document.body.style.overflow = original
            }
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-[#0c2c5a]/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full h-full sm:h-[90vh] sm:max-w-3xl sm:rounded-2xl shadow-2xl border border-[#dce8f9] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="relative shrink-0">
                    <div className="h-1 bg-linear-to-r from-[#1565c0] via-[#1e88e5] to-[#64b5f6]" />
                    <div className="flex items-center justify-between px-5 py-3 border-b border-[#dce8f9]">
                        <div>
                            <p className="text-[10px] text-[#5f82b0] uppercase tracking-widest font-medium">
                                Aperçu
                            </p>
                            <h2 className="text-[15px] font-semibold text-[#0c2c5a] leading-tight m-0">
                                Bulletin scolaire
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Fermer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5f82b0] hover:bg-[#e6f1fb] hover:text-[#185fa5] transition-colors duration-150 cursor-pointer"
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Corps : aperçu PDF */}
                <div className="relative flex-1 bg-[#f4f8fd]">
                    {iframeLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f4f8fd]">
                            <svg className="animate-spin text-[#1e88e5]" width="28" height="28" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            <p className="text-[13px] text-[#5f82b0] font-medium">Chargement de l'aperçu...</p>
                        </div>
                    )}
                    {previewUrl && (
                        <iframe
                            key={previewUrl}
                            src={previewUrl}
                            title="Aperçu du bulletin"
                            className="w-full h-full border-0"
                            onLoad={() => setIframeLoading(false)}
                        />
                    )}
                </div>

                {/* Footer : actions */}
                <div className="shrink-0 flex flex-col sm:flex-row gap-2 px-5 py-4 border-t border-[#dce8f9] bg-white">
                    <button
                        onClick={onClose}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer bg-white text-[#5f6b7d] border border-[#dce3ec] hover:bg-[#f4f6f9] active:scale-95 transition-all duration-150"
                    >
                        Fermer
                    </button>
                    <button
                        onClick={onDownload}
                        disabled={downloading || !previewUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer bg-[#1565c0] text-white hover:bg-[#0c4fa0] active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {downloading ? (
                            <>
                                <svg className="animate-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Téléchargement...
                            </>
                        ) : (
                            <>
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Télécharger en PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BulletinPreviewModal