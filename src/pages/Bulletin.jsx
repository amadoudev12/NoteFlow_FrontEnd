import { useEffect, useState } from "react"
import classeService from "../../services/classeService"
import bulletinService from "../../services/bulletinService"
import toast, { Toaster } from "react-hot-toast"
import noteService from "../../services/noteService"
import { useNavigate } from "react-router-dom"
import PageLoader from "../components/LoaderPage"

function BulletinAdmin() {
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)       // { id, type, matiereId? }
  const [openFiche, setOpenFiche] = useState(null)           // classeId dont le panel est ouvert
  const [matieres, setMatieres] = useState({})               // { [classeId]: [] }
  const [loadingMatieres, setLoadingMatieres] = useState({}) // { [classeId]: bool }
  const navigate = useNavigate()
useEffect(() => {
        const fetchClasses = async () => {
        try {
            const res = await classeService.getAllClasse()
            setClasses(res.data.classes ?? [])
        } catch (err) {
            console.log('erreur serveur')
        } finally {
            setLoading(false)
        }
        }
        fetchClasses()
}, [])

  /* ── Ouvrir / fermer le panel matières ── */
const toggleFichePanel = async (classe) => {
    if (openFiche === classe.id) {
        setOpenFiche(null)
        return
    }
    setOpenFiche(classe.id)
    if (!matieres[classe.id]) {
        setLoadingMatieres(prev => ({ ...prev, [classe.id]: true }))
        try {
            const res = await classeService.getClasseMatiere(classe.id)
            setMatieres(prev => ({ ...prev, [classe.id]: res.data.matieres ?? [] }))
            
        } catch (err) {
            setMatieres(prev => ({ ...prev, [classe.id]: [] }))
        } finally {
            setLoadingMatieres(prev => ({ ...prev, [classe.id]: false }))
        }
    }
}

  /* ── Generer les  bulletins ── */
const downloadBulletin = async (classe) => {
    setDownloading({ id: classe.id, type: "bulletin" })
        try {
            const res = await bulletinService.genererBulletinClasse(classe.id)
            if(res.status == 200){
                toast.success('Bulletin generer avec succes')
            }
        } catch (err) {
            toast.error('Bulletin non generer')
            console.log('erreur serveur')
        } finally {
            setDownloading(null)
        }
}

  /* ── Télécharger fiche de notes d'une matière ── */
