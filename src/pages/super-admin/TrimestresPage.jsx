import React, { useEffect, useState } from "react";
import { BookOpen, Plus, X } from "lucide-react";
import { Card, IconBubble, StatutBadge } from "../../components/super-admin/SharedComponents.jsx";
import trimestreService from "../../services/superAdmin/trimestreService";

const emptyForm = {
  libelle: "",
  date_debut: "",
  date_fin: "",
  actif: false
};

export default function TrimestresPage() {
  const [trimestres, setTrimestres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadTrimestres = async () => {
    try {
      const response = await trimestreService.getTrimestres();
      setTrimestres(response.data || []);
    } catch (error) {
      console.error('Erreur chargement trimestres', error);
    }
  };

  useEffect(() => {
    loadTrimestres();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await trimestreService.createTrimestre(form);
      setTrimestres((prev) => [response.data || {}, ...prev]);
      setForm(emptyForm);
      setIsModalOpen(false);
      await loadTrimestres();
    } catch (err) {
      setError(err?.response?.data?.message || 'Impossible de créer le trimestre.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 font-body">Année académique active : 2026-2027</p>
          <p className="text-xs text-slate-400 font-body mt-0.5">Trois trimestres composent l'année scolaire.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-linear-to-br from-blue-600 to-blue-700 text-white text-sm font-bold font-body px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          <Plus size={16} strokeWidth={2.5} />
          Créer un trimestre
        </button>
      </Card>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {trimestres.map((t) => (
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 font-body">Nouveau trimestre</p>
                <p className="text-xl font-display font-extrabold text-slate-900">Créer un nouveau trimestre</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Libellé</label>
                <input
                  required
                  value={form.libelle}
                  onChange={(e) => setForm((prev) => ({ ...prev, libelle: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="Ex. Trimestre 1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Date de début</label>
                  <input
                    required
                    type="date"
                    value={form.date_debut}
                    onChange={(e) => setForm((prev) => ({ ...prev, date_debut: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">Date de fin</label>
                  <input
                    required
                    type="date"
                    value={form.date_fin}
                    onChange={(e) => setForm((prev) => ({ ...prev, date_fin: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm((prev) => ({ ...prev, actif: e.target.checked }))}
                />
                Définir comme trimestre actif
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                  Annuler
                </button>
                <button type="submit" disabled={submitting} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  {submitting ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ClockIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
}
