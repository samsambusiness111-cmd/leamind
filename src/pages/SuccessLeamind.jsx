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
        // 1. Get the current user
        const user = await getCurrentUser();
        if (!user) {
          console.error("No user found");
          navigate("/");
          return;
        }

        // 2. Check if payment ID exists
        if (!paymentId) {
          console.error("No payment ID found");
          navigate("/");
          return;
        }

        console.log("Activating subscription for user:", user.id, "Payment ID:", paymentId);

        // 3. Check if user already has a progress record
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

        const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();

        // 4. If row exists, update it
        if (existing) {
          console.log("Updating existing progress record:", existing.id);
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
        } else {
          // 5. If no row exists, CREATE ONE
          console.log("Creating NEW progress record for user:", user.id);
          const { data: newRecord, error: insertError } = await supabase
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

          if (insertError) {
            console.error("Insert error:", insertError);
            navigate("/");
            return;
          }
          console.log("New record created:", newRecord);
        }

        // 6. Success! Redirect to course
        console.log("Subscription activated! Redirecting to Course...");
        navigate("/Course");
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