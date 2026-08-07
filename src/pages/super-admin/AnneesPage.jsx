import React from "react";
import { CalendarRange, Plus } from "lucide-react";
import { Card, IconBubble, SectionTitle } from "../../components/super-admin/SharedComponents.jsx";
import { ANNEES_ACADEMIQUES } from "../../data/superAdminMockData.js";

export default function AnneesPage() {
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
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 px-3 py-1 rounded-full bg-slate-100">{a.statut}</span>
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
