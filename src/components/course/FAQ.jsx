import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is Leamind beginner-friendly?",
    a: "Yes. Leamind is designed for learners with zero prior experience with AI tools. Every course starts with a clear introduction, uses plain language, and progresses gradually. No technical background is required."
  },
  {
    q: "Do I need to know how to code?",
    a: "No coding knowledge is required for most courses. Some modules like GitHub Copilot cover programming concepts, but they are explained from the ground up. All other AI tools are taught in a completely non-technical way."
  },
  {
    q: "Are the certificates downloadable and shareable?",
    a: "Yes. After completing all lessons and quizzes for an AI tool, you can download a professional PDF certificate. Each certificate includes your name, course title, platform name, completion date, and a unique Certificate ID — suitable for your resume, LinkedIn, or portfolio."
  },
  {
    q: "Can I use these certificates for job applications or internships?",
    a: "Absolutely. Leamind certificates are designed to be resume-worthy and LinkedIn-ready. They demonstrate practical, hands-on knowledge of real AI tools that employers actively look for today. Each certificate includes a verifiable ID."
  },
  {
    q: "Is this platform self-paced?",
    a: "Yes. Leamind is fully self-paced. You can start, pause, and continue at any time. Your progress is automatically saved after every lesson, so you always pick up exactly where you left off — across any device."
  },
  {
    q: "How long does it take to complete a course?",
    a: "Each AI tool course consists of 7 focused lessons. At a comfortable pace, most learners complete one tool module in 2–3 hours. Completing all 10 AI tools takes approximately 20–30 hours total, depending on your pace."
  },
  {
    q: "Will more AI tools be added?",
    a: "Yes. Leamind is continuously updated with new AI tools and upgraded content. The platform is designed to grow alongside the AI landscape, so your skills remain current."
  },
  {
    q: "What AI tools does Leamind currently cover?",
    a: "Leamind covers 10 leading AI tools: DeepSeek, ChatGPT, Claude, Perplexity AI, GitHub Copilot, Midjourney, Stable Diffusion, Notion AI, ElevenLabs, and Kling AI — spanning text, code, image, audio, and video AI."
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-8 pt-8 pb-6 border-b border-slate-50">
        <p className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-1">Support</p>
        <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <p className="text-sm text-slate-500 mt-1">Everything you need to know before you start.</p>
      </div>
      <div className="divide-y divide-slate-50">
        {FAQS.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-8 py-5 text-left hover:bg-slate-50/80 transition-colors"
            >
              <span className="font-semibold text-sm text-slate-800 pr-4">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-8 pb-5">
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}