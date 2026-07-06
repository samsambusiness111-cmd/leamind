import React from "react";

export default function DeleteAccount() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Account Deletion Request</h1>

        <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
          <p>To delete your LeaMind account and all associated data, please email us at:</p>
          
          <p className="text-xl font-semibold text-indigo-600">
            <a href="mailto:arobindan@gmail.com" className="hover:underline">arobindan@gmail.com</a>
          </p>

          <p>Include your name and the email address you used to sign up. We will process your request within 7 days.</p>

          <p className="text-slate-600">Thank you for using LeaMind.</p>
        </div>
      </div>
    </div>
  );
}