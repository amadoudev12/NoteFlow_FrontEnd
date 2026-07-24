import { useState, useEffect } from "react";
import {
  UserPlus,
  Trash2,
  BookOpen,
  Users,
  GraduationCap,
  Hash,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ClipboardList,
  Pencil,
  X,
  Save,
  Loader2,
  School,
  User,
} from "lucide-react";
import classeService from "../../services/classeService";
import matiereService from "../../services/matiere.service";
import enseignantService from "../../services/enseignantService";
import affectationService from "../../services/affectations.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fullName(e) {
  return `${e.prenom} ${e.nom}`;
}

function getInitials(e) {
  return `${e.prenom?.[0] ?? ""}${e.nom?.[0] ?? ""}`.toUpperCase();
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export function Toast({ toast }) {
  if (!toast) return null;
  const config = {
    success: {
      icon: <CheckCircle size={15} />,
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    warning: {
      icon: <AlertTriangle size={15} />,
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    error: {
      icon: <XCircle size={15} />,
      cls: "bg-red-50 text-red-700 border border-red-200",
    },
  };
  const { icon, cls } = config[toast.type] || config.error;
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium mb-4 ${cls}`}
    >
      {icon}
      {toast.msg}
    </div>
  );
}

// ─── SelectField ──────────────────────────────────────────────────────────────

function SelectField({ label, icon: Icon, value, onChange, options, placeholder, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon size={11} />
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-slate-800 transition-all outline-none cursor-pointer
          ${error
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-200 hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">Ce champ est obligatoire</p>}
    </div>
  );
}

// ─── CoeffField ───────────────────────────────────────────────────────────────

function CoeffField({ value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Hash size={11} />
        Coefficient
      </label>
      <input
        type="number"
        min={1}
        max={10}
        placeholder="Ex : 3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-slate-800 transition-all outline-none
          ${error
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-200 hover:border-blue-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          }`}
      />
      {error && <p className="text-xs text-red-500">Entre 1 et 10</p>}
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ affectation, classes, matieres, enseignants, affectations, onClose, onSave }) {
  const [form, setForm] = useState({
    classeId: String(affectation.classeId),
    matiereId: String(affectation.matiereId),
    matricule: affectation.matricule,
    coeff: affectation.coeff,
  });
  const [errors, setErrors] = useState({});

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const validate = () => {
    const e = {};
    if (!form.classeId) e.classeId = true;
    if (!form.matiereId) e.matiereId = true;
    if (!form.matricule) e.matricule = true;
    if (!form.coeff || Number(form.coeff) < 1 || Number(form.coeff) > 10) e.coeff = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const classeObj = classes.find((c) => String(c.id) === form.classeId);
    const matiereObj = matieres.find((m) => String(m.id) === form.matiereId);
    const enseignantObj = enseignants.find((e) => e.matricule === form.matricule);
    const doublon = affectations.find(
      (a) =>
        a.id !== affectation.id &&
        String(a.classeId) === form.classeId &&
        String(a.matiereId) === form.matiereId &&
        a.matricule === form.matricule
    );
    if (doublon) return;
    onSave({
      ...affectation,
      classeId: Number(form.classeId),
      libelleClasse: classeObj?.libelle ?? "",
      matiereId: Number(form.matiereId),
      nomMatiere: matiereObj?.nom ?? "",
      matricule: enseignantObj?.matricule ?? "",
      nomEnseignant: enseignantObj ? fullName(enseignantObj) : "",
      enseignant: enseignantObj ?? null,
      coeff: Number(form.coeff),
    });
  };

  const classeOptions = classes.map((c) => ({ value: String(c.id), label: c.libelle }));
  const matiereOptions = matieres.map((m) => ({ value: String(m.id), label: m.nom }));
  const enseignantOptions = enseignants.map((e) => ({
    value: e.enseignant_id,
    label: fullName(e.enseignant),
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Pencil size={14} className="text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Modifier l'affectation</h3>
              <p className="text-xs text-slate-400">ID #{affectation.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Classe" icon={BookOpen} value={form.classeId} onChange={(v) => setField("classeId", v)} options={classeOptions} placeholder="Choisir une classe" error={errors.classeId} />
          <SelectField label="Matière" icon={BookOpen} value={form.matiereId} onChange={(v) => setField("matiereId", v)} options={matiereOptions} placeholder="Choisir une matière" error={errors.matiereId} />
          <SelectField label="Enseignant" icon={Users} value={form.matricule} onChange={(v) => setField("matricule", v)} options={enseignantOptions} placeholder="Choisir un enseignant" error={errors.matricule} />
          <CoeffField value={form.coeff} onChange={(v) => setField("coeff", v)} error={errors.coeff} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white text-sm font-medium transition-all"
          >
            <X size={13} /> Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-semibold transition-all"
          >
            <Save size={13} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AffectationPage() {
  const [mode, setMode] = useState("enseignant");

  const [openForm, setOpenForm] = useState(false)
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [affectations, setAffectations] = useState([]);
  const [form, setForm] = useState({ classeId: "", matiereId: "", matricule: "", coeff: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [newRowId, setNewRowId] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [mats, profs, clas, affect] = await Promise.all([
          matiereService.getMatieres(),
          enseignantService.getEnseignants(),
          classeService.getAllClasse(),
          affectationService.getAffectations()
        ]);
          setMatieres(mats.data.matieres);
          setEnseignants(profs.data.enseignants);
          setClasses(clas.data.classes);
          const mapped = affect.data.affectations.map((a) => ({
            id: a.id,
            classeId: a.id_classe,
            libelleClasse: a.classe.libelle,
            // libelleClasse: classes.find((c) => c.id === a.id_classe)?.libelle
            //   ?? clas.data.classes.find((c) => c.id === a.id_classe)?.libelle
            //   ?? "",
            matiereId: a.id_matiere,
            nomMatiere: a.matiere?.nom ?? "",
            matricule: a.id_prof,
            nomEnseignant: a.compteInstitutionnel?.user?.enseignant
              ? `${a.compteInstitutionnel.user.enseignant.nom} ${a.compteInstitutionnel.user.enseignant.prenom}`
              : "",
            enseignant: a.enseignant ?? null,
            coeff: a.coefficient,
          }));
          console.log(mapped)
          setAffectations(mapped);
      } catch {
        setFetchError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const validate = () => {
    const e = {};
    if (!form.classeId) e.classeId = true;
    if (!form.matiereId) e.matiereId = true;
    if (!form.matricule) e.matricule = true;
    if (!form.coeff || Number(form.coeff) < 1 || Number(form.coeff) > 10) e.coeff = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const classeOptions = classes?.map((c) => ({ value: String(c.id), label: c.libelle }));
  const matiereOptions = matieres?.map((m) => ({ value: String(m.id), label: m.nom }));
  const enseignantOptions = enseignants.map((e) => ({
    value: e.enseignant_id,
    label: fullName(e.enseignant),
  }));

  const handleAffecter = async () => {
    if (!validate()) {
      showToast("Veuillez remplir tous les champs correctement.", "error");
      return;
    }
    const doublon = affectations.find(
      (a) =>
        String(a.classeId) === form.classeId &&
        String(a.matiereId) === form.matiereId &&
        a.matricule === form.matricule
    );
    if (doublon) {
      showToast("Cette affectation existe déjà.", "warning");
      return;
    }
    const classeObj = classes.find((c) => String(c.id) === form.classeId);
    const matiereObj = matieres.find((m) => String(m.id) === form.matiereId);
    const enseignantObj = enseignants.find((e) => e.matricule === form.matricule);
    const id = Date.now();
    setAffectations((prev) => [
      {
        id,
        classeId: Number(form.classeId),
        libelleClasse: classeObj?.libelle ?? "",
        matiereId: Number(form.matiereId),
        nomMatiere: matiereObj?.nom ?? "",
        matricule: form.matricule,
        nomEnseignant: enseignantObj ? fullName(enseignantObj) : "",
        enseignant: enseignantObj ?? null,
        coeff: Number(form.coeff),
      },
      ...prev,
    ]);
    try {
      const res = await affectationService.CreateAffectation({
        id_classe: form.classeId,
        id_matiere: form.matiereId,
        id_prof: form.matricule,
        coefficient: form.coeff,
      });
      if (res.data) {
        setNewRowId(id);
        setTimeout(() => setNewRowId(null), 800);
        setForm({ classeId: "", matiereId: "", matricule: "", coeff: "" });
        showToast("Affectation ajoutée avec succès !", "success");
      }
    } catch {
      setErrors({});
    }
    setNewRowId(id);
    setTimeout(() => setNewRowId(null), 800);
    setForm({ classeId: "", matiereId: "", matricule: "", coeff: "" });
    showToast("Affectation ajoutée avec succès !", "success");
  };

  // const handleDelete = (id) => {
  //   setAffectations((prev) => prev.filter((a) => a.id !== id));
  //   showToast("Affectation supprimée.", "warning");
  // };

  const handleSaveEdit = (updated) => {
    const doublon = affectations.find(
      (a) =>
        a.id !== updated.id &&
        String(a.classeId) === String(updated.classeId) &&
        String(a.matiereId) === String(updated.matiereId) &&
        a.matricule === updated.matricule
    );
    if (doublon) {
      showToast("Cette affectation existe déjà dans le tableau.", "warning");
      return;
    }
    setAffectations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditTarget(null);
    showToast("Affectation modifiée avec succès !", "success");
  };

  return (
    <div className="p-4  ml-45 sm:p-6 space-y-5 max-sm:ml-2 max-lg:ml-1">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Gestion des Affectations</h1>
            <p className="text-xs text-slate-400">Associez enseignants, classes et matières</p>
          </div>
        </div>
        <button onClick={()=>{setOpenForm(!openForm)}}>
            <div className="sm:ml-auto flex items-center gap-2 bg-blue-600 border border-slate-200 rounded-xl px-4 py-2 text-sm text-white shadow-sm self-start sm:self-auto">
              {/* <Icon size={14} className={accentIconText} /> */}
              <span>
                Ajouter une affectation
              </span>
            </div>
        </button>
      </div>
      {/* ── Toast ── */}
      <Toast toast={toast} />

      {/* ── Fetch Error ── */}
      {fetchError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-red-50 text-red-700 border-red-200 text-sm">
          <XCircle size={15} /> {fetchError}
        </div>
      )}

      {/* ── MODE ENSEIGNANT ── */}
      {mode === "enseignant" && (
        <>
          {/* Form Card */}
          {
            openForm && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <UserPlus size={14} className="text-blue-600" />
                  </div>
                  <h2 className="font-semibold text-slate-700 text-sm">Nouvelle affectation</h2>
                </div>

                {loading ? (
                  <div className="flex items-center gap-3 py-5 text-slate-400 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    Chargement des données…
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <SelectField label="Classe" icon={BookOpen} value={form.classeId} onChange={(v) => setField("classeId", v)} options={classeOptions} placeholder="Choisir une classe" error={errors.classeId} />
                      <SelectField label="Matière" icon={BookOpen} value={form.matiereId} onChange={(v) => setField("matiereId", v)} options={matiereOptions} placeholder="Choisir une matière" error={errors.matiereId} />
                      <SelectField label="Enseignant" icon={Users} value={form.matricule} onChange={(v) => setField("matricule", v)} options={enseignantOptions} placeholder="Choisir un enseignant" error={errors.matricule} />
                      <CoeffField value={form.coeff} onChange={(v) => setField("coeff", v)} error={errors.coeff} />
                    </div>
                    <button
                      onClick={handleAffecter}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all"
                    >
                      <UserPlus size={14} />
                      Affecter
                    </button>
                  </>
                )}
              </div>
            )
          }

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <ClipboardList size={14} className="text-blue-600" />
              </div>
              <h2 className="font-semibold text-slate-700 text-sm">Affectations existantes</h2>
              <span className="ml-auto inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                <ClipboardList size={11} />
                {affectations.length}
              </span>
            </div>

            {affectations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400 gap-2.5">
                <ClipboardList size={32} strokeWidth={1.2} />
                <p className="text-sm">Aucune affectation enregistrée.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Classe", "Matière", "Enseignant", "Matricule", "Coeff", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {affectations.map((a, idx) => {
                      const isNew = a.id === newRowId;
                      return (
                        <tr
                          key={a.id}
                          className={`border-b border-slate-50 hover:bg-slate-50/70 transition-colors
                            ${isNew ? "animate-fade-in" : ""}
                            ${idx === affectations.length - 1 ? "border-b-0" : ""}`}
                        >
                          {/* Classe */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                              {a.libelleClasse}
                            </span>
                          </td>

                          {/* Matière */}
                          <td className="px-4 py-3 text-slate-700 font-medium text-sm">{a.nomMatiere}</td>

                          {/* Enseignant */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                                {a.enseignant ? getInitials(a.enseignant) : "??"}
                              </div>
                              <span className="text-slate-700 text-sm">{a.nomEnseignant}</span>
                            </div>
                          </td>

                          {/* Matricule */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-mono">
                              {a.matricule}
                            </span>
                          </td>

                          {/* Coeff */}
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold">
                              <Hash size={10} />
                              {a.coeff}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditTarget(a)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500
                                  hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-all text-xs font-medium"
                              >
                                <Pencil size={11} /> Modifier
                              </button>
                              {/* <button
                                onClick={() => handleDelete(a.id)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500
                                  hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-xs font-medium"
                              >
                                <Trash2 size={11} /> Supprimer
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── MODE ÉLÈVE ── */}
      {/* {mode === "eleve" && <EleveView affectations={affectations} />} */}

      {/* ── Edit Modal ── */}
      {editTarget && (
        <EditModal
          affectation={editTarget}
          classes={classes}
          matieres={matieres}
          enseignants={enseignants}
          affectations={affectations}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}