import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, GraduationCap, Trophy } from "lucide-react"
import archivesService from "../../services/archivesService"
import StatutBadge from "../components/Admin/StatutBadge"

export default function ArchiveEleveHistorique() {
    const { matricule } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [erreur, setErreur] = useState(null)

    useEffect(() => {
        const charger = async () => {
            setLoading(true)
            setErreur(null)
            try {
                const res = await archivesService.getEleveHistorique(matricule)
                setData(res.data)
            } catch (err) {
                setErreur(err.response?.data?.message ?? "Impossible de charger le dossier de cet élève.")
            } finally {
                setLoading(false)
            }
        }
        charger()
    }, [matricule])

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Chargement du dossier…</p>
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
                    {erreur ?? "Élève introuvable."}
                </div>
            </div>
        )
    }

    return (
        <div className="p-6  ml-45 max-sm:ml-2 max-lg:ml-8">
            <Link to="/dashboard/admin/archives" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mb-4">
                <ArrowLeft size={15} /> Retour aux archives
            </Link>

            <header
                className="relative overflow-hidden rounded-2xl mb-6"
                style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
            >
                <div className="relative px-6 py-7">
                    <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                        <GraduationCap size={14} /> Dossier historique
                    </span>
                    <h1 className="text-2xl font-extrabold text-white">{data.eleve.prenom} {data.eleve.nom}</h1>
                    <p className="text-blue-200 text-xs mt-1">{data.eleve.matricule}</p>
                </div>
            </header>

            {data.historique.length === 0 ? (
                <div className="bg-white rounded-2xl border border-blue-100 py-16 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        Aucun résultat académique enregistré pour cet élève dans votre établissement.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {data.historique.map((annee) => (
                        <div key={annee.anneeId} className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-base font-bold text-slate-800">{annee.annee}</h2>
                                    <StatutBadge statut={annee.statutAnnee} />
                                </div>
                                <span className="text-sm text-slate-500">Classe : {annee.classe.libelle}</span>
                            </div>

                            {annee.trimestres.length === 0 ? (
                                <p className="text-sm text-slate-400 px-6 py-6">Aucune note enregistrée pour cette année.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                                            <th className="px-6 py-3">Trimestre</th>
                                            <th className="px-6 py-3">Statut</th>
                                            <th className="px-6 py-3">Moyenne</th>
                                            <th className="px-6 py-3">Rang</th>
                                            <th className="px-6 py-3 text-right">Détail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {annee.trimestres.map((t) => (
                                            <tr key={t.trimestreId} className="border-t border-slate-50 hover:bg-blue-50/50 transition-colors">
                                                <td className="px-6 py-3 font-medium text-slate-800">{t.libelle}</td>
                                                <td className="px-6 py-3"><StatutBadge statut={t.statut} /></td>
                                                <td className="px-6 py-3">
                                                    <span className={`font-semibold ${t.moyenneGenerale >= 10 ? "text-emerald-600" : "text-red-500"}`}>
                                                        {t.moyenneGenerale.toFixed(2)} / 20
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    {t.rang ? (
                                                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                                            {t.rang === 1 && <Trophy size={14} className="text-amber-500" />}
                                                            {t.rang} / {t.effectifClasse}
                                                        </span>
                                                    ) : "—"}
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <Link
                                                        to={`/dashboard/admin/archives/trimestres/${t.trimestreId}/eleves/${data.eleve.matricule}`}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                                    >
                                                        Voir
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
