import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


const ROUTE_TITLES = {
  "/Course": "Course",
  "/Chat": "AI Chat",
  "/Summary": "My Progress",
  "/Profile": "Profile"
};

export default function MobileHeader({ title, backTo }) {
  const navigate = useNavigate();
  const location = useLocation();

  const routeTitle = title || ROUTE_TITLES[location.pathname] || "Leamind";
  const isSubRoute = !!ROUTE_TITLES[location.pathname];
  const handleBack = () => navigate(backTo || "/");

  return (
    <nav
      className="md:hidden bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm"
      style={{ paddingTop: "env(safe-area-inset-top)" }}>
      
      <div className="h-14 flex items-center px-4 relative">
        {isSubRoute ?
        <>
            <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors -ml-1">
            
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 font-bold text-slate-900 text-base">
              {routeTitle}
            </span>
          </> :

        <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-lg">Leamind</span>
          </div>
        }
      </div>
    </nav>);

}