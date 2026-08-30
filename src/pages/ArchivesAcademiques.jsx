import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Archive, Users, BookOpen, ChevronDown, Search, ArrowRight } from "lucide-react"
import archivesService from "../../services/archivesService"
import StatutBadge from "../components/Admin/StatutBadge"

export default function ArchivesAcademiques() {
    const navigate = useNavigate()
    const [annees, setAnnees] = useState([])
    const [anneeId, setAnneeId] = useState(null)
    const [trimestres, setTrimestres] = useState([])
    const [loadingAnnees, setLoadingAnnees] = useState(true)
    const [loadingTrimestres, setLoadingTrimestres] = useState(false)
    const [erreur, setErreur] = useState(null)
    const [matricule, setMatricule] = useState("")

    useEffect(() => {
        const chargerAnnees = async () => {
            try {
                const res = await archivesService.getAnneesAcademiques()
                const liste = res.data ?? []
                setAnnees(liste)
                const parDefaut = liste.find((a) => a.statut === "EN_COURS") ?? liste[0]
                if (parDefaut) setAnneeId(parDefaut.id)
            } catch (err) {
                console.log(err)
                setErreur("Impossible de charger les années académiques.")
            } finally {
                setLoadingAnnees(false)
            }
        }
        chargerAnnees()
    }, [])

    useEffect(() => {
        if (!anneeId) return
        const chargerTrimestres = async () => {
            setLoadingTrimestres(true)
            setErreur(null)
            try {
                const res = await archivesService.getTrimestres(anneeId)
                setTrimestres(res.data?.trimestres ?? [])
            } catch (err) {
                console.log(err)
                setErreur("Impossible de charger les trimestres de cette année.")
                setTrimestres([])
            } finally {
                setLoadingTrimestres(false)
            }
        }
        chargerTrimestres()
    }, [anneeId])

    const anneeSelectionnee = annees.find((a) => a.id === anneeId)

    const rechercherEleve = (e) => {
        e.preventDefault()
        const m = matricule.trim()
        if (m) navigate(`/dashboard/admin/archives/eleves/${m}`)
    }

    return (
        <div className="p-6 ml-45 max-sm:ml-2 max-lg:ml-8">
            {/* En-tête */}
            <header
                className="relative overflow-hidden rounded-2xl mb-6"
                style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
            >
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white" />
                <div className="relative px-6 py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                    <div>
                        <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                            <Archive size={14} />
                            Archives académiques
                        </span>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                            Archives académiques
                        </h1>
                        <p className="text-blue-200 mt-1 text-sm max-w-xl">
                            Consultez les résultats des trimestres clôturés et des années scolaires terminées.
                        </p>
                    </div>

                    <form onSubmit={rechercherEleve} className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                                placeholder="Matricule d'un élève..."
                                className="pl-9 pr-3 py-2 text-sm rounded-lg bg-white/95 border border-white/30 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/60 w-52"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-3 py-2 rounded-lg transition"
                        >
                            Dossier élève <ArrowRight size={14} />
                        </button>
                    </form>
                </div>
            </header>

            {/* Sélecteur d'année */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Année académique
                </label>
                {loadingAnnees ? (
                    <div className="h-10 w-64 bg-slate-100 rounded-lg animate-pulse" />
                ) : annees.length === 0 ? (
                    <p className="text-sm text-slate-400">Aucune année académique enregistrée pour votre établissement.</p>
                ) : (
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <select
                                value={anneeId ?? ""}
                                onChange={(e) => setAnneeId(Number(e.target.value))}
                                className="appearance-none pl-4 pr-9 py-2.5 rounded-lg border border-blue-200 text-blue-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                {annees.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.libelle}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        {anneeSelectionnee && <StatutBadge statut={anneeSelectionnee.statut} />}
                    </div>
                )}
            </div>

            {erreur && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {erreur}
                </div>
            )}

            {/* Trimestres de l'année sélectionnée */}
            {anneeId && (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-6 rounded-full bg-blue-600" />
                        <h2 className="text-lg font-bold text-slate-800">
                            Trimestres — {anneeSelectionnee?.libelle}
                        </h2>
                    </div>

                    {loadingTrimestres ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
                            ))}
                        </div>
                    ) : trimestres.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-blue-100 py-16 text-center">
                            <p className="text-slate-400 text-sm font-medium">
                                Aucun trimestre n'a encore été créé pour cette année.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trimestres.map((t) => (
                                <div
                                    key={t.id}
                                    className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 flex flex-col gap-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-bold text-slate-800 text-base">{t.libelle}</h3>
                                        <StatutBadge statut={t.statut} />
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <Users size={14} className="text-blue-500" />
                                            {t.nbEleves} élève{t.nbEleves !== 1 ? "s" : ""}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <BookOpen size={14} className="text-blue-500" />
                                            {t.nbMatieres} matière{t.nbMatieres !== 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    {t.statut === "A_VENIR" ? (
                                        <p className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                            Ce trimestre n'a pas encore débuté.
                                        </p>
                                    ) : (
                                        <button
                                            onClick={() => navigate(`/dashboard/admin/archives/annees/${anneeId}/trimestres/${t.id}`)}
                                            className="mt-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                                        >
                                            Consulter <ArrowRight size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
