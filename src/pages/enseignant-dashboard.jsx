import { useEffect, useState } from "react";
import {
  BookOpen, ClipboardList, Users, FileText,
  Calendar, CheckCircle2, Bell, X, Download, ChevronRight,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import ROW_COLORS from "../utils/RowColors";
import enseignantService from "../../services/enseignantService";
import { NavLink, useNavigate } from "react-router-dom";
import FicheNotesModal from "../components/FicheNotes";
import ClassePanel from "../components/ClassePannel";
// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, delta, iconBg, iconColor, deltaColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
        <Icon size={17} className={iconColor} />
      </div>
      <p className="text-3xl font-bold text-slate-800 tracking-tight">{value ?? "—"}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
      {delta && <p className={`text-xs mt-2 font-medium ${deltaColor}`}>{delta}</p>}
    </div>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────
function ActionBtn({ icon: Icon, label, sub, iconBg, iconColor, path, onClick }) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left w-full"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={15} className={iconColor} />
        </div>
        <p className="text-sm font-semibold text-slate-800 leading-tight">{label}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </button>
    );
  }
  return (
    <NavLink
      to={path || "#"}
      className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={15} className={iconColor} />
      </div>
      <p className="text-sm font-semibold text-slate-800 leading-tight">{label}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </NavLink>
  );
}

// ─── Class Row ────────────────────────────────────────────────────────────────


