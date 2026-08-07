import React, { useEffect, useState } from "react";
import { CalendarRange, Plus, X } from "lucide-react";
import { Card, IconBubble } from "../../components/super-admin/SharedComponents.jsx";
import anneeAcademiqueService from "../../services/superAdmin/anneeAcademiqueService";

const emptyForm = {
  libelle: "",
  date_debut: "",
  date_fin: ""
};

const normalizeAnnee = (item) => ({
  id: item.id,
  libelle: item.libelle,
  statut: item.actif ? "active" : "archivee",
  etablissements: item.etablissements ?? 0,
  debut: item.date_debut ? new Date(item.date_debut).toLocaleDateString("fr-FR") : item.debut || "—",
  fin: item.date_fin ? new Date(item.date_fin).toLocaleDateString("fr-FR") : item.fin || "—"
});

export default function AnneesPage() {
  const [annees, setAnnees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadAnnees = async () => {
    try {
      const response = await anneeAcademiqueService.getAnneesAcademiques();
      setAnnees((response.data || []).map(normalizeAnnee));
    } catch (error) {
      console.error('Erreur chargement années', error);
    }
  };

  useEffect(() => {
    loadAnnees();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await anneeAcademiqueService.createAnnee(form);
      const created = normalizeAnnee(response.data);
      setAnnees((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
      setForm(emptyForm);
      setIsModalOpen(false);
      await loadAnnees();
    } catch (err) {
      setError(err?.response?.data?.message || 'Impossible de créer l’année académique.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await anneeAcademiqueService.activateAnnee(id);
      await loadAnnees();
    } catch (err) {
      setError(err?.response?.data?.message || 'Impossible d’activer cette année académique.');
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 font-body">Une seule année académique peut être active à la fois.</p>
          <p className="text-xs text-slate-400 font-body mt-0.5">Les années précédentes sont automatiquement archivées.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-linear-to-br from-blue-600 to-blue-700 text-white text-sm font-bold font-body px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          <Plus size={16} strokeWidth={2.5} />
          Nouvelle année académique
        </button>
      </Card>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {annees.slice().reverse().map((a) => (
          <Card key={a.id} className={`p-6 relative overflow-hidden fade-up ${a.statut === "active" ? "ring-2 ring-blue-500/40" : ""}`}>
            {a.statut === "active" && <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-green-500" />}
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
              <button
                onClick={() => handleActivate(a.id)}
                className="mt-4 w-full text-center text-xs font-bold text-blue-600 border border-blue-100 bg-blue-50/60 rounded-lg py-2 hover:bg-blue-50 transition-colors font-body"
              >
                Activer cette année
              </button>
            )}
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 font-body">Nouvelle année académique</p>
                <p className="text-xl font-display font-extrabold text-slate-900">Créer une nouvelle période</p>
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
                  placeholder="Ex. 2026-2027"
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
