import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import {
  getUserProgress,
  createUserProgress,
  updateUserProgress,
  isPaymentIdUsedByOther,
} from "@/api/entities";

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

    const alreadyUsedByOther = await isPaymentIdUsedByOther(paymentId, user.email);
    if (alreadyUsedByOther) {
      navigate("/home");
      return;
    }

    const prog = await getUserProgress(user.email);

    if (prog?.last_payment_id === paymentId) {
      navigate("/Course");
      return;
    }

    const expires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString().slice(0, 10);

    if (prog) {
      await updateUserProgress(prog.id, {
        subscription_status: "active",
        subscription_expires: expires,
        enrolled: true,
        last_payment_id: paymentId,
      });
    } else {
      await createUserProgress({
        created_by: user.email,
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
