import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarRange,
  BookOpen,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Ban,
  Trash2,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Mail,
  Phone,
  Clock,
  Sparkles,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  CircleDot,
  UserPlus,
  CalendarCheck2,
  BookPlus,
  Palette,
  Globe,
  Image as ImageIcon,
  ChevronsUpDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from "recharts";

/* ============================================================
   FONTS
   ============================================================ */
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
    .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
    @keyframes pulseDot {
      0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.35); }
      50% { box-shadow: 0 0 0 6px rgba(37,99,235,0); }
    }
    .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.4s ease-out both; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
  `}</style>
);

/* ============================================================
   MOCK DATA
   ============================================================ */
const VILLES = ["Conakry", "Labé", "Kankan", "Kindia", "Nzérékoré", "Boké", "Mamou", "Faranah", "Kissidougou", "Siguiri"];
const TYPES_ETAB = ["Public", "Privé", "Professionnel", "Université"];

const PRENOMS = ["Mamadou", "Aïssatou", "Ibrahima", "Fatoumata", "Ousmane", "Mariama", "Alpha", "Kadiatou", "Thierno", "Hadja", "Sékou", "Djénabou"];
const NOMS = ["Diallo", "Barry", "Camara", "Bah", "Sow", "Baldé", "Condé", "Touré", "Keïta", "Sylla"];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function fullName() { return `${rand(PRENOMS)} ${rand(NOMS)}`; }

const ETABLISSEMENTS = Array.from({ length: 15 }).map((_, i) => {
  const type = rand(TYPES_ETAB);
  const nomsBase = {
    Public: ["Groupe Scolaire", "Lycée", "Collège"],
    Privé: ["Complexe Scolaire", "Institut", "École Privée"],
    Professionnel: ["Centre de Formation", "Institut Technique"],
    Université: ["Université", "Institut Universitaire"],
  };
  const ville = rand(VILLES);
  const suffixes = ["La Réussite", "Les Flamboyants", "El Hadj Omar", "Sainte Marie", "Excellence", "Horizon", "Nouvel Espoir", "Étoile du Fouta", "Wassa", "Les Palmiers"];
  const nom = `${rand(nomsBase[type])} ${rand(suffixes)}`;
  const statut = Math.random() > 0.15 ? "actif" : "suspendu";
  return {
    id: i + 1,
    nom,
    ville,
    type,
    directeur: fullName(),
    dateCreation: `${randInt(1, 28)}/${String(randInt(1, 12)).padStart(2, "0")}/2026`,
    statut,
    eleves: randInt(120, 2400),
  };
});

const DIRECTEURS = Array.from({ length: 10 }).map((_, i) => {
  const nom = fullName();
  const initials = nom.split(" ").map((n) => n[0]).join("");
  return {
    id: i + 1,
    nom,
    initials,
    email: `${nom.toLowerCase().replace(" ", ".")}@ecole-gn.com`,
    telephone: `+224 6${randInt(20, 99)} ${randInt(10, 99)} ${randInt(10, 99)} ${randInt(10, 99)}`,
    etablissement: ETABLISSEMENTS[i % ETABLISSEMENTS.length].nom,
    statut: Math.random() > 0.1 ? "actif" : "inactif",
  };
});

const ANNEES_ACADEMIQUES = [
  { id: 1, libelle: "2023-2024", statut: "archivee", etablissements: 96, debut: "01/10/2023", fin: "30/06/2024" },
  { id: 2, libelle: "2024-2025", statut: "archivee", etablissements: 110, debut: "01/10/2024", fin: "30/06/2025" },
  { id: 3, libelle: "2025-2026", statut: "archivee", etablissements: 121, debut: "01/10/2025", fin: "30/06/2026" },
  { id: 4, libelle: "2026-2027", statut: "active", etablissements: 128, debut: "01/10/2026", fin: "30/06/2027" },
];

const TRIMESTRES = [
  { id: 1, nom: "Trimestre 1", debut: "01/10/2026", fin: "20/12/2026", progression: 100, statut: "termine" },
  { id: 2, nom: "Trimestre 2", debut: "05/01/2027", fin: "28/03/2027", progression: 62, statut: "en cours" },
  { id: 3, nom: "Trimestre 3", debut: "05/04/2027", fin: "30/06/2027", progression: 0, statut: "a venir" },
];

const CROISSANCE_DATA = [
  { mois: "Jan", etablissements: 96 },
  { mois: "Fév", etablissements: 99 },
  { mois: "Mar", etablissements: 101 },
  { mois: "Avr", etablissements: 104 },
  { mois: "Mai", etablissements: 108 },
  { mois: "Juin", etablissements: 110 },
  { mois: "Juil", etablissements: 112 },
  { mois: "Août", etablissements: 116 },
  { mois: "Sep", etablissements: 119 },
  { mois: "Oct", etablissements: 122 },
  { mois: "Nov", etablissements: 125 },
  { mois: "Déc", etablissements: 128 },
];

const REPARTITION_DATA = [
  { name: "Public", value: 52, color: "#2563eb" },
  { name: "Privé", value: 41, color: "#16a34a" },
  { name: "Professionnel", value: 22, color: "#f97316" },
  { name: "Université", value: 13, color: "#94a3b8" },
];

const ACTIVITE_HEBDO = [
  { jour: "Lun", connexions: 240 },
  { jour: "Mar", connexions: 310 },
  { jour: "Mer", connexions: 280 },
  { jour: "Jeu", connexions: 360 },
  { jour: "Ven", connexions: 400 },
  { jour: "Sam", connexions: 190 },
  { jour: "Dim", connexions: 120 },
];

const ACTIVITIES = [
  { id: 1, type: "etablissement", texte: "Établissement « Lycée Les Flamboyants » créé à Kindia", temps: "Il y a 12 min", icon: Building2, color: "blue" },
  { id: 2, type: "directeur", texte: "Directeur Mamadou Diallo ajouté au Complexe Scolaire Excellence", temps: "Il y a 48 min", icon: UserPlus, color: "green" },
  { id: 3, type: "annee", texte: "Année académique 2026-2027 activée sur la plateforme", temps: "Il y a 3 h", icon: CalendarCheck2, color: "orange" },
  { id: 4, type: "trimestre", texte: "Trimestre 2 créé pour l'année 2026-2027", temps: "Il y a 5 h", icon: BookPlus, color: "blue" },
  { id: 5, type: "etablissement", texte: "Établissement « Institut Wassa » suspendu pour non-paiement", temps: "Hier, 18:22", icon: Ban, color: "red" },
  { id: 6, type: "directeur", texte: "Fatoumata Barry a mis à jour son profil directeur", temps: "Hier, 14:05", icon: UserCheck, color: "green" },
];

const LOGS = [
  { id: 1, action: "Connexion Super Admin", utilisateur: "Diallo El Hadj Amadou", date: "07/08/2026 09:14", statut: "succes" },
  { id: 2, action: "Création établissement", utilisateur: "Diallo El Hadj Amadou", date: "07/08/2026 09:20", statut: "succes" },
  { id: 3, action: "Suspension établissement", utilisateur: "Diallo El Hadj Amadou", date: "06/08/2026 18:22", statut: "alerte" },
  { id: 4, action: "Tentative de connexion échouée", utilisateur: "inconnu@mail.com", date: "06/08/2026 22:41", statut: "echec" },
  { id: 5, action: "Activation année académique", utilisateur: "Diallo El Hadj Amadou", date: "05/08/2026 10:02", statut: "succes" },
  { id: 6, action: "Modification paramètres plateforme", utilisateur: "Diallo El Hadj Amadou", date: "04/08/2026 16:47", statut: "succes" },
];

/* ============================================================
   NAV CONFIG
   ============================================================ */
const NAV_ITEMS = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "etablissements", label: "Établissements", icon: Building2 },
  { key: "directeurs", label: "Directeurs", icon: Users },
  { key: "annees", label: "Années académiques", icon: CalendarRange },
  { key: "trimestres", label: "Trimestres", icon: BookOpen },
  { key: "statistiques", label: "Statistiques", icon: BarChart3 },
  { key: "logs", label: "Journaux système", icon: ScrollText },
  { key: "parametres", label: "Paramètres", icon: Settings },
];

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */
function Badge({ tone = "slate", children }) {
  const tones = {
    green: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
    orange: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
    blue: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
    slate: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${tones[tone]}`}>
      {children}
    </span>
  );
}

