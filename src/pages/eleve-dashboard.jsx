import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eleveService from "../../services/eleveService";
import noteService from "../../services/noteService";
import HeaderEleve from "../components/HeaderEleve";
import StatsCards from "../components/StatsCards";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getAppreciation = (moy) => {
    if (moy >= 16) return "Excellent";
    if (moy >= 14) return "Très bien";
    if (moy >= 12) return "Bien";
    if (moy >= 10) return "Assez bien";
    if (moy >= 8)  return "Insuffisant";
    return "Très insuffisant";
};

// ─── ResumeParMatiere ────────────────────────────────────────────────────────

function ResumeParMatiere({ matiereMoyenne }) {
    return (
        <div className="bg-white border border-[#dce8f9] rounded-2xl overflow-hidden flex flex-col max-h-120">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#eef4fc] flex items-center justify-between shrink-0">
                <div>
                    <p className="text-[15px] font-semibold text-[#0c2c5a] m-0">Résumé par matière</p>
                    <p className="text-[12px] text-[#6c8db5] mt-0.5 mb-0">Vue d'ensemble de toutes les matières</p>
                </div>
                <span className="bg-[#e6f1fb] text-[#185fa5] text-[11px] font-semibold px-3 py-1 rounded-full">
                    {matiereMoyenne.length} matières
                </span>
            </div>

            {/* Scrollable table */}
            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#85b7eb] scrollbar-track-[#f0f6ff]">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr>
                            {["Matière", "Moyenne", "Coefficient", "Appréciation"].map((h) => (
                                <th
                                    key={h}
                                    className="text-left px-3.5 py-2.5 text-[#6c8db5] text-[10px] uppercase tracking-widest font-semibold bg-[#f7faff] sticky top-0 z-10"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matiereMoyenne.map((m, i) => {
                            const isGood = m.moyenne >= 10;
                            const isLast = i === matiereMoyenne.length - 1;
                            return (
                                <tr
                                    key={i}
                                    className="hover:bg-[#f7faff] transition-colors"
                                >
                                    <td className={`px-3.5 py-2.75 text-[#1a3557] font-medium ${!isLast ? "border-b border-[#eef4fc]" : ""}`}>
                                        {m.matiere}
                                    </td>
                                    <td className={`px-3.5 py-2.75 text-[#1a3557] ${!isLast ? "border-b border-[#eef4fc]" : ""}`}>
                                        <span className={`font-bold text-[15px] ${isGood ? "text-[#0d6b43]" : "text-[#b91c1c]"}`}>
                                            {isGood ? "▲" : "▼"} {Number(m.moyenne).toFixed(1)}
                                        </span>
                                    </td>
                                    <td className={`px-3.5 py-2.75 text-[#1a3557] ${!isLast ? "border-b border-[#eef4fc]" : ""}`}>
                                        <span className="bg-[#e6f1fb] text-[#185fa5] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                            ×{m.coefficient}
                                        </span>
                                    </td>
                                    <td className={`px-3.5 py-2.75 text-[#1a3557] ${!isLast ? "border-b border-[#eef4fc]" : ""}`}>
                                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                                            isGood
                                                ? "bg-[#e8f7f0] text-[#0d6b43]"
                                                : "bg-[#fcebeb] text-[#791f1f]"
                                        }`}>
                                            {getAppreciation(m.moyenne)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {matiereMoyenne.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-[#6c8db5] text-[13px]">
                                    Aucune matière enregistrée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── NotesRecentes ───────────────────────────────────────────────────────────

function NotesRecentes() {
    const navigate = useNavigate();
    const [notesRecentes, setNotesRecentes] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }
        const token_decoded = jwtDecode(token);
        const getNotes = async () => {
            try {
                // console.log("matricule",token_decoded.profil.matricule)
                const res = await noteService.getNoteByMatricule(token_decoded.profil.matricule);
                if (res.data) setNotesRecentes(res.data.notes);
            } catch {
                console.error("Erreur lors du chargement des notes");
            }
        };
        getNotes();
    }, []);
    const notesAffichees = [...notesRecentes].reverse();
    return (
        <div className="bg-white border border-[#dce8f9] rounded-2xl overflow-hidden flex flex-col max-h-120">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#eef4fc] flex items-center justify-between shrink-0">
                <div>
                    <p className="text-[15px] font-semibold text-[#0c2c5a] m-0">Notes récentes</p>
                    <p className="text-[12px] text-[#6c8db5] mt-0.5 mb-0">Dernières évaluations enregistrées</p>
                </div>
                <span className="bg-[#e6f1fb] text-[#185fa5] text-[11px] font-semibold px-3 py-1 rounded-full">
                    {notesRecentes.length} notes
                </span>
            </div>

            {/* Scrollable table */}
            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#85b7eb] scrollbar-track-[#f0f6ff]">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr>
                            {["Matière", "Type", "Note", "Coef."].map((h) => (
                                <th
                                    key={h}
                                    className="text-left px-3.5 py-2.5 text-[#6c8db5] text-[10px] uppercase tracking-widest font-semibold bg-[#f7faff] sticky top-0 z-10"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {notesAffichees.map((n, i) => {
                            const isGood = n.valeur >= 10;
                            const isLast = i === notesAffichees.length - 1;
                            return (
                                <tr key={i} className="hover:bg-[#f7faff] transition-colors">
                                    <td className={`px-3.5 py-2.75 text-[#1a3557] font-medium ${!isLast ? "border-b border-[#eef4fc]" : ""}`}>
                                        {n.matiere}
                                    </td>
                                    <td className={`px-3.5 py-2.75 text-[#6c8db5] ${!isLast ? "border-b border-[#eef4fc]" : ""}`}>
                                        {n.type}
                                    </td>
                                    <td className={`px-3.5 py-2.75 text-[#1a3557] ${!isLast ? "border-b border-[#eef4fc]" : ""}`}>
                                        <span className={`font-bold text-[16px] ${isGood ? "text-[#0d6b43]" : "text-[#b91c1c]"}`}>
                                            {n.valeur}
                                            <span className="text-[#93b4d4] text-[12px] font-normal">/20</span>
                                        </span>
                                    </td>
                                    <td className={`px-3.5 py-2.75 text-[#1a3557] ${!isLast ? "border-b border-[#eef4fc]" : ""}`}>
                                        <span className="bg-[#e6f1fb] text-[#185fa5] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                            ×{n.coefficient}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {notesAffichees.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-[#6c8db5] text-[13px]">
                                    Aucune note enregistrée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── DashboardEleve ──────────────────────────────────────────────────────────

export default function DashboardEleve() {
    const [loggedOut, setLoggedOut] = useState(false);
    const [matiereMoyenne, setMatiereMoyenne] = useState([]);
    const [eleve, setEleve] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    const decode = jwtDecode(token);
    const matricule = decode.profil.matricule;

    useEffect(() => {
        eleveService.getEleve(matricule)
            .then(res => { if (res.data) setEleve(res.data.eleveInformation); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        eleveService.getMoyenneMat(matricule)
            .then(res => { if (res.data) setMatiereMoyenne(res.data.moyenne); })
            .catch(() => {});
    }, []);

    if (loggedOut) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0f6ff]">
                <div className="text-center px-12 py-10 bg-white rounded-2xl border border-[#dce8f9]">
                    <div className="text-5xl mb-3">👋</div>
                    <h2 className="text-[22px] font-semibold text-[#0c2c5a] mb-2">
                        À bientôt, {eleve?.eleve?.prenom} !
                    </h2>
                    <p className="text-[#6c8db5] text-[14px] mb-6">
                        Vous avez été déconnecté avec succès.
                    </p>
                    <button
                        onClick={() => setLoggedOut(false)}
                        className="px-7 py-2.5 rounded-xl bg-[#1e88e5] text-white font-semibold text-[14px] border-none cursor-pointer hover:bg-[#1565c0] transition-colors"
                    >
                        Se reconnecter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen p-6 bg-[#f0f6ff] box-border"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
        >
            <div className="max-w-6xl mx-auto">
                <HeaderEleve eleve={eleve} onLogout={() => setLoggedOut(true)} />
                <StatsCards matiereMoyenne={matiereMoyenne} eleve={eleve} />

                <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
                    <ResumeParMatiere matiereMoyenne={matiereMoyenne} />
                    <NotesRecentes />
                </div>

                <p className="text-center text-[#93b4d4] text-[11px] mt-6">
                    Dashboard Élève © 2025 — {eleve?.eleve?.prenom} {eleve?.eleve?.nom} · {eleve?.classe?.libelle}
                </p>
            </div>
        </div>
    );
}