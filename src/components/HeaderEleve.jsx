import { useNavigate } from "react-router-dom"
import { useState } from "react"
import eleveService from "../../services/eleveService"
import { Link } from "react-router-dom"
import BulletinPreviewModal from "./BulletinPreviewModal"
import axiosClient from "../../services/AxiosClient"

function HeaderEleve({ eleve, onLogout }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [certLoading, setCertLoading] = useState(false)

    // --- États pour l'aperçu du bulletin ---
    const [showBulletinModal, setShowBulletinModal] = useState(false)
    const [bulletinPreviewUrl, setBulletinPreviewUrl] = useState(null)
    const [bulletinDownloading, setBulletinDownloading] = useState(false)

    const logOut = () => {
        localStorage.removeItem("token")
        onLogout()
    }

    // Récupère l'URL du bulletin, télécharge le PDF en blob (via axios, token auto-injecté),
    // puis ouvre la modale d'aperçu. Le blob évite le blocage CSP frame-ancestors sur l'iframe.
    const telechargerbulletin = async () => {
        setLoading(true)
        try {
            const matricule = eleve.matricule_eleve
            const classe = eleve.classe.libelle
            const res = await eleveService.getEleveBulletin({ matricule, classe })
            const signedUrl = res.data?.url ?? res.data
            if (!signedUrl) throw new Error("URL manquante")

            // NOTE: signedUrl est utilisé seul car axiosClient a déjà un baseURL configuré.
            // Si ce n'est PAS le cas chez toi, remplace par:
            // const fullUrl = `${import.meta.env.VITE_API_URL}${signedUrl}`
            // et utilise fullUrl ci-dessous à la place de signedUrl.
            const pdfResponse = await axiosClient.get(signedUrl, { responseType: "blob" })
            const objectUrl = URL.createObjectURL(pdfResponse.data)

            setBulletinPreviewUrl(objectUrl)
            setShowBulletinModal(true)
        } catch (err) {
            console.log(err)
            navigate("/500")
        } finally {
            setLoading(false)
        }
    }

    // Déclenché depuis la modale : télécharge réellement le PDF déjà récupéré (blob local)
    const handleDownloadBulletinPdf = () => {
        if (!bulletinPreviewUrl) return
        setBulletinDownloading(true)
        try {
            const matricule = eleve.matricule_eleve
            const link = document.createElement("a")
            link.href = bulletinPreviewUrl
            link.setAttribute("download", `bulletin_${matricule}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.log(err)
            navigate("/500")
        } finally {
            setBulletinDownloading(false)
        }
    }

    const closeBulletinModal = () => {
        if (bulletinPreviewUrl) {
            URL.revokeObjectURL(bulletinPreviewUrl) // libère la mémoire du blob
        }
        setShowBulletinModal(false)
        setBulletinPreviewUrl(null)
    }

    const triggerDownload = (data, filename) => {
        const blob = new Blob([data], { type: "application/pdf" })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    const telechargerCertificat = async () => {
        setCertLoading(true)
        try {
            const res = await eleveService.getCertificat()
            triggerDownload(res.data, `certificat-${eleve?.eleve.matricule}`)
        } catch (err) {
            console.log(err)
            navigate("/500")
        } finally {
            setCertLoading(false)
        }
    }

    const initiales = `${eleve?.eleve?.prenom?.[0] ?? ""}${eleve?.eleve?.nom?.[0] ?? ""}`.toUpperCase()

    return (
        <>
            <header className="bg-white border border-[#dce8f9] rounded-2xl overflow-hidden mb-5 shadow-sm">
                {/* Gradient top bar */}
                <div className="h-1 bg-linear-to-r from-[#1565c0] via-[#1e88e5] to-[#64b5f6]" />

                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">

                    {/* Infos élève */}
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full bg-[#e6f1fb] border-2 border-[#b5d4f4] flex items-center justify-center text-[#185fa5] font-bold text-[15px] select-none">
                                {initiales}
                            </div>
                            {/* Online dot */}
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                        </div>

                        <div>
                            <p className="text-[10px] text-[#5f82b0] uppercase tracking-widest mb-0.5 font-medium">
                                Tableau de bord élève
                            </p>
                            <h1 className="text-[18px] font-semibold text-[#0c2c5a] leading-tight m-0">
                                {eleve?.eleve?.prenom}{" "}
                                <span className="text-[#1e88e5]">{eleve?.eleve?.nom}</span>
                            </h1>

                            {/* Meta info */}
                            <div className="flex items-center gap-2 mt-1 text-[12px] text-[#6c8db5] flex-wrap">
                                {/* Classe */}
                                <span className="flex items-center gap-1">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                    </svg>
                                    <span className="font-medium text-[#0c2c5a]">{eleve?.classe?.libelle}</span>
                                </span>

                                <span className="w-1 h-1 rounded-full bg-[#b5d4f4] inline-block" />

                                {/* Matricule */}
                                <span className="flex items-center gap-1">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span className="font-mono tracking-tight">{eleve?.matricule_eleve}</span>
                                </span>

                                <span className="w-1 h-1 rounded-full bg-[#b5d4f4] inline-block" />

                                {/* Badge actif */}
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                                    Actif
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-2 flex-wrap">
                        {/* Bulletin */}
                        <button
                            onClick={telechargerbulletin}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer bg-[#e6f1fb] text-[#185fa5] border border-[#85b7eb] hover:bg-[#cfe3f8] hover:border-[#5a9fd4] active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    En cours...
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Bulletin
                                </>
                            )}
                        </button>
                        <Link
                            to="/dashboard/eleve/mes-absences"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer bg-[#e6f1fb] text-[#185fa5] border border-[#85b7eb] hover:bg-[#cfe3f8] hover:border-[#5a9fd4] active:scale-95 transition-all duration-150"
                        >
                            <svg
                                width="15"
                                height="15"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="17"
                                    rx="3"
                                />
                                <path
                                    strokeLinecap="round"
                                    d="M16 2v4M8 2v4M3 10h18"
                                />
                                <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
                            </svg>

                            Absences
                        </Link>

                        {/* Certificat */}
                        <button
                            onClick={telechargerCertificat}
                            disabled={certLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer bg-[#f0fdf4] text-[#166534] border border-[#86efac] hover:bg-[#dcfce7] hover:border-[#4ade80] active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {certLoading ? (
                                <>
                                    <svg className="animate-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    En cours...
                                </>
                            ) : (
                                <>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    Certificat
                                </>
                            )}
                        </button>

                        {/* Déconnexion */}
                        <button
                            onClick={logOut}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer bg-[#fcebeb] text-[#791f1f] border border-[#f09595] hover:bg-[#fee2e2] hover:border-[#f87171] active:scale-95 transition-all duration-150"
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <BulletinPreviewModal
                isOpen={showBulletinModal}
                onClose={closeBulletinModal}
                previewUrl={bulletinPreviewUrl}
                onDownload={handleDownloadBulletinPdf}
                downloading={bulletinDownloading}
            />
        </>
    )
}

export default HeaderEleve