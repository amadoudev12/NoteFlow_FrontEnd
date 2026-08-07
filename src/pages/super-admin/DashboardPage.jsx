import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Cell, PieChart, Pie, } from "recharts";
import { Building2, CheckCircle2, Users, CalendarRange, ArrowUpRight, Plus, UserPlus, CalendarCheck2, BookPlus } from "lucide-react";
import { KPICard, Card, SectionTitle, IconBubble, QuickAction, StatutBadge } from "../../components/super-admin/SharedComponents.jsx";
import { CROISSANCE_DATA, REPARTITION_DATA, ACTIVITE_HEBDO, ETABLISSEMENTS, ACTIVITIES } from "../../data/superAdminMockData.js";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPICard icon={Building2} label="Total établissements" value="128" trend="+12%" trendLabel="vs mois dernier" gradient="bg-gradient-to-r from-blue-500 to-blue-700" />
        <KPICard icon={CheckCircle2} label="Établissements actifs" value="118" trend="+8%" trendLabel="92% du total" gradient="bg-gradient-to-r from-green-500 to-green-700" />
        <KPICard icon={Users} label="Directeurs" value="128" trend="+4%" trendLabel="1 par établissement" gradient="bg-gradient-to-r from-orange-400 to-orange-600" />
        <KPICard icon={CalendarRange} label="Année académique active" value="2026-2027" gradient="bg-gradient-to-r from-slate-500 to-slate-700" trendLabel="Trimestre 2 en cours" />
      </div>

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