function StatutBadge({ statut }) {
  const map = {
    actif: { tone: "green", label: "Actif" },
    active: { tone: "green", label: "Active" },
    suspendu: { tone: "red", label: "Suspendu" },
    inactif: { tone: "slate", label: "Inactif" },
    archivee: { tone: "slate", label: "Archivée" },
    "en cours": { tone: "blue", label: "En cours" },
    "a venir": { tone: "orange", label: "À venir" },
    termine: { tone: "slate", label: "Terminé" },
    succes: { tone: "green", label: "Succès" },
    alerte: { tone: "orange", label: "Alerte" },
    echec: { tone: "red", label: "Échec" },
  };
  const cfg = map[statut] || { tone: "slate", label: statut };
  return (
    <Badge tone={cfg.tone}>
      <CircleDot size={11} strokeWidth={3} />
      {cfg.label}
    </Badge>
  );
}

function TypeBadge({ type }) {
  const map = {
    Public: "blue",
    Privé: "green",
    Professionnel: "orange",
    Université: "slate",
  };
  return <Badge tone={map[type] || "slate"}>{type}</Badge>;
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        {eyebrow && <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase font-body mb-1">{eyebrow}</p>}
        <h2 className="text-lg font-bold text-slate-900 font-display">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function IconBubble({ icon: Icon, color = "blue", size = 20 }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    slate: "bg-slate-100 text-slate-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
      <Icon size={size} strokeWidth={2.2} />
    </div>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function Sidebar({ active, setActive }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200/80 flex flex-col z-30">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
          <GraduationCap size={22} className="text-white" strokeWidth={2.2} />
        </div>
        <div>
          <p className="font-display font-extrabold text-slate-900 text-[15px] leading-tight">EduSuite</p>
          <p className="text-[11px] text-slate-400 font-body font-medium tracking-wide">SUPER ADMIN</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-body mb-2">Pilotage</p>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold font-body transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              )}
              <item.icon size={18} strokeWidth={isActive ? 2.4 : 2} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
              <span>{item.label}</span>
              {item.key === "logs" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 pulse-dot" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold font-body text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
          <LogOut size={18} strokeWidth={2} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar({ pageTitle }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <header className="sticky top-0 z-20 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8">
      <div>
        <h1 className="font-display font-extrabold text-xl text-slate-900">{pageTitle}</h1>
        <p className="text-xs text-slate-400 font-body capitalize">{dateStr}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 w-72 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all">
          <Search size={16} className="text-slate-400" />
          <input
            placeholder="Rechercher un établissement, un directeur..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full font-body"
          />
        </div>

        <button className="relative w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-display font-bold text-sm shadow-md shadow-blue-600/20">
            DA
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-800 font-body leading-tight">Diallo El Hadj Amadou</p>
            <p className="text-[11px] text-blue-600 font-bold font-body tracking-wide">SUPER ADMIN</p>
          </div>
          <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */
function KPICard({ icon: Icon, label, value, trend, trendLabel, gradient }) {
  return (
    <Card className="p-5 relative overflow-hidden fade-up">
      <div className={`absolute top-0 left-0 right-0 h-1 ${gradient}`} />
      <div className="flex items-start justify-between mb-4">
        <IconBubble icon={Icon} color="blue" />
        {trend && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg font-body">
            <ArrowUpRight size={12} strokeWidth={3} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">{value}</p>
      <p className="text-sm text-slate-500 font-body mt-1">{label}</p>
      {trendLabel && <p className="text-[11px] text-slate-400 font-body mt-2">{trendLabel}</p>}
    </Card>
  );
}

function QuickAction({ icon: Icon, label, color }) {
  const colors = {
    blue: "from-blue-600 to-blue-700 shadow-blue-600/25",
    green: "from-green-600 to-green-700 shadow-green-600/25",
    orange: "from-orange-500 to-orange-600 shadow-orange-500/25",
    slate: "from-slate-700 to-slate-800 shadow-slate-700/20",
  };
  return (
    <button className="group flex flex-col items-start gap-3 p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-transparent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-left w-full">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg text-white`}>
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800 font-body">{label}</p>
        <p className="text-xs text-slate-400 font-body mt-0.5">Créer maintenant</p>
      </div>
    </button>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Section 1 - KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPICard icon={Building2} label="Total établissements" value="128" trend="+12%" trendLabel="vs mois dernier" gradient="bg-gradient-to-r from-blue-500 to-blue-700" />
        <KPICard icon={CheckCircle2} label="Établissements actifs" value="118" trend="+8%" trendLabel="92% du total" gradient="bg-gradient-to-r from-green-500 to-green-700" />
        <KPICard icon={Users} label="Directeurs" value="128" trend="+4%" trendLabel="1 par établissement" gradient="bg-gradient-to-r from-orange-400 to-orange-600" />
        <KPICard icon={CalendarRange} label="Année académique active" value="2026-2027" gradient="bg-gradient-to-r from-slate-500 to-slate-700" trendLabel="Trimestre 2 en cours" />
      </div>

      {/* Section 2 & 3 - Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2">
          <SectionTitle eyebrow="Croissance" title="Évolution du nombre d'établissements" />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={CROISSANCE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEtab" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "Inter" }} />
              <Area type="monotone" dataKey="etablissements" stroke="#2563eb" strokeWidth={2.5} fill="url(#colorEtab)" name="Établissements" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <SectionTitle eyebrow="Répartition" title="Par type d'établissement" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={REPARTITION_DATA} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {REPARTITION_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "Inter" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {REPARTITION_DATA.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm font-body">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Section 4 & 5 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6 xl:col-span-2">
          <SectionTitle
            eyebrow="Récents"
            title="Derniers établissements créés"
            action={
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 font-body flex items-center gap-1">
                Voir tout <ArrowUpRight size={13} />
              </button>
            }
          />
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
                  <th className="px-2 pb-3 font-semibold">Nom</th>
                  <th className="px-2 pb-3 font-semibold">Ville</th>
                  <th className="px-2 pb-3 font-semibold">Directeur</th>
                  <th className="px-2 pb-3 font-semibold">Créé le</th>
                  <th className="px-2 pb-3 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {ETABLISSEMENTS.slice(0, 5).map((e) => (
                  <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <td className="px-2 py-3 font-semibold text-slate-800">{e.nom}</td>
                    <td className="px-2 py-3 text-slate-500">{e.ville}</td>
                    <td className="px-2 py-3 text-slate-500">{e.directeur}</td>
                    <td className="px-2 py-3 text-slate-500">{e.dateCreation}</td>
                    <td className="px-2 py-3"><StatutBadge statut={e.statut} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle eyebrow="Suivi" title="Dernières activités" />
          <div className="space-y-5 relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100" />
            {ACTIVITIES.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-3 relative">
                <div className="relative z-10">
                  <IconBubble icon={a.icon} color={a.color === "red" ? "red" : a.color} size={16} />
                </div>
                <div className="pt-1.5">
                  <p className="text-sm text-slate-700 font-body leading-snug">{a.texte}</p>
                  <p className="text-xs text-slate-400 font-body mt-1">{a.temps}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Section 6 - Quick Actions */}
      <div>
        <SectionTitle eyebrow="Raccourcis" title="Actions rapides" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <QuickAction icon={Plus} label="Créer un établissement" color="blue" />
          <QuickAction icon={UserPlus} label="Créer un directeur" color="green" />
          <QuickAction icon={CalendarCheck2} label="Nouvelle année académique" color="orange" />
          <QuickAction icon={BookPlus} label="Créer un trimestre" color="slate" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ETABLISSEMENTS PAGE
   ============================================================ */
function ActionsMenu({ onAction }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 fade-up">
            {[
              { label: "Voir", icon: Eye, tone: "text-slate-600" },
              { label: "Modifier", icon: Pencil, tone: "text-slate-600" },
              { label: "Suspendre", icon: Ban, tone: "text-orange-600" },
              { label: "Supprimer", icon: Trash2, tone: "text-red-600" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { onAction && onAction(item.label); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm font-body font-medium hover:bg-slate-50 ${item.tone}`}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EtablissementsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    return ETABLISSEMENTS.filter((e) => {
      const matchSearch = e.nom.toLowerCase().includes(search.toLowerCase()) || e.ville.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "Tous" || e.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 flex-1 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Rechercher un établissement ou une ville..."
                className="bg-transparent text-sm outline-none w-full font-body text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
              <Filter size={15} className="text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                className="bg-transparent text-sm outline-none font-body text-slate-700 cursor-pointer"
              >
                <option>Tous</option>
                {TYPES_ETAB.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-bold font-body px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap">
            <Plus size={16} strokeWidth={2.5} />
            Ajouter un établissement
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left bg-slate-50/70 text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Établissement</th>
                <th className="px-6 py-3.5 font-semibold">Ville</th>
                <th className="px-6 py-3.5 font-semibold">Type</th>
                <th className="px-6 py-3.5 font-semibold">Directeur</th>
                <th className="px-6 py-3.5 font-semibold">Créé le</th>
                <th className="px-6 py-3.5 font-semibold">Statut</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((e) => (
                <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{e.nom}</p>
                    <p className="text-xs text-slate-400">{e.eleves.toLocaleString("fr-FR")} élèves</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-slate-300" />{e.ville}</span>
                  </td>
                  <td className="px-6 py-4"><TypeBadge type={e.type} /></td>
                  <td className="px-6 py-4 text-slate-500">{e.directeur}</td>
                  <td className="px-6 py-4 text-slate-500">{e.dateCreation}</td>
                  <td className="px-6 py-4"><StatutBadge statut={e.statut} /></td>
                  <td className="px-6 py-4 text-right"><ActionsMenu /></td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-body">Aucun établissement ne correspond à votre recherche.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-body">
            Page {page} sur {totalPages} — {filtered.length} établissement{filtered.length > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   DIRECTEURS PAGE
   ============================================================ */
function DirecteursPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {DIRECTEURS.map((d) => (
        <Card key={d.id} className="p-5 fade-up">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-display font-bold shadow-md shadow-blue-600/20">
                {d.initials}
              </div>
              <div>
                <p className="font-bold text-slate-800 font-body text-sm">{d.nom}</p>
                <p className="text-xs text-slate-400 font-body">{d.etablissement}</p>
              </div>
            </div>
            <ActionsMenu />
          </div>
          <div className="space-y-2 text-sm font-body text-slate-500">
            <div className="flex items-center gap-2"><Mail size={14} className="text-slate-300" /> {d.email}</div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-slate-300" /> {d.telephone}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <StatutBadge statut={d.statut} />
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 font-body">Voir le profil →</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ============================================================
   ANNEES ACADEMIQUES PAGE
   ============================================================ */
function AnneesPage() {
  return (
    <div className="space-y-5">
      <Card className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 font-body">Une seule année académique peut être active à la fois.</p>
          <p className="text-xs text-slate-400 font-body mt-0.5">Les années précédentes sont automatiquement archivées.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-bold font-body px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap">
          <Plus size={16} strokeWidth={2.5} />
          Nouvelle année académique
        </button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ANNEES_ACADEMIQUES.slice().reverse().map((a) => (
          <Card key={a.id} className={`p-6 relative overflow-hidden fade-up ${a.statut === "active" ? "ring-2 ring-blue-500/40" : ""}`}>
            {a.statut === "active" && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500" />}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <IconBubble icon={CalendarRange} color={a.statut === "active" ? "green" : "slate"} />
                <div>
                  <p className="font-display font-extrabold text-lg text-slate-900">{a.libelle}</p>
                  <p className="text-xs text-slate-400 font-body">{a.debut} — {a.fin}</p>
                </div>
              </div>
              <StatutBadge statut={a.statut} />
            </div>
            <div className="mt-5 flex items-center justify-between text-sm font-body">
              <span className="text-slate-400">Établissements rattachés</span>
              <span className="font-bold text-slate-800">{a.etablissements}</span>
            </div>
            {a.statut !== "active" && (
              <button className="mt-4 w-full text-center text-xs font-bold text-blue-600 border border-blue-100 bg-blue-50/60 rounded-lg py-2 hover:bg-blue-50 transition-colors font-body">
                Consulter les archives
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TRIMESTRES PAGE
   ============================================================ */
function TrimestresPage() {
  return (
    <div className="space-y-5">
      <Card className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 font-body">Année académique active : 2026-2027</p>
          <p className="text-xs text-slate-400 font-body mt-0.5">Trois trimestres composent l'année scolaire.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-bold font-body px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap">
          <Plus size={16} strokeWidth={2.5} />
          Créer un trimestre
        </button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TRIMESTRES.map((t) => (
          <Card key={t.id} className="p-6 fade-up">
            <div className="flex items-start justify-between mb-5">
              <IconBubble icon={BookOpen} color={t.statut === "en cours" ? "blue" : t.statut === "termine" ? "green" : "slate"} />
              <StatutBadge statut={t.statut} />
            </div>
            <p className="font-display font-bold text-lg text-slate-900">{t.nom}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-body mt-1 mb-5">
              <Clock size={12} /> {t.debut} — {t.fin}
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-body mb-1.5">
                <span className="text-slate-400">Progression</span>
                <span className="font-bold text-slate-700">{t.progression}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.statut === "termine" ? "bg-green-500" : t.statut === "en cours" ? "bg-blue-500" : "bg-slate-200"}`}
                  style={{ width: `${t.progression}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   STATISTIQUES PAGE
   ============================================================ */
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card className="p-5 flex items-center gap-4 fade-up">
      <IconBubble icon={Icon} color={color} />
      <div>
        <p className="text-xl font-extrabold text-slate-900 font-display">{value}</p>
        <p className="text-xs text-slate-400 font-body">{label}</p>
      </div>
    </Card>
  );
}

function StatistiquesPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Établissements" value="128" icon={Building2} color="blue" />
        <StatCard label="Élèves inscrits" value="24 680" icon={GraduationCap} color="green" />
        <StatCard label="Directeurs actifs" value="118" icon={ShieldCheck} color="orange" />
        <StatCard label="Taux de croissance annuel" value="+18%" icon={TrendingUp} color="slate" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle eyebrow="Tendance" title="Croissance des établissements" />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={CROISSANCE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "Inter" }} />
              <Line type="monotone" dataKey="etablissements" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3, fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <SectionTitle eyebrow="Répartition" title="Établissements par type" />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={REPARTITION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "Inter" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {REPARTITION_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 xl:col-span-2">
          <SectionTitle eyebrow="Engagement" title="Activité hebdomadaire (connexions plateforme)" />
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={ACTIVITE_HEBDO} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActivite" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="jour" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "Inter" }} />
              <Area type="monotone" dataKey="connexions" stroke="#16a34a" strokeWidth={2.5} fill="url(#colorActivite)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   LOGS PAGE
   ============================================================ */
function LogsPage() {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <SectionTitle eyebrow="Sécurité" title="Journaux d'activité système" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="text-left bg-slate-50/70 text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
              <th className="px-6 py-3.5 font-semibold">Action</th>
              <th className="px-6 py-3.5 font-semibold">Utilisateur</th>
              <th className="px-6 py-3.5 font-semibold">Date</th>
              <th className="px-6 py-3.5 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {LOGS.map((log) => (
              <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800">{log.action}</td>
                <td className="px-6 py-4 text-slate-500">{log.utilisateur}</td>
                <td className="px-6 py-4 text-slate-500">{log.date}</td>
                <td className="px-6 py-4"><StatutBadge statut={log.statut} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ============================================================
   PARAMETRES PAGE
   ============================================================ */
function SettingsRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-slate-100 last:border-0">
      <div className="flex items-start gap-3">
        <IconBubble icon={Icon} color="blue" size={17} />
        <div>
          <p className="text-sm font-bold text-slate-800 font-body">{label}</p>
          <p className="text-xs text-slate-400 font-body mt-0.5">{description}</p>
        </div>
      </div>
      <div className="sm:w-72">{children}</div>
    </div>
  );
}

function ParametresPage() {
  const [nomPlateforme, setNomPlateforme] = useState("EduSuite Guinée");
  const [fuseau, setFuseau] = useState("GMT (Conakry)");
  const [langue, setLangue] = useState("Français");
  const [couleur, setCouleur] = useState("#2563eb");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <Card className="p-6">
          <SectionTitle eyebrow="Identité" title="Configuration générale de la plateforme" />
          <SettingsRow icon={Sparkles} label="Nom de la plateforme" description="Affiché dans la navigation et les emails.">
            <input
              value={nomPlateforme}
              onChange={(e) => setNomPlateforme(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </SettingsRow>
          <SettingsRow icon={ImageIcon} label="Logo de la plateforme" description="Format PNG ou SVG, fond transparent recommandé.">
            <button className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg py-2.5 text-xs font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors font-body">
              <Plus size={14} /> Téléverser un logo
            </button>
          </SettingsRow>
          <SettingsRow icon={Palette} label="Couleur principale" description="Utilisée pour les boutons et accents.">
            <div className="flex items-center gap-3">
              <input type="color" value={couleur} onChange={(e) => setCouleur(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
              <span className="text-sm font-mono text-slate-500">{couleur}</span>
            </div>
          </SettingsRow>
          <SettingsRow icon={Globe} label="Fuseau horaire" description="Utilisé pour toutes les dates système.">
            <select
              value={fuseau}
              onChange={(e) => setFuseau(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            >
              <option>GMT (Conakry)</option>
              <option>GMT+1 (Dakar)</option>
              <option>GMT+0 (Londres)</option>
            </select>
          </SettingsRow>
          <SettingsRow icon={ChevronsUpDown} label="Langue par défaut" description="Langue utilisée sur toute la plateforme.">
            <select
              value={langue}
              onChange={(e) => setLangue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            >
              <option>Français</option>
              <option>Anglais</option>
            </select>
          </SettingsRow>
        </Card>
        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-bold font-body px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Enregistrer les modifications
          </button>
        </div>
      </div>

      <Card className="p-6 h-fit">
        <SectionTitle eyebrow="Aperçu" title="Prévisualisation" />
        <div className="rounded-xl border border-slate-100 p-5 bg-slate-50/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-display font-bold text-xs" style={{ backgroundColor: couleur }}>
              {nomPlateforme.slice(0, 2).toUpperCase()}
            </div>
            <p className="font-display font-bold text-sm text-slate-800">{nomPlateforme}</p>
          </div>
          <button className="w-full text-white text-xs font-bold font-body py-2 rounded-lg" style={{ backgroundColor: couleur }}>
            Bouton d'action
          </button>
          <p className="text-[11px] text-slate-400 font-body mt-4">{fuseau} · {langue}</p>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   PAGE TITLES
   ============================================================ */
const PAGE_TITLES = {
  dashboard: "Tableau de bord",
  etablissements: "Établissements",
  directeurs: "Directeurs",
  annees: "Années académiques",
  trimestres: "Trimestres",
  statistiques: "Statistiques",
  logs: "Journaux système",
  parametres: "Paramètres",
};

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [active, setActive] = useState("dashboard");

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <DashboardPage />;
      case "etablissements": return <EtablissementsPage />;
      case "directeurs": return <DirecteursPage />;
      case "annees": return <AnneesPage />;
      case "trimestres": return <TrimestresPage />;
      case "statistiques": return <StatistiquesPage />;
      case "logs": return <LogsPage />;
      case "parametres": return <ParametresPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] font-body">
      <FontStyles />
      <Sidebar active={active} setActive={setActive} />
      <div className="pl-72">
        <Navbar pageTitle={PAGE_TITLES[active]} />
        <main className="p-8 max-w-[1600px] mx-auto">{renderPage()}</main>
      </div>
    </div>
  );
}