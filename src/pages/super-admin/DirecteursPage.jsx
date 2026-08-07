import React from "react";
import { Mail, Phone } from "lucide-react";
import { Card, StatutBadge, IconBubble, ActionsMenu } from "../../components/super-admin/SharedComponents.jsx";
import { DIRECTEURS } from "../../data/superAdminMockData.js";

export default function DirecteursPage() {
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
