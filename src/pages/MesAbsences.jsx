import { useEffect, useState } from "react";
import absenceService from "../../services/absence.service";
import { jwtDecode } from "jwt-decode";
import {
  CalendarDays,
  AlertCircle,
  Clock3,
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";

export default function MesAbsences() {
  const [absences, setAbsences] = useState([]);
  const [eleve, setEleve] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const res = await absenceService.getMesAbsences();
        setEleve(res.data.data.eleve);
        setAbsences(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsences();
  }, []);

  const total = absences.length;
  const absents = absences.filter((a) => a.statut === "ABSENT").length;
  const retards = absences.filter((a) => a.statut === "RETARD").length;
  const justifiees = absences.filter((a) => a.justifie === "oui").length;
  const totalHeures = absences.reduce((total, absence) => total + (absence.nombreHeures ?? 1), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Chargement de vos absences…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ── Header ── */}
      <header
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10 bg-white" />

        <div className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Mon suivi
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Mes absences
            </h1>
            <p className="text-blue-200 mt-1 text-sm">Année scolaire en cours</p>
          </div>

          {/* Profil élève */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 flex items-center gap-4 min-w-64">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">
                {decodedToken?.profil.nom} {decodedToken?.profil.prenom}
              </p>
              <p className="text-blue-200 text-sm">
                Matricule : {decodedToken?.profil.matricule}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ── Statistiques ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<CalendarDays className="w-5 h-5" />}
            title="Total"
            value={total}
            accent="#2563EB"
          />
          <StatCard
            icon={<XCircle className="w-5 h-5" />}
            title="Absences"
            value={absents}
            accent="#ef4444"
          />
          <StatCard
            icon={<Clock3 className="w-5 h-5" />}
            title="Retards"
            value={retards}
            accent="#f59e0b"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            title="Justifiées"
            value={justifiees}
            accent="#22c55e"
          />
          <StatCard
            icon={<Clock3 className="w-5 h-5" />}
            title="Heures"
            value={`${totalHeures} h`}
            accent="#2563EB"
          />
        </div>

        {/* ── Tableau ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-50">
            <div className="w-1 h-6 rounded-full bg-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">
              Historique des absences
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100 bg-blue-50/40">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Matière</th>
                  <th className="px-6 py-3">Trimestre</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Heures</th>
                  <th className="px-6 py-3">Justification</th>
                </tr>
              </thead>
              <tbody>
                {absences.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-14">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-blue-200" />
                        <p className="text-slate-400 font-medium">
                          Aucune absence enregistrée
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {absences.map((absence) => (
                  <tr
                    key={absence.id}
                    className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {new Date(absence.date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {absence.affectation.matiere.nom}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {absence.trimestre.libelle}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          absence.statut === "ABSENT"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {absence.statut === "ABSENT" ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock3 className="w-3.5 h-3.5" />
                        )}
                        {absence.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {absence.nombreHeures ?? 1} h
                    </td>
                    <td className="px-6 py-4">
                      {absence.justifie === "oui" ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Justifiée
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-500 text-sm font-medium">
                          <XCircle className="w-4 h-4" /> Non justifiée
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, accent = "#2563EB" }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 flex flex-col gap-2"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: accent }}>{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {title}
        </span>
      </div>
      <span className="text-3xl font-bold tabular-nums" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}
