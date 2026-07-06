import React, { useState, useEffect } from "react";
import SubscriptionModal from "./SubscriptionModal";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/api/supabaseClient";

export default function SubscriptionGuard({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);

  useEffect(() => { checkSubscription(); }, []);

  const checkSubscription = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        setStatus("locked");
        return;
      }
      setUser(currentUser);

      if (currentUser.role === "admin") {
        setStatus("active");
        return;
      }

      // ✅ FIX: Use user_id instead of email
      const { data: prog, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching progress:", error);
        setStatus("locked");
        return;
      }

      if (prog?.subscription_status === "active" && prog.subscription_expires) {
        const expired = new Date(prog.subscription_expires) < new Date();
        setStatus(expired ? "expired" : "active");
      } else if (prog?.subscription_status === "expired") {
        setStatus("expired");
      } else {
        setStatus("locked");
      }
    } catch (error) {
      console.error("Subscription check error:", error);
      setStatus("locked");
    }
  };

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
      <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (status === "locked") return <SubscriptionModal hardPaywall expired={false} />;
  if (status === "expired") return <SubscriptionModal hardPaywall expired={true} />;

  return children;
}