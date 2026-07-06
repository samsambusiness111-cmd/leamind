import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

export default function SuccessLeamind() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("razorpay_payment_id");
  const [error, setError] = useState(null);

  useEffect(() => {
    const activateSubscription = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate("/");
          return;
        }

        if (!paymentId) {
          navigate("/");
          return;
        }

        // 1. Check if user already has a progress record
        let { data: existing, error: fetchError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Fetch error:", fetchError);
          setError("Failed to load your account. Please contact support.");
          return;
        }

        const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();

        let result;
        if (existing) {
          // Update existing record
          const { data, error } = await supabase
            .from("user_progress")
            .update({
              subscription_status: "active",
              subscription_expires: expires,
              last_payment_id: paymentId,
              enrolled: true,
            })
            .eq("id", existing.id)
            .select()
            .single();

          if (error) {
            console.error("Update error:", error);
            setError("Failed to activate your subscription. Please contact support.");
            return;
          }
          result = data;
        } else {
          // Create new record
          const { data, error } = await supabase
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
            })
            .select()
            .single();

          if (error) {
            console.error("Insert error:", error);
            setError("Failed to activate your subscription. Please contact support.");
            return;
          }
          result = data;
        }

        // 2. VERIFY the update was successful
        const { data: verified, error: verifyError } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (verifyError) {
          console.error("Verify error:", verifyError);
        }

        console.log("Verified subscription status:", verified?.subscription_status);

        // 3. Force redirect to Home with a slight delay
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 500);

      } catch (error) {
        console.error("Activation error:", error);
        setError("Something went wrong. Please try again.");
      }
    };

    activateSubscription();
  }, [navigate, paymentId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

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