import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Trophy, FileText, ClockAlert, History } from "lucide-react"
import archivesService from "../../services/archivesService"
import StatutBadge from "../components/Admin/StatutBadge"

const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "")

export default function ArchiveEleveDetail() {
    const { trimestreId, matricule } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [erreur, setErreur] = useState(null)

    useEffect(() => {
        const charger = async () => {
            setLoading(true)
            setErreur(null)
            try {
                const res = await archivesService.getEleveTrimestre(matricule, trimestreId)
                setData(res.data)
            } catch (err) {
                setErreur(err.response?.data?.message ?? "Impossible de charger le dossier de cet élève.")
            } finally {
                setLoading(false)
            }
        }
        charger()
    }, [matricule, trimestreId])

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

    const { eleve, moyenneGenerale, rang, effectifClasse, matieres, absences, bulletin, trimestre, annee } = data

    return (
        <div className=" p-6 ml-45 max-sm:ml-2 max-lg:ml-8">
            <Link
                to={`/dashboard/admin/archives/trimestres/${trimestreId}/classes/${eleve.classe.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
                <ArrowLeft size={15} /> Retour à la classe
            </Link>

            <header
                className="relative overflow-hidden rounded-2xl mb-6"
                style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
            >
                <div className="relative px-6 py-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
                            {annee.libelle} · {trimestre.libelle} · {eleve.classe.libelle}
                        </p>
                        <h1 className="text-2xl font-extrabold text-white">{eleve.prenom} {eleve.nom}</h1>
                        <p className="text-blue-200 text-xs mt-1">{eleve.matricule}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatutBadge statut={trimestre.statut} />
                        <Link
                            to={`/dashboard/admin/archives/eleves/${eleve.matricule}`}
                            className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                        >
                            <History size={13} /> Historique complet
                        </Link>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Moyenne générale</p>
                    <p className={`text-3xl font-bold ${moyenneGenerale >= 10 ? "text-emerald-600" : "text-red-500"}`}>
                        {moyenneGenerale.toFixed(2)} <span className="text-base font-normal text-slate-400">/ 20</span>
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Rang</p>
                    <p className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                        {rang ? <>{rang === 1 && <Trophy size={22} className="text-amber-500" />}{rang}</> : "—"}
                        <span className="text-base font-normal text-slate-400">/ {effectifClasse}</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-800">Matières</h2>
                </div>
                {matieres.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-slate-400 text-sm font-medium">Aucune note enregistrée pour cette période.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                                <th className="px-6 py-3">Matière</th>
                                <th className="px-6 py-3">Coefficient</th>
                                <th className="px-6 py-3">Moyenne</th>
                                <th className="px-6 py-3">Appréciation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matieres.map((m) => (
                                <tr key={m.matiereId} className="border-t border-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-800">{m.matiere}</td>
                                    <td className="px-6 py-3 text-slate-600">{m.coefficient}</td>
                                    <td className="px-6 py-3">
                                        <span className={`font-semibold ${m.moyenne >= 10 ? "text-emerald-600" : "text-red-500"}`}>
                                            {m.moyenne.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-600">{m.appreciation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <ClockAlert size={16} className="text-blue-500" />
                        <h2 className="text-base font-bold text-slate-800">Absences</h2>
                    </div>
                    {absences.nombre === 0 ? (
                        <p className="text-sm text-slate-400">Aucune absence enregistrée pour cette période.</p>
                    ) : (
                        <ul className="text-sm text-slate-600 space-y-1">
                            <li>Nombre d'heures : <span className="font-semibold text-slate-800">{absences.totalHeures} h</span></li>
                            <li>Dont justifiées : <span className="font-semibold text-slate-800">{absences.heuresJustifiees} h</span></li>
                            <li>Non justifiées : <span className="font-semibold text-slate-800">{absences.heuresNonJustifiees} h</span></li>
                        </ul>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText size={16} className="text-blue-500" />
                        <h2 className="text-base font-bold text-slate-800">Bulletin</h2>
                    </div>
                    {bulletin?.fichier_url ? (
                        <a
                            href={`${BASE_URL}/${bulletin.fichier_url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                        >
                            <FileText size={14} /> Consulter le bulletin
                        </a>
                    ) : (
                        <p className="text-sm text-slate-400">Bulletin non généré pour cette période.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
