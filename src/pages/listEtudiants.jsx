import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classeService from "../../services/classeService";
import noteService from "../../services/noteService";
import '../styles/listEtudiant.css'
import eleveService from "../../services/eleveService";
import { jwtDecode } from "jwt-decode";
// import absenceService from "../../services/absenceService"; // à créer selon votre architecture

const TYPE_OPTIONS = [
    { value: "interro", label: "Interrogation" },
    { value: "devoir", label: "Devoir" },
    { value: "examen", label: "Examen" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const getRoleFromStorage = () => {
    const token = localStorage.getItem("token")
    const decodeToken = jwtDecode(token)
    const role = decodeToken.user.user.role
    console.log(decodeToken)
    return role
}// "admin" | "professeur"

// ─── Sub-components ─────────────────────────────────────────────────────────
function ModalOverlay({ children }) {
    return (
        <div className="modal-overlay">
            <div className="modal-backdrop" />
            {children}
        </div>
    );
}

function StepBadge({ current, total }) {
    return (
        <span className="step-badge">Étape {current} / {total}</span>
    );
}

function TagPill({ color, children }) {
    return <span className={`tag-pill tag-${color}`}>{children}</span>;
}

function ActionButton({ onClick, variant = "primary", icon, children, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`action-btn action-btn--${variant}`}
        >
            {icon && <span className="btn-icon">{icon}</span>}
            {children}
        </button>
    );
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const IconPen = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L8.75 18.54l-4 1 1-4 11.112-11.053z" />
    </svg>
);
const IconClock = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 7v5l3 3" />
    </svg>
);
const IconClose = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IconArrowRight = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);
const IconArrowLeft = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);
const IconCheck = () => (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const IconCheckSmall = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const IconEmpty = () => (
    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

// ─── Config Step (shared for notes & absences) ───────────────────────────────
function ConfigStep({ mode, config, setConfig, configErrors, onClose, onNext }) {
    const isAbsence = mode === "absence";
    return (
        <div className="modal-card">
            <div className="modal-header">
                <div>
                    <h2 className="modal-title">
                        {isAbsence ? "Configurer les absences" : "Configurer la note"}
                    </h2>
                    <StepBadge current={1} total={2} />
                </div>
                <button className="icon-btn" onClick={onClose}><IconClose /></button>
            </div>

            <div className="modal-body">
                {!isAbsence && (
                    <div className="field-group">
                        <label className="field-label">Type de note</label>
                        <div className="pill-grid col-3">
                            {TYPE_OPTIONS.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setConfig((p) => ({ ...p, type: t.value }))}
                                    className={`pill-btn ${config.type === t.value ? "pill-btn--active" : ""}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        {configErrors.type && <p className="field-error">{configErrors.type}</p>}
                    </div>
                )}
{/* 
                <div className="field-group">
                    <label className="field-label">Trimestre</label>
                    <div className="pill-grid col-3">
                        {TRIMESTRE_OPTIONS.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => setConfig((p) => ({ ...p, trimestre: t.value }))}
                                className={`pill-btn ${config.trimestre === t.value ? "pill-btn--active" : ""}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    {configErrors.trimestre && <p className="field-error">{configErrors.trimestre}</p>}
                </div> */}

                {!isAbsence && (
                    <div className="field-group">
                        <label className="field-label">Coefficient</label>
                        <input
                            type="number" min="1" max="10" placeholder="Ex : 2"
                            value={config.coefficient}
                            onChange={(e) => setConfig((p) => ({ ...p, coefficient: e.target.value }))}
                            className="text-input"
                        />
                        {configErrors.coefficient && <p className="field-error">{configErrors.coefficient}</p>}
                    </div>
                )}

                {!isAbsence && (
                    <div className="field-group">
                        <label className="field-label">Matière concernée</label>
                        <input
                            type="text" placeholder="Ex : Mathématiques"
                            value={config.matiere}
                            disabled
                            onChange={(e) => setConfig((p) => ({ ...p, matiere: e.target.value }))}
                            className="text-input"
                        />
                        {configErrors.matiere && <p className="field-error">{configErrors.matiere}</p>}
                    </div>
                )}
            </div>

            <div className="modal-footer">
                <button className="ghost-btn" onClick={onClose}>Annuler</button>
                <ActionButton onClick={onNext} icon={<IconArrowRight />}>Suivant</ActionButton>
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function StudentTable() {
    const role = getRoleFromStorage(); // "admin" | "professeur"
    const isAdmin = role === "ADMIN";
    const isProfesseur = role === "ENSEIGNANT";
    const [eleves, setEleves] = useState([]);
    const [mode, setMode] = useState(null); // "note" | "absence"
    const [step, setStep] = useState(null); // null | "config" | "saisie"

    const [config, setConfig] = useState({ type: "",coefficient: "", matiere: localStorage.getItem("matiere") ?? "" });
    const [configErrors, setConfigErrors] = useState({});
    const [notes, setNotes] = useState({});
    const [absences, setAbsences] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const getListe = async () => {
            try {
                const res = await classeService.getListApi(id);
                if (res.data) setEleves(res.data.listeEleves);
            } catch (err) {
                console.log('erreur serveur')
            }
        };
        getListe();
    }, [id]);

    // ── Open modals ──
    const openMode = (m) => {
        setMode(m);
        setConfig({ type: "", coefficient: "", matiere: localStorage.getItem("matiere") ?? "" });
        setConfigErrors({});
        setSubmitted(false);
        setStep("config");
    };

    const closeModal = () => { setStep(null); setMode(null); };

    // ── Validation ──
    const validateConfig = () => {
        const errors = {};
        if (mode === "note") {
            if (!config.type) errors.type = "Veuillez choisir un type de note.";
            if (!config.coefficient || isNaN(config.coefficient) || Number(config.coefficient) <= 0)
                errors.coefficient = "Coefficient invalide.";
        }
        setConfigErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const goToSaisie = () => {
        if (!validateConfig()) return;
        if (mode === "note") {
            const init = {};
            eleves.forEach((e) => { init[e.matricule] = notes[e.matricule] ?? ""; });
            setNotes(init);
        } else {
            const init = {};
            eleves.forEach((e) => { init[e.matricule] = absences[e.matricule] ?? {nombre:"", justifiee:"Non"}; });
            setAbsences(init);
        }
        setStep("saisie");
    };

    // ── Input handlers ──
    const handleNoteChange = (matricule, value) => {
        if (value === "" || (Number(value) >= 0 && Number(value) <= 20))
            setNotes((p) => ({ ...p, [matricule]: value }));
    };

    const handleAbsenceChange = (matricule, value) => {
        if (value === "" || (Number(value) > 0 && Number.isInteger(Number(value))))
            setAbsences((p) => ({ ...p, [matricule]: {...p[matricule], nombre:value} }));
    }
    const handleJustifieChange = (matricule, value) => {
    setAbsences((p) => ({
        ...p,
        [matricule]: {
            ...p[matricule],
            justifiee: value
        }
    }))
    }
    // ── Submit ──
    const handleSubmit = async () => {
        const data = mode === "note" ? notes : absences;
        const allFilled = eleves.every((e) => data[e.matricule] !== "" && data[e.matricule] !== undefined);
        if (!allFilled) {
            alert(mode === "note"
                ? "Veuillez renseigner la note de chaque élève."
                : "Veuillez renseigner les heures d'absence de chaque élève.");
            return;
        }
        try {
            if (mode === "note") {
                const notesArray = eleves.map((e) => ({ matricule: e.matricule, note: Number(notes[e.matricule]) }));
                const res = await noteService.postNote({ config, notes: notesArray });
                // if (res.data) localStorage.removeItem("matiere");
            } else {
                const absArray = eleves.map((e) => ({ matricule: e.matricule, nombre: Number(absences[e.matricule].nombre), justifiee: absences[e.matricule].justifiee }));
                await eleveService.postAbsence({ config, absences: absArray }); // adapter selon votre service
            }
            setSubmitted(true);
            setTimeout(() => closeModal(), 2000);
        } catch (err) {
            console.log('erreur serveur')
        }
    };

    const typeLabel = TYPE_OPTIONS.find((t) => t.value === config.type)?.label ?? "";
    if(!eleves.length){
        return (
            <div className="flex items-center justify-center">
                auncun eleve inscris dans cette classe
            </div>
        )
    }
    return (
        <>
            <div className="st-root">
                {/* Header */}
                <div className="st-header">
                    <span className="st-eyebrow">Gestion Académique</span>
                    <h1 className="st-title">
                        Liste des <em>Étudiants</em>
                        <span className="count-badge">{eleves.length}</span>
                    </h1>
                    <p className="st-sub">Consultez et gérez les informations des étudiants</p>

                    {/* Role indicator */}
                    <div>
                        <span className={`role-badge ${isAdmin ? "role-badge--admin" : "role-badge--prof"}`}>
                            <span className="role-dot" />
                            {isAdmin ? "Administrateur" : "Professeur"}
                        </span>
                    </div>

                    {/* CTA row — conditionnel selon le rôle */}
                    <div className="cta-row">
                        {isProfesseur && (
                            <button className="action-btn action-btn--primary" onClick={() => openMode("note")}>
                                <span className="btn-icon"><IconPen /></span>
                                Saisir les notes
                            </button>
                        )}
                        {isAdmin && (
                            <button className="action-btn action-btn--amber" onClick={() => openMode("absence")}>
                                <span className="btn-icon"><IconClock /></span>
                                Saisir les absences
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="table-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Matricule</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eleves.length === 0 ? (
                                <tr>
                                    <td colSpan={3}>
                                        <div className="empty-state">
                                            <IconEmpty />
                                            <p>Aucun étudiant trouvé</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                eleves.map((s, i) => (
                                    <tr key={i}>
                                        <td><span className="mono-tag">{s.matricule}</span></td>
                                        <td className="name-cell">{s.nom}</td>
                                        <td>{s.prenom}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODALS ── */}
            {step && (
                <ModalOverlay>
                    {/* Étape 1 : Config */}
                    {step === "config" && (
                        <ConfigStep
                            mode={mode}
                            config={config}
                            setConfig={setConfig}
                            configErrors={configErrors}
                            onClose={closeModal}
                            onNext={goToSaisie}
                        />
                    )}

                    {/* Étape 2 : Saisie */}
                    {step === "saisie" && (
                        <div className={`modal-card ${mode === "absence" ? "modal-card--wide" : "modal-card--wide"}`}>
                            <div className="modal-header">
                                <div>
                                    <h2 className="modal-title">
                                        {mode === "note" ? "Saisie des notes" : "Saisie des absences"}
                                    </h2>
                                    <div className="tags-row">
                                        {mode === "note" && <TagPill color="indigo">{typeLabel}</TagPill>}
                                        {mode === "note" && <TagPill color="amber">Coeff. {config.coefficient}</TagPill>}
                                        {mode === "note" && <TagPill color="amber">{config.matiere}</TagPill>}
                                        {mode === "absence" && <TagPill color="rose">{config.matiere}</TagPill>}
                                    </div>
                                </div>
                                <button className="icon-btn" onClick={closeModal}><IconClose /></button>
                            </div>

                            <div className="modal-body modal-body--scroll" style={{ padding: "0" }}>
                                {submitted ? (
                                    <div className="success-state">
                                        <div className="success-icon success-icon--green"><IconCheck /></div>
                                        <p className="success-text">
                                            {mode === "note" ? "Notes enregistrées avec succès !" : "Absences enregistrées avec succès !"}
                                        </p>
                                    </div>
                                ) : (
                                    <table className="saisie-table">
                                        <thead>
                                            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                                                <th style={{ textAlign: "left", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8" }}>Matricule</th>
                                                <th style={{ textAlign: "left", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8" }}>Nom & Prénom</th>
                                                <th style={{ textAlign: "center", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8" }}>
                                                    {mode === "note" ? "Note /20" : "Heures abs."}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {eleves.map((s, i) => (
                                                <tr key={i} style={{ borderBottom: "1px solid #F8FAFC" }}>
                                                    <td><span className="mono-tag">{s.matricule}</span></td>
                                                    <td style={{ fontWeight: 600, color: "#1E293B" }}>{s.nom} {s.prenom}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        {mode === "note" ? (
                                                            <input
                                                                type="number" min="0" max="20" step="0.25" placeholder="—"
                                                                value={notes[s.matricule] ?? ""}
                                                                onChange={(e) => handleNoteChange(s.matricule, e.target.value)}
                                                                className="note-input"
                                                            />
                                                        ) : (
                                                            <td style={{ textAlign: "center", display: "flex", gap: "8px", justifyContent: "center" }}>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    step="1"
                                                                    placeholder="1"
                                                                    value={absences[s.matricule]?.nombre ?? ""}
                                                                    onChange={(e) => handleAbsenceChange(s.matricule, e.target.value)}
                                                                    className="absence-input"
                                                                    style={{ width: "70px" }}
                                                                />

                                                                <select
                                                                    value={absences[s.matricule]?.justifie ?? "non"}
                                                                    onChange={(e) => handleJustifieChange(s.matricule, e.target.value)}
                                                                    className="absence-select"
                                                                >
                                                                    <option value="oui">Oui</option>
                                                                    <option value="non">Non</option>
                                                                </select>
                                                            </td>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {!submitted && (
                                <div className="modal-footer modal-footer--space">
                                    <button className="back-btn" onClick={() => setStep("config")}>
                                        <IconArrowLeft /> Retour
                                    </button>
                                    <div style={{ display: "flex", gap: "0.75rem" }}>
                                        <button className="ghost-btn" onClick={closeModal}>Annuler</button>
                                        <button
                                            className={`action-btn ${mode === "note" ? "action-btn--primary" : "action-btn--amber"}`}
                                            onClick={handleSubmit}
                                        >
                                            <span className="btn-icon"><IconCheckSmall /></span>
                                            Enregistrer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ModalOverlay>
            )}
        </>
    );
}
