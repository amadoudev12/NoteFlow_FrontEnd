import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Search, Trophy } from "lucide-react"
import archivesService from "../../services/archivesService"
import StatutBadge from "../components/Admin/StatutBadge"

export default function ArchiveClasseDetail() {
    const { trimestreId, classeId } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [erreur, setErreur] = useState(null)
    const [recherche, setRecherche] = useState("")

    useEffect(() => {
        const charger = async () => {
            setLoading(true)
            setErreur(null)
            try {
                const res = await archivesService.getClasseResultats(trimestreId, classeId)
                setData(res.data)
            } catch (err) {
                setErreur(err.response?.data?.message ?? "Impossible de charger cette classe.")
            } finally {
                setLoading(false)
            }
        }
        charger()
    }, [trimestreId, classeId])

    const elevesFiltres = useMemo(() => {
        if (!data) return []
        const q = recherche.trim().toLowerCase()
        if (!q) return data.eleves
        return data.eleves.filter(
            (e) => `${e.prenom} ${e.nom}`.toLowerCase().includes(q) || e.matricule.toLowerCase().includes(q)
        )
    }, [data, recherche])

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Chargement de la classe…</p>
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
                    {erreur ?? "Classe introuvable."}
                </div>
            </div>
        )
    }

    return (
        <div className=" p-6 ml-45 max-sm:ml-2 max-lg:ml-8">
            <Link
                to={`/dashboard/admin/archives/annees/${data.annee.id}/trimestres/${trimestreId}`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
                <ArrowLeft size={15} /> Retour au trimestre
            </Link>

            <header
                className="relative overflow-hidden rounded-2xl mb-6"
                style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
            >
                <div className="relative px-6 py-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
                            {data.annee.libelle} · {data.trimestre.libelle}
                        </p>
                        <h1 className="text-2xl font-extrabold text-white">{data.classe.libelle}</h1>
                    </div>
                    <StatutBadge statut={data.trimestre.statut} />
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-800">
                        {data.eleves.length} élève{data.eleves.length !== 1 ? "s" : ""}
                    </h2>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="Rechercher un élève..."
                            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {data.eleves.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-slate-400 text-sm font-medium">Aucun élève inscrit dans cette classe pour cette période.</p>
                    </div>
                ) : elevesFiltres.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-slate-400 text-sm font-medium">Aucun élève ne correspond à « {recherche} ».</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                                <th className="px-6 py-3">Élève</th>
                                <th className="px-6 py-3">Moyenne</th>
                                <th className="px-6 py-3">Rang</th>
                            </tr>
                        </thead>
                        <tbody>
                            {elevesFiltres.map((e) => (
                                <tr
                                    key={e.matricule}
                                    onClick={() => navigate(`/dashboard/admin/archives/trimestres/${trimestreId}/eleves/${e.matricule}`)}
                                    className="border-t border-slate-50 hover:bg-blue-50/50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-3">
                                        <p className="font-medium text-slate-800">{e.prenom} {e.nom}</p>
                                        <p className="text-xs text-slate-400">{e.matricule}</p>
                                    </td>
                                    <td className="px-6 py-3">
                                        {e.aDesNotes ? (
                                            <span className={`font-semibold ${e.moyenneGenerale >= 10 ? "text-emerald-600" : "text-red-500"}`}>
                                                {e.moyenneGenerale.toFixed(2)} / 20
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">Aucune note</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3">
                                        {e.rang ? (
                                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                                {e.rang === 1 && <Trophy size={14} className="text-amber-500" />}
                                                {e.rang} / {data.eleves.filter((x) => x.aDesNotes).length}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">—</span>
                                        )}
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