const downloadFicheNote = async (classe, matiere) => {
        setDownloading({ id: classe.id, type: "fiche", matiereId: matiere.id })
        try {
            const res = await noteService.getListeNotes({id_classe:classe.id, id_matiere:matiere.id})
            triggerDownload(res.data, `fiche_notes_${classe.libelle}_${matiere.nom}.pdf`)
        } catch (err) {
            console.log('erreur serveur')
        } finally {
            setDownloading(null)
        }
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

// const downloadAll = async () => {
//     for (const classe of classesFiltrees) {
//         await downloadBulletin(classe)
//     }
// }

const classesFiltrees = (classes ?? []).filter(c =>
    c.libelle.toLowerCase().includes(search.toLowerCase()) ||
    c.niveau?.toLowerCase().includes(search.toLowerCase())
)

const isLoadingBtn = (classeId, type, matiereId) =>
    downloading?.id === classeId &&
    downloading?.type === type &&
    (matiereId === undefined || downloading?.matiereId === matiereId)

    // if(classes.length == 0){
    //     return (
    //         <div>
    //             aucune classe n'a été enregistrer veuillez configuer votre etablissement
    //         </div>
    //     )
    // }

    if(downloading){
        return (
            <PageLoader message="generation en cours"/>
        )
    }
    return (
    <div className="p-6 ml-45 max-sm:ml-2 max-lg:ml-8">
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
        {/* Header */}
        <div className="rounded-2xl overflow-hidden mb-6"
            style={{ border: "0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ height: 4, background: "linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)" }} />
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
            style={{ background: "var(--color-background-primary)" }}>
            <div>
                {/* <p className="text-xs font-medium uppercase tracking-widest mb-0.5"
                style={{ color: "var(--color-text-secondary)" }}>Administration</p> */}
                <h1 className="text-xl font-medium" style={{ color: "var(--color-text-primary)" }}>
                <span style={{ color: "#7f77dd" }}>Bulletins et notes</span>
                </h1>
            </div>
            <div className="text-center px-5 py-2 rounded-lg"
                style={{ background: "var(--color-background-secondary)" }}>
                <p className="text-xs mb-0" style={{ color: "var(--color-text-secondary)" }}>Classes</p>
                <p className="text-2xl font-medium mb-0">{classes.length}</p>
            </div>
            </div>
        </div>

        {/* Barre recherche + tout télécharger */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <input
            type="text"
            placeholder="Rechercher une classe..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 text-sm rounded-lg"
            style={{
                maxWidth: 260, width: "100%",
                border: "0.5px solid var(--color-border-secondary)",
                background: "var(--color-background-primary)",
                color: "var(--color-text-primary)",
                outline: "none"
            }}
            />
            {/* <button
            onClick={downloadAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#eeedfe", color: "#3c3489", border: "0.5px solid #afa9ec" }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Tout télécharger
            </button> */}
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden"
            style={{ border: "0.5px solid var(--color-border-tertiary)" }}>

            {/* En-tête */}
            <div className="grid px-5 py-3"
            style={{
                gridTemplateColumns: "1fr 140px 160px",
                background: "var(--color-background-secondary)",
                borderBottom: "0.5px solid var(--color-border-tertiary)"
            }}>
            {["Classe", "Bulletins", "Fiche de notes"].map(h => (
                <span key={h} className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--color-text-secondary)" }}>{h}</span>
            ))}
            </div>

            {/* Lignes */}
            {loading ? (
            <div className="py-10 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Chargement...
            </div>
            ) : classesFiltrees.length === 0 ? (
            <div className="ml-45 max-sm:ml-2 max-lg:ml-8 flex items-center justify-center py-20">
                <div className="text-center text-gray-400">
                    {/* <div className="text-4xl mb-3">🏫</div> */}
                    <p className="text-sm font-medium">Aucune classe disponible</p>
                </div>
            </div>
            ) : (
            classesFiltrees.map((classe, i) => {
                const isLast = i === classesFiltrees.length - 1
                const isPanelOpen = openFiche === classe.id
                const classeMatieres = matieres[classe.id] ?? []
                const isLoadingM = loadingMatieres[classe.id]

                return (
                <div key={classe.id}>

                    {/* Ligne principale */}
                    <div className="grid px-5 py-4 items-center gap-5"
                    style={{
                        gridTemplateColumns: "1fr 140px 160px",
                        borderBottom: "0.5px solid var(--color-border-tertiary)",
                        background: "var(--color-background-primary)"
                    }}>

                    <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                        {classe.libelle}
                    </span>

                    {/* Bouton Bulletins */}
                    <button
                        onClick={() => downloadBulletin(classe)}
                        disabled={downloading !== null}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                        background: "#eeedfe", color: "#3c3489",
                        border: "0.5px solid #afa9ec",
                        opacity: downloading !== null ? 0.5 : 1,
                        width: "fit-content"
                        }}>
                        {isLoadingBtn(classe.id, "bulletin") ? "En cours..." : (
                        <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Generer les Bulletins
                        </>
                        )}
                    </button>

                    {/* Bouton Fiche de notes — toggle */}
                    <button
                        onClick={() => toggleFichePanel(classe)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{
                        background: isPanelOpen ? "#085041" : "#e1f5ee",
                        color: isPanelOpen ? "#e1f5ee" : "#085041",
                        border: "0.5px solid #5dcaa5",
                        width: "fit-content",
                        transition: "background 0.15s, color 0.15s"
                        }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                            Fiche de notes
                        <svg
                        className="w-3 h-3"
                        fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                        style={{ transform: isPanelOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    </div>

                    {/* Panel matières déroulant */}
                    {isPanelOpen && (
                    <div style={{
                        borderBottom: isLast ? "none" : "0.5px solid var(--color-border-tertiary)",
                        background: "var(--color-background-secondary)",
                        padding: "0 20px 14px 20px"
                    }}>
                        <p className="text-xs font-medium uppercase tracking-wider pt-3 pb-2"
                        style={{ color: "var(--color-text-secondary)" }}>
                        Sélectionner une matière — {classe.libelle}
                        </p>

                        {isLoadingM ? (
                        <p className="text-xs py-2" style={{ color: "var(--color-text-secondary)" }}>
                            Chargement des matières...
                        </p>
                        ) : classeMatieres.length === 0 ? (
                        <p className="text-xs py-2" style={{ color: "var(--color-text-secondary)" }}>
                            Aucune matière disponible pour cette classe.
                        </p>
                        ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {classeMatieres.map(matiere => (
                            <div key={matiere.id}
                                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg"
                                style={{
                                background: "var(--color-background-primary)",
                                border: "0.5px solid var(--color-border-tertiary)"
                                }}>
                                <span style={{ fontSize: 12, color: "var(--color-text-primary)", fontWeight: 500 }}>
                                {matiere?.matiere?.nom}
                                </span>
                                <button
                                onClick={() => downloadFicheNote(classe, matiere.matiere)}
                                disabled={downloading !== null}
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                                style={{
                                    background: isLoadingBtn(classe.id, "fiche", matiere.matiere.id) ? "#085041" : "#e1f5ee",
                                    color: isLoadingBtn(classe.id, "fiche", matiere.matiere.id) ? "#e1f5ee" : "#085041",
                                    border: "0.5px solid #5dcaa5",
                                    opacity: (downloading !== null && !isLoadingBtn(classe.id, "fiche", matiere.matiere.id)) ? 0.5 : 1,
                                    whiteSpace: "nowrap"
                                }}>
                                {isLoadingBtn(classe.id, "fiche", matiere.matiere.id) ? "En cours..." : (
                                    <>
                                    <svg style={{ width: 11, height: 11 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Télécharger
                                    </>
                                )}
                                </button>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    )}

                </div>
                )
            })
            )}
        </div>
    </div>
  )
}


export default BulletinAdmin