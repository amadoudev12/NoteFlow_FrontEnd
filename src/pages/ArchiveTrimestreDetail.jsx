import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Users, School, BookOpen, Eye } from "lucide-react"
import archivesService from "../../services/archivesService"
import StatutBadge from "../components/Admin/StatutBadge"

function StatTile({ icon: Icon, label, value }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-1">{label}</p>
            </div>
        </div>
    )
}

export default function ArchiveTrimestreDetail() {
    const { anneeId, trimestreId } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [erreur, setErreur] = useState(null)
    const [filtreClasse, setFiltreClasse] = useState("")

    useEffect(() => {
        const charger = async () => {
            setLoading(true)
            setErreur(null)
            try {
                const res = await archivesService.getTrimestreDetails(anneeId, trimestreId)
                setData(res.data)
            } catch (err) {
                setErreur(err.response?.data?.message ?? "Impossible de charger ce trimestre.")
            } finally {
                setLoading(false)
            }
        }
        charger()
    }, [anneeId, trimestreId])

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Chargement du trimestre…</p>
                </div>
            </div>
        )
    }

    if (erreur || !data) {
        return (
            <div className="p-6">
                <Link to="/dashboard/admin/archives" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mb-4">
                    <ArrowLeft size={15} /> Retour aux archives
                </Link>
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {erreur ?? "Trimestre introuvable."}
                </div>
            </div>
        )
    }

    const classesAffichees = filtreClasse
        ? data.classes.filter((c) => String(c.classeId) === filtreClasse)
        : data.classes

    return (
        <div className="p-6 ml-45 max-sm:ml-2 max-lg:ml-8">
            <Link to="/dashboard/admin/archives" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mb-4">
                <ArrowLeft size={15} /> Retour aux archives
            </Link>

            <header
                className="relative overflow-hidden rounded-2xl mb-6"
                style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
            >
                <div className="relative px-6 py-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">{data.annee.libelle}</p>
                        <h1 className="text-2xl font-extrabold text-white">{data.trimestre.libelle}</h1>
                    </div>
                    <StatutBadge statut={data.trimestre.statut} />
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatTile icon={Users} label="Élèves" value={data.statistiques.nbEleves} />
                <StatTile icon={School} label="Classes" value={data.statistiques.nbClasses} />
                <StatTile icon={BookOpen} label="Matières" value={data.statistiques.nbMatieres} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-800">Résultats par classe</h2>
                    {data.classes.length > 0 && (
                        <select
                            value={filtreClasse}
                            onChange={(e) => setFiltreClasse(e.target.value)}
                            className="text-sm border border-blue-200 rounded-lg px-3 py-1.5 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Toutes les classes</option>
                            {data.classes.map((c) => (
                                <option key={c.classeId} value={c.classeId}>
                                    {c.libelle}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {data.classes.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-slate-400 text-sm font-medium">Aucune classe n'a de données pour ce trimestre.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                                <th className="px-6 py-3">Classe</th>
                                <th className="px-6 py-3">Élèves</th>
                                <th className="px-6 py-3">Moyenne</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classesAffichees.map((c) => (
                                <tr key={c.classeId} className="border-t border-slate-50 hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-slate-800">{c.libelle}</td>
                                    <td className="px-6 py-3 text-slate-600">{c.nbEleves}</td>
                                    <td className="px-6 py-3">
                                        {c.moyenneClasse != null ? (
                                            <span
                                                className={`font-semibold ${c.moyenneClasse >= 10 ? "text-emerald-600" : "text-red-500"}`}
                                            >
                                                {c.moyenneClasse.toFixed(2)} / 20
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => navigate(`/dashboard/admin/archives/trimestres/${trimestreId}/classes/${c.classeId}`)}
                                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                        >
                                            <Eye size={14} /> Voir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
