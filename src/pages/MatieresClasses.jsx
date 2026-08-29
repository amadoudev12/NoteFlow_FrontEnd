import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  School,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import matiereService from "../../services/matiere.service";
import classeService from "../../services/classeService";

// ─── Config par type ──────────────────────────────────────────────────────────

const CONFIG = {
  matieres: {
    label: "Matière",
    labelPlural: "Matières",
    placeholder: "Nom de la matière (ex : Mathématiques)",
    icon: BookOpen,
    color: "indigo",
    getAll: () => matiereService.getMatieres(),
    create: (data) => matiereService.postMatier(data),
    update: (id, data) => matiereService.modMatiere(id, data),
    delete: (id) => matiereService.delMatiere(id),
    responseKey: "matieres",
    nameKey:"nom"
  },
  classes: {
    label: "Classe",
    labelPlural: "Classes",
    placeholder: "Nom de la classe (ex : Terminale A)",
    icon: GraduationCap,
    color: "violet",
    getAll: () => classeService.getAllClasse(),
    create: (data) => classeService.postClasses(data),
    update: (id, data) => classeService.modClasse(id, data),
    delete: (id) => classeService.delClasse(id),
    responseKey: "classes",
    createResponseKey: "classe",
    nameKey:"libelle"
  },
};

// const ETABLISSEMENT = { id: 1, nom: "Lycée Moderne de Cocody" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const normalize = (str) => str.trim().toLowerCase().replace(/\s+/g, " ");

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toast }) {
  if (!toast) return null;
  const config = {
    success: { icon: <CheckCircle size={15} />, cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    warning: { icon: <AlertTriangle size={15} />, cls: "bg-amber-50 text-amber-800 border-amber-200" },
    error: { icon: <XCircle size={15} />, cls: "bg-red-50 text-red-800 border-red-200" },
  };
  const { icon, cls } = config[toast.type] || config.error;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium animate-pulse-once ${cls}`}>
      {icon}
      {toast.msg}
    </div>
  );
}

//Confirm Delete Modal

function ConfirmModal({ item, label, onCancel, onConfirm }) {
    return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Confirmer la suppression</h3>
            <p className="text-sm text-slate-500 mb-6">
                Voulez-vous vraiment supprimer {label.toLowerCase()}{" "}
                <span className="font-semibold text-slate-700">&laquo; {item.nom} &raquo;</span> ?
                Cette action entrainera aussi la suppression de l'affectation . 
            </p>
            <div className="flex gap-3">
                <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                    border border-slate-200 text-slate-600 text-sm font-medium
                    hover:bg-slate-50 transition-all duration-150"
                >
                <X size={14} /> Annuler
                </button>
                <button
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                    bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold
                    transition-all duration-150 shadow-sm shadow-red-200"
                >
                <Trash2 size={14} /> Supprimer
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

// function EditModal({ item, allItems, label, accentClass, onClose, onSave }) {
//     const [nom, setNom] = useState(item[cfg.nameKey])
//     const [error, setError] = useState("");

//     const handleSave = () => {
//         const trimmed = nom.trim();
//         if (!trimmed) { setError("Le nom est obligatoire."); return; }
//         const doublon = allItems.find(
//         (m) => m.id !== item.id && normalize(m.nom) === normalize(trimmed)
//         );
//         if (doublon) { setError(`Ce${label === "Classe" ? "tte" : "tte"} ${label.toLowerCase()} existe déjà.`); return; }
//         onSave({ ...item, nom: trimmed });
//     };

//     return (
//         <div
//         className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
//         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//         >
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//             <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
//                 <Pencil size={15} className="text-amber-600" />
//                 </div>
//                 <div>
//                 <h3 className="font-semibold text-slate-800 text-base">Modifier {label.toLowerCase()}</h3>
//                 <p className="text-xs text-slate-400">ID #{item.id}</p>
//                 </div>
//             </div>
//             <button
//                 onClick={onClose}
//                 className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400
//                 hover:bg-slate-100 hover:text-slate-600 transition-all duration-150"
//             >
//                 <X size={16} />
//             </button>
//             </div>

//             <div className="px-6 py-5">
//             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
//                 Nom {label.toLowerCase()}
//             </label>
//             <input
//                 autoFocus
//                 type="text"
//                 value={nom}
//                 onChange={(e) => { setNom(e.target.value); setError(""); }}
//                 onKeyDown={(e) => e.key === "Enter" && handleSave()}
//                 placeholder={`Ex : ${label === "Matière" ? "Mathématiques" : "Terminale A"}`}
//                 className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white text-slate-800
//                 transition-all duration-150 outline-none
//                 ${error
//                     ? "border-red-400 ring-2 ring-red-100"
//                     : `border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100`
//                 }`}
//             />
//             {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
//             </div>

//             <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
//             <button
//                 onClick={onClose}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600
//                 hover:bg-white hover:border-slate-300 transition-all duration-150 text-sm font-medium"
//             >
//                 <X size={13} /> Annuler
//             </button>
//             <button
//                 onClick={handleSave}
//                 className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600
//                 active:scale-95 text-white text-sm font-semibold transition-all duration-150 shadow-sm shadow-amber-200"
//             >
//                 <Save size={13} /> Enregistrer
//             </button>
//             </div>
//         </div>
//         </div>
// );
// }
function EditModal({
  item,
  allItems,
  label,
  nameKey,
  onClose,
  onSave,
}) {
  const [nom, setNom] = useState(item[nameKey] || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    const trimmed = nom.trim();

    if (!trimmed) {
      setError("Le nom est obligatoire.");
      return;
    }

    const doublon = allItems.find(
      (m) =>
        m.id !== item.id &&
        normalize(m[nameKey] || "") === normalize(trimmed)
    );

    if (doublon) {
      setError(
        `Cette ${label.toLowerCase()} existe déjà.`
      );
      return;
    }

    onSave({
      ...item,
      [nameKey]: trimmed,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Pencil size={15} className="text-amber-600" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 text-base">
                Modifier {label.toLowerCase()}
              </h3>

              <p className="text-xs text-slate-400">
                ID #{item.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-150"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
            Nom {label.toLowerCase()}
          </label>

          <input
            autoFocus
            type="text"
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            placeholder={
              label === "Matière"
                ? "Ex : Mathématiques"
                : "Ex : Terminale A"
            }
            className={`w-full px-3 py-2.5 text-sm rounded-xl border bg-white text-slate-800 transition-all duration-150 outline-none ${
              error
                ? "border-red-400 ring-2 ring-red-100"
                : "border-slate-200 hover:border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            }`}
          />

          {error && (
            <p className="text-xs text-red-500 mt-1.5">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 transition-all duration-150 text-sm font-medium"
          >
            <X size={13} />
            Annuler
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-semibold transition-all duration-150 shadow-sm shadow-amber-200"
          >
            <Save size={13} />
            Enregistrer
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MatieresClassesPage() {
  const location = useLocation();

  // Détecte le type selon l'URL
  const type = location.pathname.includes("/classes") ? "classes" : "matieres";
  const cfg = CONFIG[type];
  const Icon = cfg.icon;

  const [openForm, setOpenForm] = useState(false)
  const [items, setItems] = useState([]);
  const [newNom, setNewNom] = useState("");
  const [addError, setAddError] = useState("");
  const [toast, setToast] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset state quand l'URL change
  useEffect(() => {
    setItems([]);
    setNewNom("");
    setAddError("");
    setSearch("");
    setEditTarget(null);
    setDeleteTarget(null);
  }, [type]);

  // Charger les données
useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await cfg.getAll();
            if (res.data) {
                setItems(res.data[cfg.responseKey] || []);
            }
        } catch (err) {
            console.log('erreur serveur')
            showToast("Erreur lors du chargement des données.", "error");
        } finally {
            setLoading(false);
        }
        };
    fetchData();
}, [type]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Ajouter ──
  const handleAjouter = async () => {
    const trimmed = newNom.trim();
    if (!trimmed) { setAddError("Le nom est obligatoire."); return; }
    const doublon = items.find((m) => normalize(m[cfg.nameKey]??"") === normalize(trimmed));
    if (doublon) { setAddError(`Cette ${cfg.label.toLowerCase()} existe déjà.`); return; }

    try {
    const res = await cfg.create({ nom: trimmed });
    if (res.data) {
        const newItem = res.data[cfg.createResponseKey || cfg.responseKey.slice(0, -1)] || res.data
        setItems((prev) => [...prev, newItem]);
        setNewNom("");
        setAddError("");
        showToast(`${cfg.label} « ${trimmed} » ajoutée avec succès !`, "success");
      }
    } catch (err) {
      console.log('erreur serveur')
      showToast("Erreur lors de l'ajout.", "error");
    }
  };

  // ── Modifier ──
  const handleSaveEdit = async (updated) => {
    try {
      const res = await cfg.update(updated.id, { [cfg.nameKey]: updated[cfg.nameKey] });
      if (res.data) {
        setItems((prev) => prev.map((m) => (m.id === updated.id ? { ...m, nom: updated.nom } : m)));
        setEditTarget(null);
        showToast(`${cfg.label} modifiée en « ${updated.nom} » avec succès !`, "success");
      }
    } catch (err) {
      console.log('erreur serveur')
      showToast("Erreur lors de la modification.", "error");
    }
  };

  // ── Supprimer ──
  const handleConfirmDelete = async () => {
    const nom = deleteTarget.nom ? deleteTarget.nom  : deleteTarget.libelle ;
    try {
      await cfg.delete(deleteTarget.id);
      setItems((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`${cfg.label} « ${nom} » supprimée.`, "warning");
    } catch (err) {
      console.log('erreur serveur')
      showToast("Erreur lors de la suppression.", "error");
      setDeleteTarget(null);
    }
  };

  // ── Filtrage ──
  const filtered = items.filter((m) =>
    normalize(m[cfg.nameKey] ?? "").includes(normalize(search))
  );

  // ── Couleurs dynamiques selon type ──
  const accent = type === "classes" ? "violet" : "indigo";
  const accentBg = type === "classes" ? "bg-violet-600" : "bg-indigo-600";
  const accentHover = type === "classes" ? "hover:bg-violet-700" : "hover:bg-indigo-700";
  const accentShadow = type === "classes" ? "shadow-violet-200" : "shadow-indigo-200";
  const accentIconBg = type === "classes" ? "bg-violet-50" : "bg-indigo-50";
  const accentIconText = type === "classes" ? "text-violet-600" : "text-indigo-600";
  const accentFocus = type === "classes"
    ? "focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
    : "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl ${accentBg} flex items-center justify-center shadow-md ${accentShadow} shrink-0`}>
              <Icon size={21} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Gestion des {cfg.labelPlural}
              </h1>
              {/* <div className="flex items-center gap-1.5 mt-0.5">
                <School size={12} className="text-slate-400" />
                <p className="text-xs text-slate-500">{ETABLISSEMENT.nom}</p>
              </div> */}
            </div>
          </div>
          <div className="sm:ml-auto flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm self-start sm:self-auto">
            <Icon size={14} className={accentIconText} />
            <span>
              <strong className="text-slate-800">{items.length}</strong>{" "}
              {items.length !== 1 ? cfg.labelPlural.toLowerCase() : cfg.label.toLowerCase()}
            </span>
          </div>
          <button onClick={()=>{setOpenForm(!openForm)}}>
            <div className="sm:ml-auto flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm self-start sm:self-auto">
              {/* <Icon size={14} className={accentIconText} /> */}
              <span>
                Ajouter
              </span>
            </div>
          </button>
        </div>

        {/* ── Toast ── */}
        {toast && <Toast toast={toast} />}

        {/* ── Add Form Card ── */}
        {
          openForm && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-xl ${accentIconBg} flex items-center justify-center`}>
                  <Plus size={16} className={accentIconText} />
                </div>
                <h2 className="font-semibold text-slate-700 text-base">
                  Ajouter {type === "classes" ? "une classe" : "une matière"}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={newNom}
                      onChange={(e) => { setNewNom(e.target.value); setAddError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleAjouter()}
                      placeholder={cfg.placeholder}
                      className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border bg-white text-slate-800
                        transition-all duration-150 outline-none
                        ${addError
                          ? "border-red-400 ring-2 ring-red-100"
                          : `border-slate-200 hover:border-slate-300 ${accentFocus}`
                        }`}
                    />
                  </div>
                  {addError && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <XCircle size={11} /> {addError}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAjouter}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 ${accentBg} ${accentHover}
                    active:scale-95 text-white text-sm font-semibold rounded-xl transition-all duration-150
                    shadow-sm ${accentShadow} whitespace-nowrap`}
                >
                  <Plus size={15} />
                  Ajouter
                </button>
              </div>
            </div>
          )
        }

        {/* ── List Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Card header + search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Icon size={15} className="text-emerald-600" />
              </div>
              <h2 className="font-semibold text-slate-700 text-base">
                Liste des {cfg.labelPlural.toLowerCase()}
              </h2>
            </div>
            <div className="sm:ml-auto relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className={`pl-8 pr-4 py-2 text-sm rounded-xl border border-slate-200
                  hover:border-slate-300 ${accentFocus}
                  outline-none transition-all duration-150 bg-white text-slate-700 w-full sm:w-48`}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
              <p className="text-sm">Chargement...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Icon size={36} strokeWidth={1.2} />
              <p className="text-sm">
                {search
                  ? `Aucun résultat pour « ${search} »`
                  : `Aucune ${cfg.label.toLowerCase()} enregistrée pour le moment.`}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {filtered.map((m, idx) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-4 px-6 py-3.5
                    hover:bg-slate-50 transition-colors duration-150 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 rounded-lg bg-slate-100 text-slate-400 text-xs font-semibold
                      flex items-center justify-center shrink-0 group-hover:${accentIconBg} group-hover:${accentIconText} transition-colors duration-150`}>
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 font-medium text-sm truncate">{m[cfg.nameKey]}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditTarget(m)}
                      title="Modifier"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent
                        text-slate-400 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600
                        transition-all duration-150 text-xs font-medium"
                    >
                      <Pencil size={12} />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(m)}
                      title="Supprimer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-transparent
                        text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600
                        transition-all duration-150 text-xs font-medium"
                    >
                      <Trash2 size={12} />
                      <span className="hidden sm:inline">Supprimer</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {filtered.length > 0 && !loading && (
            <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400">
                {search
                  ? `${filtered.length} résultat${filtered.length > 1 ? "s" : ""} sur ${items.length} ${items.length > 1 ? cfg.labelPlural.toLowerCase() : cfg.label.toLowerCase()}`
                  : `${items.length} ${items.length > 1 ? cfg.labelPlural.toLowerCase() : cfg.label.toLowerCase()} au total`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editTarget && (
        <EditModal
          item={editTarget}
          allItems={items}
          label={cfg.label}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* ── Confirm Delete Modal ── */}
      {deleteTarget && (
        <ConfirmModal
          item={deleteTarget}
          label={cfg.label}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}