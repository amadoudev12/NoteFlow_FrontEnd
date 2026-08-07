import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import classeService from "../../services/classeService";
import { set } from "zod";
import trimestreService from "../../services/trimestreService";
import absenceService from "../../services/absence.service";


// Anneau SVG animé pour la moyenne générale
function MoyenneRing({ value, max = 20 }) {
  const radius = 70;
  const stroke = 10;
  const norm = radius - stroke / 2;
  const circ = 2 * Math.PI * norm;
  const pct = Math.min(value / max, 1);
  const dash = circ * pct;

  const color =
    value >= 14 ? "#22c55e" : value >= 10 ? "#2563EB" : "#ef4444";

  return (
    <svg width="180" height="180" className="mx-auto">
      {/* Track */}
      <circle
        cx="90"
        cy="90"
        r={norm}
        fill="none"
        stroke="#DBEAFE"
        strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx="90"
        cy="90"
        r={norm}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      {/* Valeur */}
      <text
        x="90"
        y="86"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="28"
        fontWeight="700"
        fill="#1E3A5F"
      >
        {typeof value === "number" ? value.toFixed(2) : "—"}
      </text>
      <text
        x="90"
        y="112"
        textAnchor="middle"
        fontSize="12"
        fill="#64748B"
      >
        / 20
      </text>
    </svg>
  );
}

// Carte KPI générique
function KpiCard({ label, value, sub, accent = "#2563EB" }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 flex flex-col gap-1"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span
        className="text-3xl font-bold tabular-nums"
        style={{ color: accent }}
      >
        {value}
      </span>
      {sub && <span className="text-sm text-slate-500">{sub}</span>}
    </div>
  );
}

// Badge podium
function PodiumCard({ title, eleve, accent, icon }) {
  if (!eleve) return null;
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5 flex items-center gap-4"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
        style={{ background: accent + "20", color: accent }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
          {title}
        </p>
        <p className="font-bold text-slate-800 truncate">
          {eleve.prenom} {eleve.nom}
        </p>
        <p className="text-sm text-slate-500">
          Moyenne :{" "}
          <span className="font-semibold" style={{ color: accent }}>
            {eleve.moyenne.toFixed(2)} / 20
          </span>
        </p>
      </div>
    </div>
  );
}

// Tooltip personnalisé pour le BarChart
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  
  const raw = payload[0]?.value;
  const valeur = typeof raw === "number" ? raw.toFixed(2) : String(raw ?? "—");

  return (
    <div className="bg-white border border-blue-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">
        {String(label ?? "")}
      </p>
      <p className="text-xl font-bold text-blue-600">
        {valeur}
        <span className="text-sm font-normal text-slate-400"> / 20</span>
      </p>
    </div>
  );
}

