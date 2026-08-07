import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, AreaChart, Area } from "recharts";
import { Building2, GraduationCap, ShieldCheck, TrendingUp } from "lucide-react";
import { StatCard, Card, SectionTitle } from "../../components/super-admin/SharedComponents.jsx";
import { CROISSANCE_DATA, REPARTITION_DATA, ACTIVITE_HEBDO } from "../../data/superAdminMockData.js";

export default function StatistiquesPage() {
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
