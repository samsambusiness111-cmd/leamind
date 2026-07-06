import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

export default function SuccessLeamind() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("razorpay_payment_id");

  useEffect(() => {
    const activateSubscription = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          console.error("No user found");
          navigate("/");
          return;
        }

        if (!paymentId) {
          console.error("No payment ID found");
          navigate("/");
          return;
        }

        const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();

        // ✅ 1. Check if user already has a progress record
        let { data: existing, error: fetchError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Fetch error:", fetchError);
          navigate("/");
          return;
        }

        // ✅ 2. If record exists, UPDATE it
        if (existing) {
          const { error: updateError } = await supabase
            .from("user_progress")
            .update({
              subscription_status: "active",
              subscription_expires: expires,
              last_payment_id: paymentId,
              enrolled: true,
            })
            .eq("id", existing.id);

          if (updateError) {
            console.error("Update error:", updateError);
            navigate("/");
            return;
          }
        } 
        // ✅ 3. If NO record exists, CREATE one
        else {
          const { error: insertError } = await supabase
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
            });

          if (insertError) {
            console.error("Insert error:", insertError);
            navigate("/");
            return;
          }
        }

        // ✅ 4. VERIFY the update was successful
        const { data: verify, error: verifyError } = await supabase
          .from("user_progress")
          .select("subscription_status")
          .eq("user_id", user.id)
          .maybeSingle();

        if (verifyError) {
          console.error("Verify error:", verifyError);
        } else {
          console.log("✅ Subscription activated! Status:", verify?.subscription_status);
        }

        // ✅ 5. Redirect to Home (unlocked)
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 800);

      } catch (error) {
        console.error("Activation error:", error);
        navigate("/");
      }
    };

    activateSubscription();
  }, [navigate, paymentId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Activating your access...</h2>
        <p className="text-slate-500 mt-2">Please wait, do not close this page</p>
      </div>
    </div>
  );
}