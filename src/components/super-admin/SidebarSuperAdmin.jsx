import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../data/superAdminMockData";
import { GraduationCap } from "lucide-react";

export default function SidebarSuperAdmin() {
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();

  const getActiveKey = () => {
    if (pathname === "/dashboard/super-admin") return "dashboard";
    const path = pathname.replace("/dashboard/super-admin/", "");
    return path.split("/")[0] || "dashboard";
  };

  const activeKey = getActiveKey();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200/80 flex flex-col z-30">
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
          <GraduationCap size={22} className="text-white" strokeWidth={2.2} />
        </div>
        <div>
          <p className="font-display font-extrabold text-slate-900 text-[15px] leading-tight">EduSuite</p>
          <p className="text-[11px] text-slate-400 font-body font-medium tracking-wide">SUPER ADMIN</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-body mb-2">Pilotage</p>
        {NAV_ITEMS.map((item) => {
          const isActive = activeKey === item.key;
          const href = item.key === "dashboard" ? "/dashboard/super-admin" : `/dashboard/super-admin/${item.key}`;
          return (
            <Link
              key={item.key}
              to={href}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold font-body transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              )}
              <item.icon size={18} strokeWidth={isActive ? 2.4 : 2} className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} />
              <span>{item.label}</span>
              {item.key === "logs" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 pulse-dot" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold font-body text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200">
          <span className="text-slate-400">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