function ClassRow({ name, effectif, index }) {
  const color = ROW_COLORS[index % ROW_COLORS.length]
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-none">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full shrink-0 ${color.dot}`} />
        <p className="text-sm font-semibold text-slate-800">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        <Users size={12} className="text-slate-400" />
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color.badge}`}>
          {effectif} élève{effectif > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}

function ClassRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-slate-200" />
        <div className="h-3.5 w-28 bg-slate-100 rounded" />
      </div>
      <div className="h-5 w-16 bg-slate-100 rounded-full" />
    </div>
  )
}

// ─── Activity Item ────────────────────────────────────────────────────────────
function ActivityItem({ icon: Icon, iconBg, iconColor, text, time }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-none">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}>
        <Icon size={13} className={iconColor} />
      </div>
      <div>
        <p className="text-sm text-slate-700 leading-snug">{text}</p>
        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// ─── Modale Fiche de Notes ────────────────────────────────────────────────────
// ─── Modale Fiche de Notes ────────────────────────────────────────────────────


// ─── Dashboard Content ────────────────────────────────────────────────────────
function DashboardContent({ user }) {
  const [statistique, setStatistique]     = useState(null)
  const [classeEffectif, setClasseEffectif] = useState(null)
  const [matieres, setMatieres]           = useState([])
  const [showFicheModal, setShowFicheModal] = useState(false)
  const [showNotesPanel, setShowNotesPanel] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token');
  // if(jwtDecode(token).user.firstLogin){
  //       navigate('/modification')
  // }
  const logOut = ()=>{
    localStorage.clear()
    navigate('/')
  }
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [stat, classeE, classesApi] = await Promise.all([
          enseignantService.getStat(),
          enseignantService.classeEffectif(),
          enseignantService.getClassesApi(),
        ])
        if (stat.data)     setStatistique(stat.data)
        if (classeE.data)  setClasseEffectif(classeE.data)
        // classeEnseigner = [{ classe: { id, libelle }, matiere }]
        if (classesApi.data) {
          setMatieres(classesApi.data)
        }
      } catch (err) {
        console.log("erreur serveur")
      }
    }
    fetchAll()
  }, [])
  const stats = [
    {
      icon: BookOpen, label: "Classes assignées",
      value: statistique?.nombreClasse,
      delta: "+1 ce trimestre", deltaColor: "text-blue-600",
      iconBg: "bg-blue-50", iconColor: "text-blue-600",
    },
    {
      icon: Users, label: "Élèves au total",
      value: statistique?.nombreEleve,
      delta: "Tous niveaux confondus", deltaColor: "text-teal-700",
      iconBg: "bg-teal-50", iconColor: "text-teal-700",
    },
    {
      icon: ClipboardList, label: "Matières",
      value: statistique?.nombreMatiere,
      delta: "cette année", deltaColor: "text-amber-700",
      iconBg: "bg-amber-50", iconColor: "text-amber-700",
    },
  ]

  const actions = [
    { icon: ClipboardList, label: "Saisir les notes",         sub: "Évaluations en attente",  iconBg: "bg-blue-600",   iconColor: "text-white", path: "/dashboard/notes" },
    { icon: FileText,      label: "Générer une fiche de notes", sub: "Format PDF disponible",  iconBg: "bg-indigo-600", iconColor: "text-white", onClick: () => setShowFicheModal(true) },
    { icon: Users,         label: "Notes",          sub: "Voir les notes saisies",       iconBg: "bg-teal-700",   iconColor: "text-white", path: "/dashboard/eleves", onClick: () => setShowNotesPanel(true)},
    { icon: Calendar,      label: "Faire l'appel",             sub: "Gestion des absences",         iconBg: "bg-amber-700",  iconColor: "text-white", path: "/dashboard/FaireAppel" },
  ]

  // const activity = [
  //   { icon: CheckCircle2, iconBg: "bg-blue-50",   iconColor: "text-blue-600",   text: "Notes de Terminale A soumises avec succès", time: "Il y a 2 heures" },
  //   { icon: Bell,         iconBg: "bg-amber-50",  iconColor: "text-amber-700",  text: "Délai de saisie Première C dans 3 jours",   time: "Rappel automatique" },
  //   { icon: FileText,     iconBg: "bg-indigo-50", iconColor: "text-indigo-600", text: "Bulletin de Seconde B généré",               time: "Hier à 16h30" },
  //   { icon: Users,        iconBg: "bg-teal-50",   iconColor: "text-teal-700",   text: "Nouvel élève ajouté en Troisième D",         time: "Il y a 2 jours" },
  //   { icon: Calendar,     iconBg: "bg-orange-50", iconColor: "text-orange-700", text: "Conseil de classe programmé — 12 mai",       time: "Il y a 3 jours" },
  // ]
  const date = new Date ()
  const toDay = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
  return (
    <div className="space-y-6">

      {/* Modale */}
      {showFicheModal && (
        <FicheNotesModal
          matieres={matieres}
          onClose={() => setShowFicheModal(false)}
        />
      )}
      {showNotesPanel && (
        <ClassePanel
          classes={matieres}
          onClose={() => setShowNotesPanel(false)}
        />
      )}
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {user?.nom?.[0]}{user?.prenom?.[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{user?.nom} {user?.prenom}</h1>
            <p className="text-xs text-slate-400">Enseignant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex gap-4 text-xs text-slate-500 bg-white border border-slate-100 px-3 py-1.5 rounded-full max-sm:hidden">
            <Calendar size={15} />
                {toDay}
          </span>
          <button onClick={logOut}>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-100">
              <CheckCircle2 size={13} /> Se deconnecter
            </div>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Vue d'ensemble</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Actions rapides</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actions.map((a, i) => <ActionBtn key={i} {...a} />)}
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Classes */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-800">Mes classes</p>
            <span className="text-xs text-slate-400">
              {classeEffectif
                ? `${classeEffectif?.length} classe${classeEffectif?.length > 1 ? "s" : ""}`
                : "…"
              }
            </span>
          </div>
          {!classeEffectif
            ? Array.from({ length: 4 }).map((_, i) => <ClassRowSkeleton key={i} />)
            : classeEffectif?.length === 0
              ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Users size={28} className="mb-2 opacity-40" />
                  <p className="text-sm">Aucune classe assignée</p>
                </div>
              )
              : classeEffectif?.map((c, i) => (
                  <ClassRow key={i} index={i} name={c.name} effectif={c.effectif} />
                ))
          }
          {classeEffectif?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total élèves</span>
              <span className="text-xs font-semibold text-slate-700">
                {classeEffectif.reduce((sum, c) => sum + c.effectif, 0)} élèves
              </span>
            </div>
          )}
        </div>

        {/* Activity */}
        {/* <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-800">Activité récente</p>
            <span className="text-xs text-blue-600 font-medium cursor-pointer">Tout voir</span>
          </div>
          {activity.map((a, i) => <ActivityItem key={i} {...a} />)}
        </div> */}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const [profil, setProfile] = useState(null)
    const token = localStorage.getItem("token")
    const decodedToken = jwtDecode(token)
    const role = decodedToken?.user?.user?.role || decodedToken?.user?.role || decodedToken?.role
    const firstLogin = decodedToken?.user?.user?.firstLogin ?? decodedToken?.user?.firstLogin ?? decodedToken?.firstLogin
  
    if (firstLogin && role === "ENSEIGNANT") {
        navigate('/modification')
        return
    }
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const user = jwtDecode(token)
        setProfile(user.profil)
      } catch (err) {
        console.log("erreur serveur")
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.18s ease-out both; }
      `}</style>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 px-4 lg:px-8 py-6">
          <DashboardContent user={profil} />
        </main>
      </div>
    </div>
  )
}