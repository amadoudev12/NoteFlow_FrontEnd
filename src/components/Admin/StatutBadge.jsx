import { Lock, CircleDot, Clock } from "lucide-react"

// Badge de statut réutilisé pour les années académiques et les trimestres dans
// tout le module Archives. Les statuts sont ceux calculés côté backend
// (utils/archives.util.js) à partir du booléen `actif` déjà présent en base.
const CONFIG = {
    EN_COURS: { label: "En cours", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CircleDot },
    CLOTURE: { label: "Clôturé", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: Lock },
    TERMINEE: { label: "Terminée", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: Lock },
    A_VENIR: { label: "À venir", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
}

export default function StatutBadge({ statut, className = "" }) {
    const cfg = CONFIG[statut] ?? CONFIG.CLOTURE
    const Icon = cfg.icon
    return (
        <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${className}`}
        >
            <Icon size={12} />
            {cfg.label}
        </span>
    )
}
