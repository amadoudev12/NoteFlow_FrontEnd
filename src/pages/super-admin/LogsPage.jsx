import React, { useEffect, useState } from "react";
import { Card, SectionTitle, StatutBadge } from "../../components/super-admin/SharedComponents.jsx";
import logService from "../../services/superAdmin/logService";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await logService.getLogs();
        setLogs(response.data || []);
      } catch (error) {
        console.error('Erreur chargement logs', error);
      }
    };
    load();
  }, []);

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
            {logs.map((log) => (
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
