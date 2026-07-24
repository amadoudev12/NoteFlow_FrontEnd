import { useState, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";

import eleveServices from "../../services/eleveService";
import enseignantService from "../../services/enseignantService";
import classeServices from "../../services/classeService";

import useToast from "../hooks/UseToast";
import ToastContainer from "../components/Admin/ToastContainner";
import ModeToggle from "../components/Admin/ModeToggle";
import Steps from "../components/Admin/Steps";
import ClassSelect from "../components/Admin/ClasseSelect";
import DropZone from "../components/Admin/DropZone";
import ColumnLegend from "../components/Admin/ColumLegend";
import PreviewTable from "../components/Admin/PreviewTable";
import MODES from "../utils/Mode";

// ─── API ──────────────────────────────────────────────────────
const api = {
  getAllClasse: () => classeServices.getAllClasse(),
  postEleves: (data) => eleveServices.postEleves(data),
  postEnseignants: (data) => enseignantService.postEnseignants(data),
};

// ─── Spinner ──────────────────────────────────────────────────
function Spinner({ size = 14 }) {
  return (
    <span
      className="inline-block rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function ImportPage() {
  const [mode, setMode] = useState("eleve");
  const [selClass, setSelClass] = useState("");
  const [classList, setCList] = useState([]);
  const [loadingCls, setLCls] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [importing, setImp] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toasts, add: toast, remove } = useToast();
  const cfg = MODES[mode];

  // Reset state on mode change
  useEffect(() => {
    setFile(null);
    setPreview(null);
    setSelClass("");
    setErrors({});
    setProgress(0);
  }, [mode]);

  // Load classes when mode requires it
  useEffect(() => {
    if (!cfg.needsClass) return;
    setLCls(true);
    api
      .getAllClasse()
      .then((res) => {
        const d = res.data?.classes || res.data || [];
        setCList(Array.isArray(d) ? d : []);
      })
      .catch(() => {
        toast("Impossible de charger les classes.", "error");
        setCList([]);
      })
      .finally(() => setLCls(false));
  }, [mode]);

  // Handle file selection and parsing
  const handleFile = useCallback(
    async (f, fileErr) => {
      if (fileErr) {
        setErrors((p) => ({ ...p, file: fileErr }));
        setFile(null);
        setPreview(null);
        return;
      }

      setErrors((p) => ({ ...p, file: null }));
      setFile(f);
      setPreview(null);

      try {
        const buf = await f.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!json.length) {
          setErrors((p) => ({ ...p, file: "Le fichier est vide." }));
          return;
        }

        const cols = Object.keys(json[0]).map((c) => c.toLowerCase());
        const missing = cfg.columns.filter(
          (c) => c.required && !cols.includes(c.key.toLowerCase())
        );

        if (missing.length) {
          setErrors((p) => ({
            ...p,
            file: `Colonnes obligatoires manquantes : ${missing.map((c) => c.key).join(", ")}`,
          }));
          setPreview(null);
          return;
        }

        setPreview(json);
      } catch {
        setErrors((p) => ({ ...p, file: "Lecture du fichier impossible." }));
      }
    },
    [cfg]
  );

  // Handle import submission
  const handleSubmit = async () => {
    const errs = {};
    if (cfg.needsClass && !selClass) errs.class = "Sélectionnez une classe.";
    if (!file) errs.file = "Choisissez un fichier Excel.";
    if (!preview && !errs.file) errs.file = "Le fichier n'a pas pu être analysé.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (cfg.needsClass) formData.append("classe", selClass);

    setImp(true);
    setProgress(0);
    const iv = setInterval(() => setProgress((p) => Math.min(p + 7, 88)), 200);

    try {
      const fn = mode === "eleve" ? api.postEleves : api.postEnseignants;
      const res = await fn(formData);
      clearInterval(iv);
      setProgress(100);
      setTimeout(() => {
        setImp(false);
        setProgress(0);
        toast(res.data?.message || "Import réussi ", "success");
        setFile(null);
        setPreview(null);
        setSelClass("");
        setErrors({});
      }, 350);
    } catch (err) {
      clearInterval(iv);
      setImp(false);
      setProgress(0);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Erreur serveur lors de l'import.";
      toast(typeof msg === "string" ? msg : "Erreur serveur.", "error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setSelClass("");
    setErrors({});
    setProgress(0);
  };

  const stepLabels = cfg.needsClass
    ? ["Classe", "Fichier", "Aperçu"]
    : ["Fichier", "Aperçu"];

  const stepDone = cfg.needsClass
    ? [!!selClass, !!file && !errors.file, !!preview]
    : [!!file && !errors.file, !!preview];

  return (
    <div className="ml-45 max-sm:ml-2">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
            style={{ background: cfg.accent }}
          >
            📤
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">{cfg.title}</h1>
            <p className="text-xs text-slate-400">{cfg.subtitle}</p>
          </div>
        </div>
        <ModeToggle mode={mode} onSwitch={setMode} />
      </div>

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} remove={remove} />

      {/* ── Steps ── */}
      <Steps labels={stepLabels} done={stepDone} accent={cfg.accent} />

      {/* ── Main card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base"
              style={{ background: cfg.accent }}
            >
              📋
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">{cfg.cardTitle}</h2>
              <p className="text-xs text-slate-400">.xlsx · .xls</p>
            </div>
          </div>
          {preview && (
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{
                background: cfg.accentLight,
                color: cfg.accent,
                border: `1px solid ${cfg.accentBorder}`,
              }}
            >
              {preview.length} ligne{preview.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {importing && (
          <div className="h-0.5 bg-slate-100 overflow-hidden">
            <div
              className="h-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%`, background: cfg.accent }}
            />
          </div>
        )}

        {/* Card body */}
        <div className="p-5 flex flex-col gap-4">
          {cfg.needsClass && (
            <ClassSelect
              value={selClass}
              onChange={(v) => {
                setSelClass(v);
                setErrors((p) => ({ ...p, class: null }));
              }}
              classes={classList}
              loadingClasses={loadingCls}
              error={errors.class}
              accent={cfg.accent}
            />
          )}
          <DropZone
            file={file}
            onFile={handleFile}
            error={errors.file}
            accent={cfg.accent}
            accentLight={cfg.accentLight}
            accentBorder={cfg.accentBorder}
          />
          <ColumnLegend
            columns={cfg.columns}
            accent={cfg.accent}
            accentLight={cfg.accentLight}
            accentBorder={cfg.accentBorder}
          />
        </div>

        {/* Card footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleReset}
            disabled={importing}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-medium
              hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleSubmit}
            disabled={importing}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold
              transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: importing ? `${cfg.accent}88` : cfg.accent }}
          >
            {importing ? (
              <>
                <Spinner size={13} /> Envoi en cours…
              </>
            ) : (
              <>📥 Importer les {cfg.importLabel}</>
            )}
          </button>
        </div>
      </div>

      {/* ── Preview ── */}
      {preview && <PreviewTable data={preview} mode={mode} />}
    </div>
  );
}