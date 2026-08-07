import { Outlet, useLocation } from "react-router-dom";
import SidebarSuperAdmin from "../components/super-admin/SidebarSuperAdmin.jsx";
import { Navbar } from "../components/super-admin/SharedComponents.jsx";

const PAGE_TITLES = {
  dashboard: "Tableau de bord",
  etablissements: "Établissements",
  directeurs: "Directeurs",
  annees: "Années académiques",
  trimestres: "Trimestres",
  statistiques: "Statistiques",
  logs: "Journaux système",
  parametres: "Paramètres",
};

function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      .font-display { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
      .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      @keyframes pulseDot {
        0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.35); }
        50% { box-shadow: 0 0 0 6px rgba(37,99,235,0); }
      }
      .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-up { animation: fadeUp 0.4s ease-out both; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
    `}</style>
  );
}

export default function SuperAdminLayout() {
  const location = useLocation();
  const currentKey = location.pathname.replace("/dashboard/super-admin", "").replace(/^\//, "") || "dashboard";
  const pageTitle = PAGE_TITLES[currentKey] || PAGE_TITLES.dashboard;

  return (
    <div className="min-h-screen bg-[#f6f8fb] font-body">
      <FontStyles />
      <SidebarSuperAdmin />
      <div className="pl-72">
        <Navbar pageTitle={pageTitle} />
        <main className="p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
