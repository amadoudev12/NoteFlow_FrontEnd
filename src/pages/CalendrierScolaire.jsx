import { useEffect, useState } from 'react';
import {
  CalendarDays,
  CalendarPlus,
  CalendarRange,
  CheckCircle2,
  Circle,
  Plus,
  ChevronRight,
  Sparkles,
  Clock,
} from 'lucide-react';
import anneeService from '../../services/anneeAcademiqueService';
import trimestreService from '../../services/trimestreService';

const TRIMESTRES_TYPES = [
  { ordre: 1, libelle: 'Premier trimestre' },
  { ordre: 2, libelle: 'Deuxième trimestre' },
  { ordre: 3, libelle: 'Troisième trimestre' },
];

export default function CalendrierScolaire() {
  const [annees, setAnnees] = useState([]);
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [activeTab, setActiveTab] = useState('annee'); // 'annee' | 'trimestre'
  const [openYear, setOpenYear] = useState(null);
  const [year, setYear] = useState({ libelle: '', date_debut: '', date_fin: '' });
  const [term, setTerm] = useState({ nom: '', ordre: '', debut: '', fin: '' });

  const load = async () => {
    const { data } = await anneeService.list();
    setAnnees(data.annees);
    console.log('annees', data.annees);
    const a = data.annees.find((x) => x.actif) || data.annees[0];
    if (a) {
      setSelected(String(a.id));
      setOpenYear(a.id);
    }
  };

  useEffect(() => {
    load().catch(() => notify('Impossible de charger le calendrier.', 'error'));
  }, []);

  const notify = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
  };

  const createYear = async (e) => {
    e.preventDefault();
    if (year.date_debut && year.date_fin && year.date_debut >= year.date_fin) {
      notify('La date de fin doit être postérieure à la date de début.', 'error');
      return;
    }
    try {
      await anneeService.create(year);
      setYear({ libelle: '', date_debut: '', date_fin: '' });
      await load();
      notify('Année créée avec succès.', 'success');
    } catch (err) {
      notify(err.response?.data?.message || 'Erreur lors de la création.', 'error');
    }
  };

  const createTerm = async (e) => {
    e.preventDefault();
    if (term.debut && term.fin && term.debut >= term.fin) {
      notify('La date de fin doit être postérieure à la date de début.', 'error');
      return;
    }
    try {
      await trimestreService.postTrimestre({
        ...term,
        anneeAcademiqueId: Number(selected),
      });
      setTerm({ nom: '', ordre: '', debut: '', fin: '' });
      await load();
      notify('Trimestre créé avec succès.', 'success');
    } catch (err) {
      notify(err.response?.data?.message || 'Erreur lors de la création.', 'error');
    }
  };

  const activateYear = async (id) => {
    await anneeService.activate(id);
    load();
  };

  const yearActive = annees.find((a) => a.actif);
  const totalTrimestres = annees.reduce((sum, a) => sum + (a.trimestres?.length || 0), 0);

  // Trimestre actif, toutes années confondues
  const activeTrimestre = annees
    .flatMap((a) => a.trimestres || [])
    .find((t) => t.actif);

  // Trimestres déjà créés pour l'année académique sélectionnée dans l'onglet "Trimestre"
  const selectedYearTrimestres = annees.find((a) => String(a.id) === String(selected))?.trimestres || [];

  // Trimestres pas encore créés pour cette année (par libelle ou ordre)
  const trimestresDisponibles = TRIMESTRES_TYPES.filter(
    (type) => !selectedYearTrimestres.some((t) => t.libelle === type.libelle || t.ordre === type.ordre)
  );

  // Sélectionne automatiquement le prochain trimestre disponible dès que l'année choisie ou la liste change
  useEffect(() => {
    if (trimestresDisponibles.length > 0) {
      const prochain = trimestresDisponibles[0];
      setTerm((p) => ({ ...p, nom: prochain.libelle, ordre: prochain.ordre }));
    } else {
      setTerm((p) => ({ ...p, nom: '', ordre: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, annees]);

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  return (
    <div className="ml-45 max-sm:ml-2 max-lg:ml-8 max-w-7xl mx-auto space-y-6 pb-12">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Calendrier scolaire</h1>
            <p className="text-slate-500 text-sm">Périodes propres à votre établissement.</p>
          </div>
        </div>

        {/* Indicateurs rapides */}
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-center min-w-[110px]">
            <p className="text-xs text-slate-400 font-medium">Années</p>
            <p className="text-lg font-bold text-slate-800">{annees.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-center min-w-[110px]">
            <p className="text-xs text-slate-400 font-medium">Trimestres</p>
            <p className="text-lg font-bold text-slate-800">{totalTrimestres}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-center min-w-[130px]">
            <p className="text-xs text-blue-500 font-medium">Année active</p>
            <p className="text-lg font-bold text-blue-700 truncate">{yearActive?.libelle || '—'}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-center min-w-[160px]">
            <p className="text-xs text-emerald-500 font-medium">Trimestre actif</p>
            {activeTrimestre ? (
              <>
                <p className="text-sm font-bold text-emerald-700 truncate">{activeTrimestre.libelle}</p>
                <p className="text-[11px] text-emerald-500 mt-0.5">
                  {fmt(activeTrimestre.date_debut)} → {fmt(activeTrimestre.date_fin)}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-emerald-700">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
            messageType === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              : messageType === 'error'
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-blue-50 text-blue-700 border border-blue-100'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        {/* Colonne principale : timeline des années */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Historique des années académiques</h2>
          </div>

          {annees.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <CalendarRange className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucune année académique enregistrée pour le moment.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {annees.map((a) => {
                const isOpen = openYear === a.id;
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => setOpenYear(isOpen ? null : a.id)}
                      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          a.actif ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-800">{a.libelle}</span>
                          {a.actif && (
                            <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {fmt(a.date_debut)} → {fmt(a.date_fin)} · {a.trimestres?.length || 0} trimestre(s)
                        </p>
                      </div>
                      {!a.actif && (
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            activateYear(a.id);
                          }}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 rounded-lg px-3 py-1.5 shrink-0"
                        >
                          Activer
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="pl-10 pr-5 pb-4">
                        {a.trimestres?.length ? (
                          <ol className="space-y-2">
                            {a.trimestres.map((t) => (
                              <li
                                key={t.id_trimestre}
                                className="flex items-center gap-2.5 text-sm bg-slate-50 border border-slate-100 rounded-lg px-3 py-2"
                              >
                                {t.actif ? (
                                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                                )}
                                <span className="font-medium text-slate-700">
                                  {t.ordre}. {t.libelle}
                                </span>
                                <span className="ml-auto text-xs text-slate-400">
                                  {fmt(t.date_debut)} → {fmt(t.date_fin)}
                                </span>
                                {t.actif && (
                                  <span className="text-xs text-blue-600 font-medium">actif</span>
                                )}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-sm text-slate-400 flex items-center gap-1.5 py-1">
                            <Clock className="w-3.5 h-3.5" />
                            Aucun trimestre pour cette année.
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Colonne latérale : formulaires en onglets, position collante */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden lg:sticky lg:top-6">
          <div className="grid grid-cols-2">
            <button
              onClick={() => setActiveTab('annee')}
              className={`flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'annee'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <CalendarPlus className="w-4 h-4" />
              Année
            </button>
            <button
              onClick={() => setActiveTab('trimestre')}
              className={`flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'trimestre'
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <CalendarRange className="w-4 h-4" />
              Trimestre
            </button>
          </div>

          {activeTab === 'annee' ? (
            <form onSubmit={createYear} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Libellé</label>
                <input
                  required
                  placeholder="2025-2026"
                  value={year.libelle}
                  onChange={(e) => setYear({ ...year, libelle: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Début</label>
                  <input
                    required
                    type="date"
                    value={year.date_debut}
                    onChange={(e) => setYear({ ...year, date_debut: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Fin</label>
                  <input
                    required
                    type="date"
                    value={year.date_fin}
                    min={
                      year.date_debut
                        ? new Date(new Date(year.date_debut).getTime() + 86400000)
                            .toISOString()
                            .slice(0, 10)
                        : undefined
                    }
                    onChange={(e) => setYear({ ...year, date_fin: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Créer l'année
              </button>
            </form>
          ) : (
            <form onSubmit={createTerm} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Année académique</label>
                <select
                  required
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner...</option>
                  {annees.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Trimestre</label>
                <select
                  required
                  value={term.nom}
                  onChange={(e) => {
                    const sel = TRIMESTRES_TYPES.find((t) => t.libelle === e.target.value);
                    setTerm((p) => ({ ...p, nom: sel?.libelle || '', ordre: sel?.ordre || '' }));
                  }}
                  disabled={!selected || trimestresDisponibles.length === 0}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="" disabled>Sélectionner un trimestre</option>
                  {trimestresDisponibles.map((t) => (
                    <option key={t.ordre} value={t.libelle}>
                      {t.libelle}
                    </option>
                  ))}
                </select>
                {selected && trimestresDisponibles.length === 0 && (
                  <p className="text-xs text-slate-400 mt-1">Tous les trimestres ont déjà été créés pour cette année.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Début</label>
                  <input
                    required
                    type="date"
                    value={term.debut}
                    onChange={(e) => setTerm({ ...term, debut: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Fin</label>
                  <input
                    required
                    type="date"
                    value={term.fin}
                    min={
                      term.debut
                        ? new Date(new Date(term.debut).getTime() + 86400000)
                            .toISOString()
                            .slice(0, 10)
                        : undefined
                    }
                    onChange={(e) => setTerm({ ...term, fin: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Créer le trimestre
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}