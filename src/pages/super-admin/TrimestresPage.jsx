import React from "react";
import { BookOpen, Plus } from "lucide-react";
import { Card, IconBubble, SectionTitle, StatutBadge } from "../../components/super-admin/SharedComponents.jsx";
import { TRIMESTRES } from "../../data/superAdminMockData.js";

export default function TrimestresPage() {
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
              <ClockIcon /> {t.debut} — {t.fin}
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

function ClockIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}
