import React, { useEffect, useState } from "react";
import { getCurrentUser, redirectToLogin } from "@/lib/auth";

export default function AuthGuard({ children }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (!user) {
          redirectToLogin();
        } else {
          setChecked(true);
        }
      })
      .catch(() => redirectToLogin());
  }, []);

  if (!checked) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
      <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return children;
}
