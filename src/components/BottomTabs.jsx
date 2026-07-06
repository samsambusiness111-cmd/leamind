import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, BarChart2, User } from "lucide-react";
import { createPageUrl } from "@/utils";

const TABS = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Course", icon: BookOpen, path: "/Course" },
  { label: "Progress", icon: BarChart2, path: "/Summary" },
  { label: "Profile", icon: User, path: "/Profile" },
];

export default function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  // Store last visited path per tab
  useEffect(() => {
    const tab = TABS.find(t =>
      t.path === "/" ? location.pathname === "/" || location.pathname === "/Home" : location.pathname.startsWith(t.path)
    );
    if (tab) {
      sessionStorage.setItem(`tab_last_${tab.path}`, location.pathname + location.search);
    }
  }, [location]);

  // Hide on certain pages
  const hiddenPaths = ["/payment-success", "/success-leamind"];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-lg flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ label, icon: Icon, path }) => {
        const active = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
        return (
          <button
            key={label}
            onClick={() => {
              if (active) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                const last = sessionStorage.getItem(`tab_last_${path}`);
                navigate(last || path);
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors select-none ${
              active ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        );
      })}
    </div>
  );
}