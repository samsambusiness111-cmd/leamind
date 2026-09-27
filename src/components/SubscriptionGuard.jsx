import React, { useState, useEffect } from "react";
import SubscriptionModal from "./SubscriptionModal";
import { getCurrentUser, checkSubscription } from "@/lib/auth";

export default function SubscriptionGuard({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        setStatus("locked");
        return;
      }

      // ✅ Unified: read from subscriptions table via checkSubscription()
      const sub = await checkSubscription();

      if (sub.subscribed === true) {
        // Double-check expiry
        if (sub.expiry_date && new Date(sub.expiry_date) < new Date()) {
          setStatus("expired");
        } else {
          setStatus("active");
        }
      } else {
        setStatus("locked");
      }
    } catch (error) {
      console.error("Subscription check error:", error);
      setStatus("locked");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "locked") return <SubscriptionModal hardPaywall expired={false} />;
  if (status === "expired") return <SubscriptionModal hardPaywall expired={true} />;

  return children;
}