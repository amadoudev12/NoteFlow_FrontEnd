import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, TrendingUp, Award, AlertCircle,
  ChevronRight, Bell, Search, GraduationCap, BookOpen,
  Star, AlertTriangle, BarChart3, PieChart,
} from "lucide-react";
import adminService from "../../services/adminService";
import etablissementService from "../../services/etablissementService";
import noteService from "../../services/noteService";

const MOCK = {
    stat: {
        nombreEleves: 487,
        nombreClasses: 18,
        nombreEnseignants: 42,
        moyenneEtablissement: { moyenneEtablissement: 13.4, trimestre: "Trimestre 3" },
    },
    courbeData: [
        { trimestre: "T1", moyenne: 12.8 },
        { trimestre: "T2", moyenne: 13.0 },
        { trimestre: "T3", moyenne: 13.4 },
    ],
    moyenneClasses: [
        { classe: "6ème A", moyenne: 14.1 }, { classe: "5ème B", moyenne: 13.6 },
        { classe: "4ème A", moyenne: 12.9 }, { classe: "3ème C", moyenne: 13.3 },
        { classe: "2nde B", moyenne: 13.8 }, { classe: "1ère S", moyenne: 12.7 },
        { classe: "Tle ES", moyenne: 14.2 },
    ],
    moyenneMatieres: [
        { matiere: "Maths", moyenne: 11.8 },    { matiere: "Français", moyenne: 13.4 },
        { matiere: "Histoire", moyenne: 14.7 }, { matiere: "Anglais", moyenne: 15.1 },
        { matiere: "SVT", moyenne: 12.6 },      { matiere: "Physique", moyenne: 11.2 },
        { matiere: "Arts", moyenne: 16.3 },
    ],
    repartition: [
        { range: "0–5",   count: 4  },
        { range: "5–10",  count: 18 },
        { range: "10–15", count: 54 },
        { range: "15–20", count: 24 },
    ],
    elevesForts: [
        { nom: "Amara Koné",     moyenne: 18.2, classe: "Terminale S" },
        { nom: "Léa Marchetti",  moyenne: 17.8, classe: "1ère ES"     },
        { nom: "Youssef Benali", moyenne: 17.4, classe: "Terminale L" },
        { nom: "Chloé Dupont",   moyenne: 16.9, classe: "2nde A"      },
        { nom: "Ibrahim Diallo", moyenne: 16.5, classe: "Terminale S" },
    ],
    elevesFaibles: [
        { nom: "Théo Martin",    moyenne: 5.8, classe: "3ème B" },
        { nom: "Sarah Ould",     moyenne: 6.2, classe: "4ème A" },
        { nom: "Karim Ndiaye",   moyenne: 6.7, classe: "6ème C" },
        { nom: "Emma Leroy",     moyenne: 7.1, classe: "5ème B" },
        { nom: "Lucas Pereira",  moyenne: 7.4, classe: "3ème A" },
    ],
    };
export function SectionTitle({ icon: Icon, title, subtitle }) {
    return (
        <div className="mb-8 hidden">
        <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-100 text-blue-600 rounded-xl p-2">
            <Icon size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        </div>
        {subtitle && <p className="text-slate-500 text-sm pl-12">{subtitle}</p>}
        </div>
    );
}
    // ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
import DashboardPage from "../components/Admin/DashboardPage";
import { jwtDecode } from "jwt-decode";
    // ─── APP
export default function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stat, setStat]           = useState(null);
    const [chartData, setChartData] = useState({});
    const [loading, setLoading]     = useState(true);
    const token = localStorage.getItem('token')
    const decodedToken = jwtDecode(token)
    console.log(decodedToken)
    useEffect(() => {
        const fetchAll = async () => {
        try {
            // ── Stats card ──
            const statRes = await adminService.Stat();
            if (statRes?.data) setStat(statRes.data);
            // ── Charts — await Promise.all (bug fix) ──
            const [moyenneEvolution, moyenneClasses, moyenneMatieres, repartition, nombreElevesFortByClasse, nombreElevesFaibleByClasse] = await Promise.all([
                etablissementService.moyenneEvolution(),
                etablissementService.moyenneClasses(),
                etablissementService.moyenneMatieres(),
                noteService.noteRepartition(),
                adminService.nombreElevesFortByClasse(),
                adminService.nombreElevesFaiblesByClasse()
            ]);
            setChartData({
                courbeData:     moyenneEvolution?.data,
                moyenneClasses: moyenneClasses?.data,
                moyenneMatieres: moyenneMatieres?.data,
                repartition:    repartition?.data,
                elevesForts:    nombreElevesFortByClasse?.data ,   
                elevesFaibles:  nombreElevesFaibleByClasse?.data 
            });
        } catch (err) {
            console.log('erreur serveur')
            setStat(MOCK.stat);
            setChartData(MOCK);
        } finally {
            setLoading(false);
        }
        };

        fetchAll();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex">
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            * { font-family: 'Plus Jakarta Sans', sans-serif; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        `}</style>

        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
            <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 flex flex-col min-h-screen lg:ml-38">
            {/* <Topbar setOpen={setSidebarOpen} /> */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
            {/* Page title */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
                <p className="text-slate-500 text-sm mt-1">Vue d'ensemble de l'établissement</p>
            </div>
                <DashboardPage stat={stat} chartData={chartData} loading={loading} />
            </main>
        </div>
        </div>
    );
}