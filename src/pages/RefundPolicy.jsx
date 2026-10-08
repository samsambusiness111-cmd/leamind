import React from "react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Refund &amp; Cancellation Policy for LeaMind</h1>
        <p className="text-sm text-slate-500 mb-8">Effective Date: October 8, 2026</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Subscription Model</h2>
            <p>LeaMind offers a 28-day access subscription for ₹500. This is a one-time payment — there is no auto-renewal and no recurring charge. You renew manually each cycle if you wish to continue.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. No Refunds</h2>
            <p>All purchases are final. Subscription fees are <strong>non-refundable</strong>, whether the 28-day access period is used or unused. Once access is granted, it cannot be exchanged for cash or refunded.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Why No Refunds?</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Subscription grants immediate access to all courses, lessons, and certificates</li>
              <li>New users can preview free lessons on leamindai.com before subscribing</li>
              <li>We recommend trying the free preview before purchasing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Failed Transactions</h2>
            <p>If your payment was deducted but 28-day access was not activated within 24 hours, contact us at <a href="mailto:arobindan@gmail.com" className="text-indigo-600 hover:underline">arobindan@gmail.com</a> with your Razorpay payment ID. We will either activate your access or issue a full refund for the failed transaction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Cancellation</h2>
            <p>LeaMind does not offer auto-renewal or subscriptions that require cancellation. All purchases are one-time. There is nothing to cancel — you simply choose whether to renew when your 28-day access expires.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Chargebacks</h2>
            <p>Initiating a chargeback without contacting us first may result in account suspension and permanent loss of access. We resolve all legitimate issues quickly — please reach out to us first.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Contact</h2>
            <p>For any questions about this policy, contact us at: <a href="mailto:arobindan@gmail.com" className="text-indigo-600 hover:underline">arobindan@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}