// Modal listant les absences de la classe
function AbsencesModal({ open, onClose, loading, absences, nomClasse, trimestreLabel }) {
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    if (!open) setFilterDate("");
  }, [open]);

  if (!open) return null;

  const absencesFiltrees = filterDate
    ? absences.filter((a) => a.date?.slice(0, 10) === filterDate)
    : absences;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-blue-100 w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête modal */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
        >
          <div>
            <h3 className="text-lg font-bold text-white">Absences — {nomClasse}</h3>
            {trimestreLabel && (
              <p className="text-blue-200 text-xs mt-0.5">{trimestreLabel}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl leading-none px-2"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Filtre par date */}
        <div className="flex items-center gap-3 px-6 pt-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Filtrer par date
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-blue-200 rounded-lg px-3 py-1.5 text-sm text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Contenu */}
        <div className="overflow-y-auto p-6 pt-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Chargement des absences…</p>
            </div>
          ) : absencesFiltrees.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-10">
              {filterDate
                ? "Aucune absence à cette date."
                : "Aucune absence enregistrée."}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="pb-3 pr-4">Élève</th>
                  <th className="pb-3 pr-4">Matière</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody>
                {absencesFiltrees.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <p className="font-medium text-slate-800">
                        {a.eleve?.prenom} {a.eleve?.nom}
                      </p>
                      <p className="text-xs text-slate-400">{a.eleve?.matricule}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {a.affectation?.matiere?.nom ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {a.date?.slice(0, 10)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {a.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const REPARTITION_COLORS = ["#ef4444", "#f59e0b", "#2563EB", "#22c55e"];
const REPARTITION_LABELS = {
  "0-5": "Insuffisant",
  "5-10": "Passable",
  "10-15": "Assez bien",
  "15-20": "Bien / TB",
};

export default function ClasseStats() {
  const [stats, setStats] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [repartition, setRepartition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classeInfo, setClasseInfo] = useState(null)
  const [trimestre, setTrimestre] = useState(null)
  const [trimestreActive, setTrimestreActive] = useState(null)
  const [trimestreSelect, setTrimestreSelect] = useState(null)
  const [absences, setAbsences] = useState([])
  const [loadingAbsences, setLoadingAbsences] = useState(false)
  const [showAbsences, setShowAbsences] = useState(false)
  const {classeId} = useParams()
  useEffect(()=>{
    const chargerTrimestreActive = async () => {
      try {
        const t = await trimestreService.getTrimestres()
        const restrimestreActive = await trimestreService.getTrimestresActive()
        const trimestre_id = restrimestreActive.data.trimestreActive.id_trimestre
        setTrimestre(t.data)
        setTrimestreSelect(trimestre_id)
        setTrimestreActive(restrimestreActive.data.trimestreActive) //trimestreActive est la reponse ramener par le serveur 
      }catch (err)  {
        console.log("imposible de charger le trimestre active")
      }
    }
    chargerTrimestreActive()
  },[])
  console.log(trimestreSelect)
  useEffect(() => {
    if(!trimestreSelect) return
    (async () => {
      try {
        const [s, m, r,i] = await Promise.all([ //s: statistique m: moyenneMatiere, r: repartition de notes , i:infos sur la classe
          classeService.statClasse(classeId, {id_trimestre: trimestreSelect}),
          classeService.moyenneMaptieres(classeId, {id_trimestre: trimestreSelect}),
          classeService.repartitionNotes(classeId, {id_trimestre: trimestreSelect}),
          classeService.classeInfo(classeId),
        ]);
        setStats(s.data);
        setMatieres(m.data?.moyneeMatieresClasse);
        setRepartition(
          r.data?.repartitionNote.map((d, i) => ({
            ...d,
            label: REPARTITION_LABELS[d.range] ?? d.range,
            color: REPARTITION_COLORS[i] ?? "#2563EB",
          }))
        );
        setClasseInfo(i.data)
      } finally {
        setLoading(false);
      }
    })();
    console.log("useEffect execute")
  }, [classeId, trimestreSelect]);

    let nomClasse = classeInfo?.classe?.libelle
    let trimestreLabel = trimestreActive?.libelle

  const consulterAbsences = async () => {
    setShowAbsences(true);
    try {
      setLoadingAbsences(true);
      const res = await absenceService.getAbsenceByClasse(classeId);
      setAbsences(res.data?.data ?? []);
    } catch (err) {
      console.log("impossible de charger les absences");
      setAbsences([]);
    } finally {
      setLoadingAbsences(false);
    }
  };
  // Couleur barre selon moyenne
  const barColor = (val) =>
    val >= 14 ? "#22c55e" : val >= 10 ? "#2563EB" : "#ef4444";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Chargement des statistiques…</p>
        </div>
      </div>
    );
  }

  const totalEleves = stats?.total ?? 0

  return (
    <div className="p-6 ml-45 max-sm:ml-2 max-lg:ml-8 min-h-screen bg-slate-50 font-sans">
      {/* ── Header ── */}
      <header
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)" }}
      >
        {/* Cercle décoratif */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#FFFFFF" }}
        />
        <div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: "#FFFFFF" }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Titre */}
          <div>
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Tableau de bord
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {nomClasse}
            </h1>
            <select 
              value={trimestreSelect ?? ""}
              onChange={(e)=> {
                console.log('trimestre selectionne:', e.target.value)
                setTrimestreSelect(Number(e.target.value))
              }}
            >
                {/* <option value="">
                  {trimestreLabel}
                </option> */}
              {
                  trimestre?.map(t=>(
                    <option key={t.id_trimestre} value={t.id_trimestre}>
                      {t.libelle}
                    </option>
                  ))
              }
            </select>
            <p className="text-blue-200 mt-1 text-sm">
              Statistiques générales · {totalEleves} élèves
            </p>
            <button
              onClick={consulterAbsences}
              className="mt-3 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-lg transition backdrop-blur"
            >
              📋 Consulter les absences
            </button>
          </div>

          {/* Anneau moyenne */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 flex flex-col items-center gap-1 min-w-50">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">
              Moyenne générale
            </p>
            {stats && <MoyenneRing value={stats.moyenne} />}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ── KPI Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            label="Moyenne de classe"
            value={typeof stats?.moyenne === "number" ? stats.moyenne.toFixed(2) : "—"}
            sub="sur 20 points"
            accent="#2563EB"
          />
          <KpiCard
            label="Élèves ≥ 10"
            value={stats?.meilleurEtMauvais.fort}
            sub={`sur ${totalEleves} élèves`}
            accent="#22c55e"
          />
          <KpiCard
            label="Élèves < 10"
            value={stats?.meilleurEtMauvais.faible}
            sub={`sur ${totalEleves} élèves`}
            accent="#ef4444"
          />
        </div>

        {/* ── Podium ── */}
        {stats?.meilleurEtMauvais && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PodiumCard
              title="Meilleur(e) élève"
              eleve={stats.meilleurEtMauvais.meilleure}
              accent="#22c55e"
              icon="🏆"
            />
            <PodiumCard
              title="Élève à soutenir"
              eleve={stats.meilleurEtMauvais.mauvaise}
              accent="#ef4444"
              icon="📌"
            />
          </div>
        )}

        {/* ── Graphique Matières ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">
              Moyennes par matière
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={matieres}
              margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              barSize={36}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EFF6FF" vertical={false} />
              <XAxis
                dataKey="nom"
                tick={{ fontSize: 12, fill: "#64748B", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 20]}
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#EFF6FF" }} />
              {/* Ligne seuil 10 */}
              <Bar dataKey="moyenneMat" radius={[6, 6, 0, 0]}>
                {matieres.map((entry, i) => (
                  <Cell key={i} fill={barColor(entry.moyenneMat)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Légende couleurs */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {[
              { color: "#22c55e", label: "≥ 14 — Bien" },
              { color: "#2563EB", label: "10–14 — Moyen" },
              { color: "#ef4444", label: "< 10 — Insuffisant" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: l.color }}
                />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Répartition des notes ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">
              Répartition des notes
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Donut */}
            <div className="w-full md:w-72 shrink-0">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={repartition}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {repartition.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, name) => [`${v} élève(s)`, name]}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #DBEAFE",
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Table détaillée */}
            {
                repartition.length  > 0 ?  (
                    <div className="flex-1 w-full">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                <th className="pb-3 pr-4">Tranche</th>
                                <th className="pb-3 pr-4">Mention</th>
                                <th className="pb-3 pr-4 text-right">Élèves</th>
                                <th className="pb-3 text-right">%</th>
                            </tr>
                            </thead>
                            <tbody>
                            {repartition.map((d, i) => {
                                const pct = totalEleves
                                ? ((d.count / totalEleves) * 100).toFixed(1)
                                : "0.0";
                                return (
                                <tr
                                    key={i}
                                    className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors"
                                >
                                    <td className="py-3 pr-4">
                                    <span
                                        className="inline-block w-2.5 h-2.5 rounded-full mr-2"
                                        style={{ background: d.color }}
                                    />
                                    <span className="font-mono font-semibold text-slate-700">
                                        {d.range}
                                    </span>
                                    </td>
                                    <td className="py-3 pr-4 text-slate-500">{d.label}</td>
                                    <td className="py-3 pr-4 text-right font-bold text-slate-800">
                                    {d.count}
                                    </td>
                                    <td className="py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                            width: `${pct}%`,
                                            background: d.color,
                                            }}
                                        />
                                        </div>
                                        <span className="text-slate-500 w-10 text-right">
                                        {pct}%
                                        </span>
                                    </div>
                                    </td>
                                </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                ):(
                    <div>
                        Auncune note 
                    </div>
                )
            }
            
          </div>
        </div>
      </main>

      <AbsencesModal
        open={showAbsences}
        onClose={() => setShowAbsences(false)}
        loading={loadingAbsences}
        absences={absences}
        nomClasse={nomClasse}
        trimestreLabel={trimestreLabel}
      />
    </div>
  );
}