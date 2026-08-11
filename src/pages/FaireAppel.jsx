import { useEffect, useState } from "react";
import enseignantService from "../../services/enseignantService";
import classeService from "../../services/classeService";
import absenceService from "../../services/absence.service";
import { Calendar, CheckCircle2, Users, ClipboardList, Loader2, Clock3 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function FaireAppel() {
  const [affectations, setAffectations] = useState([]);
  const [classes, setClasses] = useState([]);

  const [classe, setClasse] = useState("");
  const [affectation, setAffectation] = useState("");

  const [eleves, setEleves] = useState([]);
  // { [matricule]: "ABSENT" | "RETARD" }
  const [statuts, setStatuts] = useState({});
  // { [matricule]: nombre d'heures } — propre à chaque élève sélectionné
  const [heuresParEleve, setHeuresParEleve] = useState({});
  // { [matricule]: "oui" | "non" } — propre à chaque élève sélectionné
  const [justificationsParEleve, setJustificationsParEleve] = useState({});

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [loading, setLoading] = useState(false);
  const [loadingEleves, setLoadingEleves] = useState(false);

  useEffect(() => {
    const chargerAffectations = async () => {
      try {
        const res = await enseignantService.getClassesApi();
        const data = res.data;

        setAffectations(data);

        const classesUniques = [
          ...new Map(data.map((item) => [item.classe.id, item.classe])).values(),
        ];

        setClasses(classesUniques);
      } catch (error) {
        console.error(error);
      }
    };

    chargerAffectations();
  }, []);

  const changerClasse = (value) => {
    setClasse(value);
    setAffectation("");
    setEleves([]);
    setStatuts({});
    setHeuresParEleve({});
    setJustificationsParEleve({});
  };

  const chargerEleves = async () => {
    if (!classe) {
      toast.error("veuillez selectionner la classe");
      return;
    }

    try {
      setLoadingEleves(true);
      const res = await classeService.getListApi(classe);
      setEleves(res.data.listeEleves);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les élèves");
    } finally {
      setLoadingEleves(false);
    }
  };

  // Sélectionne un statut pour un élève, ou le retire si déjà actif (toggle)
  const setStatut = (matricule, statut) => {
    const statutDejaSelectionne = statuts[matricule] === statut;
    setStatuts((prev) => {
      const next = { ...prev };
      if (statutDejaSelectionne) {
        delete next[matricule];
      } else {
        next[matricule] = statut;
      }
      return next;
    });
    setHeuresParEleve((prev) => {
      if (statutDejaSelectionne) {
        const next = { ...prev };
        delete next[matricule];
        return next;
      }
      return { ...prev, [matricule]: prev[matricule] ?? 1 };
    });
    setJustificationsParEleve((prev) => {
      if (statutDejaSelectionne) {
        const next = { ...prev };
        delete next[matricule];
        return next;
      }
      return { ...prev, [matricule]: prev[matricule] ?? "non" };
    });
  };

  const setNombreHeuresEleve = (matricule, valeur) => {
    setHeuresParEleve((prev) => ({ ...prev, [matricule]: valeur }));
  };

  const setJustificationEleve = (matricule, valeur) => {
    setJustificationsParEleve((prev) => ({ ...prev, [matricule]: valeur }));
  };

  const absentsCount = Object.values(statuts).filter((s) => s === "ABSENT").length;
  const retardsCount = Object.values(statuts).filter((s) => s === "RETARD").length;

  const enregistrer = async () => {
    if (!affectation) {
      toast.error("Veuillez choisir une matière");
      return;
    }

    const entries = Object.entries(statuts);

    if (entries.length === 0) {
      toast.error("Aucun élève absent ou en retard sélectionné");
      return;
    }

    const elevesSelectionnes = entries.map(([matricule, statut]) => ({
      matricule,
      statut,
      nombreHeures: Number(heuresParEleve[matricule]),
      justifie: justificationsParEleve[matricule] ?? "non",
    }));

    if (elevesSelectionnes.some(({ nombreHeures }) => !Number.isInteger(nombreHeures) || nombreHeures <= 0)) {
      toast.error("Le nombre d'heures de chaque élève doit être un entier supérieur à 0");
      return;
    }

    try {
      setLoading(true);

      await absenceService.postAbsence({
        affectationId: Number(affectation),
        date,
        eleves: elevesSelectionnes,
      });

      toast.success("Absences enregistrées avec succès");
      setStatuts({});
      setHeuresParEleve({});
      setJustificationsParEleve({});
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Faire l'appel</h1>
            <p className="text-sm text-blue-600/70">Enregistrer les absences et retards du jour</p>
          </div>
        </div>

        {/* Carte de sélection */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-blue-900/70 mb-1.5 uppercase tracking-wide">
                Classe
              </label>
              <select
                className="w-full border border-blue-200 rounded-lg p-3 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={classe}
                onChange={(e) => changerClasse(e.target.value)}
              >
                <option value="">Choisir une classe</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.libelle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-900/70 mb-1.5 uppercase tracking-wide">
                Matière
              </label>
              <select
                className="w-full border border-blue-200 rounded-lg p-3 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50"
                value={affectation}
                onChange={(e) => setAffectation(e.target.value)}
                disabled={!classe}
              >
                <option value="">Choisir une matière</option>
                {affectations
                  .filter((a) => a.classe.id === Number(classe))
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.matiere.nom}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-900/70 mb-1.5 uppercase tracking-wide">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                <input
                  type="date"
                  className="w-full border border-blue-200 rounded-lg p-3 pl-10 bg-blue-50/50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={chargerEleves}
            disabled={loadingEleves}
            className="mt-5 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            {loadingEleves ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
              </>
            ) : (
              <>
                <Users className="w-4 h-4" /> Charger les élèves
              </>
            )}
          </button>
        </div>

        {/* Liste des élèves */}
        {eleves.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="flex justify-between items-center bg-blue-600 text-white px-5 py-3">
              <span className="font-semibold">Élève</span>
              <div className="flex items-center gap-2">
                {absentsCount > 0 && (
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
                    {absentsCount} absent{absentsCount > 1 ? "s" : ""}
                  </span>
                )}
                {retardsCount > 0 && (
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
                    {retardsCount} retard{retardsCount > 1 ? "s" : ""}
                  </span>
                )}
                <span className="font-semibold">Heures</span>
                <span className="font-semibold">Justification</span>
                <span className="font-semibold">Statut</span>
              </div>
            </div>

            <div className="divide-y divide-blue-50">
              {eleves.map((eleve) => {
                const statut = statuts[eleve.matricule];
                const isAbsent = statut === "ABSENT";
                const isRetard = statut === "RETARD";
                return (
                  <div
                    key={eleve.matricule}
                    className={`flex justify-between items-center px-5 py-4 transition ${
                      isAbsent ? "bg-red-50/60" : isRetard ? "bg-amber-50/60" : "hover:bg-blue-50/40"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-blue-950">
                        {eleve.nom} {eleve.prenom}
                      </p>
                      <p className="text-sm text-blue-500/70">{eleve.matricule}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {(isAbsent || isRetard) && (
                        <>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            aria-label={`Nombre d'heures pour ${eleve.nom} ${eleve.prenom}`}
                            className="w-16 border border-blue-200 rounded-lg px-2 py-1.5 bg-blue-50/50 text-center text-sm text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={heuresParEleve[eleve.matricule] ?? 1}
                            onChange={(e) => setNombreHeuresEleve(eleve.matricule, e.target.value)}
                          />
                          <select
                            aria-label={`Justification pour ${eleve.nom} ${eleve.prenom}`}
                            className="border border-blue-200 rounded-lg px-2 py-1.5 bg-blue-50/50 text-sm text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={justificationsParEleve[eleve.matricule] ?? "non"}
                            onChange={(e) => setJustificationEleve(eleve.matricule, e.target.value)}
                          >
                            <option value="non">Non justifiée</option>
                            <option value="oui">Justifiée</option>
                          </select>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => setStatut(eleve.matricule, "ABSENT")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                          isAbsent
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatut(eleve.matricule, "RETARD")}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                          isRetard
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-white text-amber-600 border-amber-200 hover:bg-amber-50"
                        }`}
                      >
                        <Clock3 className="w-3.5 h-3.5" /> Retard
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 bg-blue-50/40">
              <button
                onClick={enregistrer}
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Valider l'appel
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
