import React, { useState } from "react";
import {
  CircleDot,
  MoreVertical,
  Eye,
  Pencil,
  Ban,
  Trash2,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Globe,
  ChevronsUpDown,
  ChevronDown
} from "lucide-react";

export function Badge({ tone = "slate", children }) {
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

export function StatutBadge({ statut }) {
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

export function TypeBadge({ type }) {
  const map = {
    Public: "blue",
    Privé: "green",
    Professionnel: "orange",
    Université: "slate",
  };
  return <Badge tone={map[type] || "slate"}>{type}</Badge>;
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, action }) {
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

export function IconBubble({ icon: Icon, color = "blue", size = 20 }) {
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

export function ActionsMenu({ onAction }) {
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
                onClick={() => {
                  onAction && onAction(item.label);
                  setOpen(false);
                }}
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

export function KPICard({ icon: Icon, label, value, trend, trendLabel, gradient }) {
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

export function QuickAction({ icon: Icon, label, color }) {
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

export function StatCard({ label, value, icon: Icon, color }) {
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

export function SettingsRow({ icon: Icon, label, description, children }) {
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

export function Navbar({ pageTitle }) {
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
          <SearchIcon size={16} className="text-slate-400" />
          <input
            placeholder="Rechercher un établissement, un directeur..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full font-body"
          />
        </div>

        <button className="relative w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <BellIcon size={18} className="text-slate-500" />
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

function SearchIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}

function BellIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
}
