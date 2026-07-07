import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/api/supabaseClient";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    activateAndRedirect();
  }, []);

  const activateAndRedirect = async () => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("razorpay_payment_id");

    if (!paymentId) {
      navigate("/");
      return;
    }

    const user = await getCurrentUser();
    if (!user) {
      navigate(`/?redirect=payment-success&razorpay_payment_id=${paymentId}`);
      return;
    }

    // Check if payment already used
    const { data: existing, error: checkError } = await supabase
      .from("user_progress")
      .select("id, last_payment_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Check error:", checkError);
      navigate("/");
      return;
    }

    if (existing?.last_payment_id === paymentId) {
      navigate("/Course");
      return;
    }

    const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString().slice(0, 10);

    if (existing) {
      // ✅ FIX: Use user_id instead of created_by
      await supabase
        .from("user_progress")
        .update({
          subscription_status: "active",
          subscription_expires: expires,
          enrolled: true,
          last_payment_id: paymentId,
        })
        .eq("id", existing.id);
    } else {
      // ✅ FIX: Use user_id instead of created_by
      await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          user_email: user.email,
          enrolled: true,
          completed_lessons: [],
          quiz_scores: {},
          current_module: "deepseek",
          current_lesson: 0,
          subscription_status: "active",
          subscription_expires: expires,
          last_payment_id: paymentId,
          streak_count: 1,
          longest_streak: 1,
          last_login_date: today,
        });
    }

    navigate("/Course");
  };

  return null;
}