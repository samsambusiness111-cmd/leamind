import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy for LeaMind</h1>
        <p className="text-sm text-slate-500 mb-8">Effective Date: May 17, 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you use LeaMind, we collect:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Name and email address (when you sign in with Google)</li>
              <li>App interactions (course progress, quiz scores, certificates earned)</li>
            </ul>
            <p className="mt-3">We do not collect your location, payment info, contacts, photos, or device ID.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide, operate, and improve LeaMind</li>
              <li>Track your course progress and certificates</li>
              <li>Understand how users interact with the app (analytics)</li>
              <li>Prevent fraud and abuse</li>
              <li>Personalize your learning experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Data Sharing</h2>
            <p>We do not sell or share your personal data with any third party. Payments are processed securely by Razorpay. We do not store your payment information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Retention</h2>
            <p>Your data is stored as long as you have an active account. You can request account deletion by emailing arobindan@gmail.com. Your data will be removed within 7 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Children's Privacy</h2>
            <p>LeaMind is intended for users aged 13 and above. If you are under 13, please use this app with a parent or guardian.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact Us</h2>
            <p>If you have questions about this policy, please contact us at: <a href="mailto:arobindan@gmail.com" className="text-indigo-600 hover:underline">arobindan@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}