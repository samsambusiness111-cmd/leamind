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

    const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString().slice(0, 10);

    // ── 1. WRITE TO SUBSCRIPTIONS TABLE (this is what the app checks now) ──
    const { data: existingSub, error: subCheckError } = await supabase
      .from("subscriptions")
      .select("id, razorpay_payment_id")
      .eq("user_email", user.email)
      .maybeSingle();

    if (subCheckError) {
      console.error("Subscription check error:", subCheckError);
    }

    // Skip if same payment already applied
    if (existingSub?.razorpay_payment_id === paymentId) {
      navigate("/Course");
      return;
    }

    if (existingSub) {
      await supabase
        .from("subscriptions")
        .update({
          status: "active",
          start_date: new Date().toISOString(),
          expiry_date: expires,
          razorpay_payment_id: paymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSub.id);
    } else {
      await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          user_email: user.email,
          status: "active",
          start_date: new Date().toISOString(),
          expiry_date: expires,
          razorpay_payment_id: paymentId,
        });
    }

    // ── 2. ALSO UPDATE user_progress (for backwards compatibility) ──
    const { data: existingProgress } = await supabase
      .from("user_progress")
      .select("id, last_payment_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingProgress?.last_payment_id === paymentId) {
      navigate("/Course");
      return;
    }

    if (existingProgress) {
      await supabase
        .from("user_progress")
        .update({
          subscription_status: "active",
          subscription_expires: expires,
          enrolled: true,
          last_payment_id: paymentId,
        })
        .eq("id", existingProgress.id);
    } else {
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