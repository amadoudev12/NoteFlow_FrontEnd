import { jwtDecode } from "jwt-decode";
import {
    X,
    LogOut,
    ChevronRight,
    LayoutDashboard,
    CalendarRange,
    GraduationCap,
    BarChart3,
    FileText,
    School,
    Award,
    AlertTriangle,
    BookOpen,
    Users,
    Upload,
    UserCheck
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import etablissementService from "../../../services/etablissementService";
import { de } from "zod/v4/locales";

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────

const NAV = [
    { icon: LayoutDashboard, label: "Vue d'ensemble",            path: "/dashboard/admin",                   end: true },
    { icon: CalendarRange, label: "Calendrier scolaire",          path: "/dashboard/admin/calendrier" },
    // { icon: CalendarRange,   label: "Périodes & trimestres",     path: "/dashboard/admin/trimestre" },
    { icon: BarChart3,       label: "Statistiques des classes",  path: "/dashboard/admin/statistique" },
    { icon: FileText,        label: "Bulletins scolaires",       path: "/dashboard/bulletins" },
    { icon: School,          label: "Établissement",             path: "/dashboard/admin/etablissement" },
    { icon: Award,           label: "Élèves distingués",         path: "/dashboard/admin/meilleur-eleves" },
    { icon: AlertTriangle,   label: "Élèves en difficulté",      path: "/dashboard/admin/mauvais-eleves" },
    { icon: BookOpen,        label: "Matières",                  path: "/dashboard/admin/matieres" },
    { icon: Users,           label: "Classes",                   path: "/dashboard/admin/classes" },
    { icon: Upload,          label: "Import de données",         path: "/dashboard/admin/import" },
    { icon: UserCheck,       label: "Affectation du personnel",  path: "/dashboard/admin/affectation" },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ open, setOpen }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [etablissement, setEtablissement] = useState(null)
    const [profil, setProfil] = useState(null)
    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    useEffect( () => {
        let decoded 
        const token = localStorage.getItem("token");
        if (token) {
            decoded = jwtDecode(token);
            console.log(decoded)
            setProfil(decoded?.profil)
            setUser(decoded);
        }
        const getEtablissementInfo = async ()=>{
            try {
                const res = await etablissementService.getEtablissement(decoded.user.id)
                setEtablissement(res.data.etablissement)
            }catch(err){
                console.log(err.message)
            }
        }
        getEtablissementInfo()
    }, []);

    return (
        <>
            {/* Overlay mobile */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 flex flex-col z-30
                    transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                style={{ background: "linear-gradient(to bottom, #0f2557, #1a3a8f)" }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <GraduationCap size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-base leading-tight">
                            {profil?.etablissement?.nom}
                        </p>
                        <p className="text-blue-300 text-xs">Espace Administrateur</p>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="ml-auto lg:hidden text-white/60 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation — scrollbar masquée */}
                <nav
                    className="flex-1 px-3 py-4 space-y-1"
                    style={{
                        overflowY: "auto",
                        scrollbarWidth: "none",        /* Firefox */
                        msOverflowStyle: "none",       /* IE / Edge legacy */
                    }}
                >
                    {/* Masque la scrollbar webkit (Chrome, Safari) */}
                    <style>{`
                        aside nav::-webkit-scrollbar { display: none; }
                    `}</style>

                    {NAV.map(({ icon: Icon, label, path, end }, index) => (
                        <NavLink
                            key={index}
                            to={path}
                            end={end}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                                ${
                                    isActive
                                        ? "bg-white text-[#1a3a8f] shadow-lg shadow-blue-900/30"
                                        : "text-blue-200 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        size={18}
                                        className={
                                            isActive
                                                ? "text-[#1a3a8f]"
                                                : "text-blue-300 group-hover:text-white"
                                        }
                                    />
                                    {label}
                                    {isActive && (
                                        <ChevronRight
                                            size={14}
                                            className="ml-auto text-blue-400"
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Profile + Logout */}
                <div className="px-3 pb-5 pt-2 border-t border-white/10 space-y-2 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            A
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-sm font-semibold truncate">
                                Administrateur
                            </p>
                            <p className="text-blue-300 text-xs truncate">
                                {user && user.profil.nom + " " + user.profil.prenom}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={logOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
                    >
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
