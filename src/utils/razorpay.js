const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export function openRazorpayCheckout({ onSuccess, onFailure }) {
  const done = (fn, ...args) => { fn && fn(...args); };

  const launchCheckout = () => {
    const options = {
      key: RAZORPAY_KEY,
      amount: 50000,
      currency: "INR",
      name: "Leamind",
      description: "28-Day Full Access — All 10 AI Courses",
      prefill: { name: "", email: "", contact: "" },
      remember_customer: false,
      theme: { color: "#4F46E5" },
      modal: {
        ondismiss: () => done(onFailure),
        escape: true,
        backdropclose: false,
      },
      handler: function (response) {
        done(onSuccess, response.razorpay_payment_id);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => done(onFailure));
    rzp.open();
  };

  // If already loaded, use it directly
  if (window.Razorpay) {
    launchCheckout();
    return;
  }

  // Load script once
  const existing = document.querySelector('script[src*="checkout.razorpay"]');
  if (existing) {
    existing.addEventListener("load", launchCheckout);
    return;
  }

  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = launchCheckout;
  script.onerror = () => {
    done(onFailure);
    alert("Failed to load payment gateway. Please try again.");
  };
  document.body.appendChild(script);
}