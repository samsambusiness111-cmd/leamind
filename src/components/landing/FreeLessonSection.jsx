import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";

// ─── JASPER AI FULL LESSON ───────────────────────────────────────────────────
// Structure: sections that scroll through — overview, interface, features,
// use-cases, tips, exercises, then prompts at the very end.

const SECTIONS = [
  {
    id: "what",
    tab: "What is Jasper?",
    emoji: "🤖",
    title: "What is Jasper AI?",
    level: "Beginner",
    content: [
      {
        type: "intro",
        text: "Jasper AI (formerly Jarvis) is one of the most advanced AI writing assistants in the world. It is built specifically for professional writing — marketing copy, blog articles, social media posts, emails, ad scripts, product descriptions — all generated in seconds using artificial intelligence.",
      },
      {
        type: "info",
        label: "The Core Idea",
        text: "Jasper is powered by large language models (similar to GPT-4) but trained heavily on marketing and conversion-focused writing. Unlike a general chatbot, Jasper is designed to write content that gets results — content that drives clicks, sales, and engagement.",
      },
      {
        type: "info",
        label: "Who Uses It?",
        text: "Jasper is used by over 100,000 businesses worldwide — from solo freelancers to Fortune 500 marketing teams. If you create content for a living, or need to produce written material at scale, Jasper is built for you.",
      },
      {
        type: "fact",
        text: "Jasper can write a 1,500-word SEO blog post in under 3 minutes. The same task takes an average human writer 2–3 hours.",
      },
      {
        type: "list",
        label: "What Jasper Can Create",
        items: [
          "Blog posts and long-form articles (up to 10,000+ words)",
          "Facebook, Instagram, and Google ad copy",
          "Product descriptions for e-commerce",
          "Email subject lines, cold emails, newsletters",
          "YouTube video scripts and titles",
          "Social media captions and hashtag sets",
          "SEO meta titles and descriptions",
          "Sales pages and landing page copy",
          "Press releases and company bios",
          "Entire marketing campaigns from one brief",
        ],
      },
    ],
  },
  {
    id: "interface",
    tab: "The Interface",
    emoji: "🖥️",
    title: "Jasper's Interface — Every Button Explained",
    level: "Beginner",
    content: [
      {
        type: "intro",
        text: "When you first open Jasper, the interface can feel overwhelming. There are multiple modes, sidebars, and settings. This section breaks down every part of the Jasper dashboard so you know exactly what each button does.",
      },
      {
        type: "section-header",
        text: "📌 The 3 Main Modes",
      },
      {
        type: "feature",
        name: "1. Documents Mode (Long-Form Editor)",
        detail: "This is Jasper's most powerful mode. It's a full-screen writing editor — think Google Docs but with AI. You type a sentence, hit Compose, and Jasper continues writing for you. You can direct it with commands at the top (called 'Boss Mode' commands). Best for: blog posts, articles, essays, scripts.",
      },
      {
        type: "feature",
        name: "2. Templates Mode",
        detail: "Jasper has 50+ pre-built templates for specific content types. Click a template, fill in a short brief (your product name, audience, tone), and Jasper generates output instantly. Examples: AIDA Framework, Blog Post Intro, Google Ad Copy, Product Description, Email Subject Lines. Best for: beginners, quick single outputs.",
      },
      {
        type: "feature",
        name: "3. Chat Mode (Jasper Chat)",
        detail: "A conversational AI assistant — similar to ChatGPT but with Jasper's marketing DNA. You talk to it like a colleague. Ask it to 'write', 'rewrite', 'brainstorm', 'make shorter', or 'make this more persuasive'. Best for: quick tasks, back-and-forth refinement.",
      },
      {
        type: "section-header",
        text: "📌 The Sidebar — Key Settings",
      },
      {
        type: "feature",
        name: "Output Language",
        detail: "Jasper can write in 25+ languages. Switch this before generating — it writes native-quality content in Spanish, French, Hindi, German, and more, not just a translated version.",
      },
      {
        type: "feature",
        name: "Tone of Voice",
        detail: "This is one of Jasper's most important settings. You can set the tone to: Professional, Friendly, Witty, Persuasive, Empathetic, Bold, Casual, and more. The same content written in different tones is dramatically different. Always set this before generating.",
      },
      {
        type: "feature",
        name: "Brand Voice",
        detail: "In team or business plans, you can upload your brand guidelines and past content. Jasper learns your brand's unique voice and applies it to everything it writes — so it sounds like you, not a generic AI.",
      },
      {
        type: "feature",
        name: "Jasper Art",
        detail: "Built into Jasper is an AI image generator. Describe any image and it generates it in seconds — useful for blog thumbnails, social media visuals, or ad creative. Powered by Stable Diffusion.",
      },
      {
        type: "feature",
        name: "SEO Mode (Surfer SEO Integration)",
        detail: "Jasper integrates with Surfer SEO. When enabled, it shows you a real-time content score and keyword suggestions while you write — ensuring your content ranks on Google. The green score bar on the right side = your SEO health.",
      },
    ],
  },
  {
    id: "templates",
    tab: "Top Templates",
    emoji: "📋",
    title: "The Most Powerful Jasper Templates",
    level: "Beginner",
    content: [
      {
        type: "intro",
        text: "Templates are the fastest way to get output from Jasper. Each template is optimized for a specific content type. Here are the 8 you'll use most — what they do and when to use them.",
      },
      {
        type: "template",
        name: "AIDA Framework",
        tag: "Sales & Marketing",
        detail: "AIDA stands for Attention → Interest → Desire → Action. It's the most proven copywriting formula in history. Jasper generates a full AIDA framework piece for your product in 30 seconds. Use this for sales pages, landing pages, and email campaigns.",
      },
      {
        type: "template",
        name: "Blog Post Intro Paragraph",
        tag: "Content Writing",
        detail: "The hardest part of writing a blog post is the first paragraph. This template writes a compelling hook that pulls readers in. Just provide: topic, audience, and tone. Jasper handles the rest.",
      },
      {
        type: "template",
        name: "Google Ads (Headlines & Descriptions)",
        tag: "Paid Advertising",
        detail: "Google Ads have strict character limits (30 chars for headlines, 90 for descriptions). This template generates multiple headline and description variations optimized for click-through rate — tested within the character limits.",
      },
      {
        type: "template",
        name: "Product Description",
        tag: "E-Commerce",
        detail: "Enter your product name, key features, and target customer. Jasper writes a benefit-focused description that converts browsers into buyers. Works for Amazon, Shopify, Flipkart, and any online store.",
      },
      {
        type: "template",
        name: "Email Subject Lines",
        tag: "Email Marketing",
        detail: "Enter your email topic and Jasper generates 10 subject line variations — using curiosity, urgency, personalization, and benefit hooks. Split-test these to find the one with the highest open rate.",
      },
      {
        type: "template",
        name: "Feature to Benefit",
        tag: "Copywriting",
        detail: "Most businesses talk about features ('Our app has real-time sync'). Customers buy benefits ('Never lose your work again'). This template converts your feature list into emotionally compelling benefit statements.",
      },
      {
        type: "template",
        name: "Video Script Hook and Intro",
        tag: "Video Content",
        detail: "The first 15 seconds of a video determine if viewers stay or leave. This template writes a powerful hook + intro that grabs attention immediately. Works for YouTube, Instagram Reels, and course videos.",
      },
      {
        type: "template",
        name: "Content Improver",
        tag: "Editing",
        detail: "Paste any existing text — a paragraph, an email, a product description — and Jasper rewrites it to be clearer, more engaging, and more persuasive. This alone saves hours of editing time.",
      },
    ],
  },
  {
    id: "howto",
    tab: "How to Use It",
    emoji: "⚙️",
    title: "How to Use Jasper Effectively — Step by Step",
    level: "Intermediate",
    content: [
      {
        type: "intro",
        text: "Jasper is only as good as your input. Most people who call Jasper 'bad' are using it wrong — they give it vague instructions and expect magic. Here's how to use it the right way.",
      },
      {
        type: "section-header",
        text: "🎯 Step 1: Always Set Context First",
      },
      {
        type: "info",
        label: "The Product Description Box",
        text: "Before you use any template or write in Documents mode, fill in the 'Product/Company Description' box on the right sidebar. Tell Jasper: what your product is, who it's for, and what makes it different. This is the single most important thing you can do. Without context, Jasper writes generic content. With context, it writes content that feels like it knows your business.",
      },
      {
        type: "section-header",
        text: "🎯 Step 2: Choose the Right Tone",
      },
      {
        type: "info",
        label: "Tone = Voice",
        text: "Before generating, always select a tone of voice. For a startup pitch: 'Professional + Confident'. For social media: 'Casual + Witty'. For a sales email: 'Persuasive + Empathetic'. Switching the tone alone gives you dramatically different results from the same prompt.",
      },
      {
        type: "section-header",
        text: "🎯 Step 3: Use Commands in Documents Mode",
      },
      {
        type: "feature",
        name: "Boss Mode Commands",
        detail: "In Documents mode, you can give Jasper direct commands. Type them in the command box (or use the shortcut Cmd/Ctrl + Enter). Examples: 'Write a 3-paragraph introduction about [topic]', 'List 5 reasons why [product] is better than competitors', 'Rewrite the above paragraph in a more casual tone', 'Write a conclusion that includes a call to action'.",
      },
      {
        type: "section-header",
        text: "🎯 Step 4: Use Recipes (Workflows)",
      },
      {
        type: "info",
        label: "Recipes",
        text: "Jasper has 'Recipes' — pre-built sequences of commands that produce a full piece of content automatically. For example, the 'Blog Post Recipe' runs a sequence: write title → write intro → write 5 sections → write conclusion → write meta description. One click. Full post done.",
      },
      {
        type: "section-header",
        text: "🎯 Step 5: Always Edit, Never Just Publish",
      },
      {
        type: "fact",
        text: "Jasper's output is a first draft — a powerful one, but still a draft. The best workflow: Jasper writes 80% of the content, you refine the remaining 20% with your personal insight, specific data, and brand personality. This combination produces content that is both fast and genuinely good.",
      },
      {
        type: "list",
        label: "Power User Tips",
        items: [
          "Generate 3–5 variations of any output and pick the best one",
          "Use 'Explain it to a 5-year-old' command to simplify complex topics",
          "Combine templates — use 'Blog Post Intro' then switch to Documents mode to expand",
          "Use 'Content Improver' on your own writing to polish it instantly",
          "Save your best outputs as Templates for reuse later",
        ],
      },
    ],
  },
  {
    id: "usecases",
    tab: "Real Use Cases",
    emoji: "💼",
    title: "Real-World Use Cases — What People Actually Do With Jasper",
    level: "Intermediate",
    content: [
      {
        type: "intro",
        text: "Theory is one thing. Here's what real professionals are doing with Jasper right now — and how you can apply the same workflows to your own work.",
      },
      {
        type: "usecase",
        who: "Freelance Content Writer",
        before: "Used to spend 3–4 hours writing a 1,000-word blog post for clients",
        after: "Now uses Jasper to produce a complete draft in 25 minutes, edits it, and delivers in 45 minutes",
        result: "Can take on 3x more clients without working more hours",
      },
      {
        type: "usecase",
        who: "E-Commerce Store Owner",
        before: "Had 200 products on Shopify with poor descriptions that didn't convert",
        after: "Used Jasper's Product Description template to rewrite all 200 in one afternoon",
        result: "Conversion rate increased by 34% in the following month",
      },
      {
        type: "usecase",
        who: "Digital Marketing Agency",
        before: "Spent 2 hours creating ad copy variations for each client campaign",
        after: "Jasper generates 20 variations in 5 minutes — team picks the best 3 to test",
        result: "Campaign setup time reduced by 70%; more ad variants = better A/B testing",
      },
      {
        type: "usecase",
        who: "Solo Entrepreneur / Founder",
        before: "Needed a sales page but couldn't afford a ₹50,000 copywriter",
        after: "Used Jasper's AIDA template + Documents mode to write a full sales page in 2 hours",
        result: "Sales page went live; generated revenue without hiring a professional writer",
      },
      {
        type: "usecase",
        who: "Social Media Manager",
        before: "Spent Sunday evenings creating content calendars for Monday posts",
        after: "Uses Jasper to generate 30 days of captions, hooks, and hashtags in 20 minutes",
        result: "Freed up 4+ hours per week; content quality became more consistent",
      },
      {
        type: "fact",
        text: "Jasper users report an average 5x increase in content output with no increase in working hours. The key is using it as a collaborator, not a replacement — you bring the strategy, Jasper brings the words.",
      },
    ],
  },
  {
    id: "exercise",
    tab: "Interactive Exercise",
    emoji: "🎯",
    title: "Interactive Exercise — Test Your Knowledge",
    level: "Quiz",
    isQuiz: true,
    questions: [
      {
        q: "You want to write a 1,500-word SEO blog post using Jasper. Which mode should you use?",
        options: ["Jasper Chat — have a conversation to write the post", "Jasper Art — generate visual content first", "Documents Mode — write with AI in a full editor", "Templates Mode — use the Blog Post template"],
        correct: 2,
        explanation: "Documents Mode is Jasper's long-form editor — it's built for writing full articles, blog posts, and essays with AI assistance. Templates Mode only gives you short snippets, not a full-length article.",
      },
      {
        q: "What is the MOST important thing to do before generating any content in Jasper?",
        options: ["Fill in the Product/Company Description with your context", "Choose the output language", "Select the longest template available", "Generate 10 variations and pick one"],
        correct: 0,
        explanation: "Context is everything. Without telling Jasper what your product is, who it's for, and your unique angle — it writes generic content. The Product Description box gives Jasper the 'memory' it needs to write relevant output.",
      },
      {
        q: "What does the AIDA Framework template stand for?",
        options: ["Analyze, Implement, Design, Activate", "Audience, Intent, Direction, Authority", "Awareness, Influence, Data, Analytics", "Attention, Interest, Desire, Action"],
        correct: 3,
        explanation: "AIDA = Attention → Interest → Desire → Action. It's the most proven copywriting formula ever created. Jasper's AIDA template generates a full persuasive piece following this structure, designed for sales pages and marketing copy.",
      },
      {
        q: "You have 200 product listings on your Shopify store with weak descriptions. What's the fastest Jasper workflow?",
        options: ["Use Jasper Chat to describe all 200 products in one message", "Use the Product Description template in bulk — fill brief, generate, repeat", "Use the Content Improver template on all 200 at once", "Use Documents Mode to write each one manually with AI help"],
        correct: 1,
        explanation: "The Product Description template is designed exactly for this. You enter: product name, key features, and target customer — Jasper generates a conversion-optimized description instantly. Repeat for each product. 200 descriptions in an afternoon.",
      },
      {
        q: "Jasper writes a blog post draft for you. What's the best next step?",
        options: ["Publish it immediately — AI output is always accurate", "Run it through 5 more templates to improve it", "Delete it and write it yourself — AI content is never good enough", "Edit the 20% that needs your personal insight, data, and brand voice"],
        correct: 3,
        explanation: "Jasper is your first draft machine. It handles 80% of the heavy lifting. Your job is to add the final 20% — your personal expertise, specific statistics, real-world examples, and your brand's unique voice. This combination produces the best results.",
      },
    ],
  },
  {
    id: "prompts",
    tab: "Prompts to Try",
    emoji: "📝",
    title: "Jasper Prompts — Copy & Use These Today",
    level: "Prompts",
    content: [
      {
        type: "intro",
        text: "You've learned what Jasper is, how it works, and what it can do. Now here are ready-to-use prompts for Jasper Chat and Documents Mode — organized by use case. Copy any of these, fill in the brackets, and use them right now.",
      },
      {
        type: "prompt-group",
        label: "Blog & Content Writing",
        prompts: [
          {
            title: "Full Blog Post Brief",
            text: `Write a 1,200-word blog post about [topic].\nTarget audience: [who they are]\nTone: [professional/casual/witty]\nInclude: an engaging intro, 4 main sections with subheadings, real examples, and a strong conclusion with a CTA.\nFocus keyword: [your SEO keyword]`,
          },
          {
            title: "Compelling Blog Intro",
            text: `Write 3 different intro paragraphs for a blog post titled "[your title]".\nMake each one use a different hook: (1) a shocking statistic, (2) a relatable story, (3) a bold controversial statement.\nTarget reader: [describe your audience]`,
          },
        ],
      },
      {
        type: "prompt-group",
        label: "Ads & Marketing Copy",
        prompts: [
          {
            title: "Google Ad Variations",
            text: `Write 5 Google Ad headline + description combinations for:\nProduct: [product name]\nBenefit: [main benefit]\nTarget customer: [who they are]\nEach headline must be under 30 characters. Each description under 90 characters. Focus on urgency and the core benefit.`,
          },
          {
            title: "Facebook Ad (AIDA)",
            text: `Write a Facebook ad using the AIDA formula for:\nProduct: [product/service]\nProblem it solves: [pain point]\nOffer: [what they get]\nCTA: [what you want them to do]\nTone: [conversational/professional]\nKeep it under 150 words.`,
          },
        ],
      },
      {
        type: "prompt-group",
        label: "Email Writing",
        prompts: [
          {
            title: "Cold Outreach Email",
            text: `Write a cold outreach email for:\nSender: [your name/company]\nRecipient: [their role/industry]\nGoal: [what you want — a call, a reply, a demo]\nValue proposition: [what's in it for them]\nTone: Friendly but professional. Under 120 words. Include a clear CTA at the end.`,
          },
          {
            title: "10 Subject Line Variations",
            text: `Generate 10 email subject lines for a campaign about [topic/offer].\nUse a mix of: curiosity, urgency, personalization, benefit, and question-based hooks.\nTarget audience: [describe them]\nEach subject line must be under 50 characters.`,
          },
        ],
      },
      {
        type: "prompt-group",
        label: "Social Media",
        prompts: [
          {
            title: "30-Day Content Calendar",
            text: `Create a 30-day Instagram content calendar for a [type of business/brand].\nFor each day include: post topic, caption hook (first line), 5 relevant hashtags.\nMix content types: educational, behind-the-scenes, promotional, and engagement posts.\nTone: [casual/professional/inspirational]`,
          },
          {
            title: "Viral LinkedIn Post",
            text: `Write a LinkedIn post about [your insight/story/lesson].\nFormat: Start with a one-line hook. Use short paragraphs (1–2 lines max). Include a personal story or specific example. End with a question to drive comments.\nTone: Authentic, professional, direct.\nTarget audience: [professional group]`,
          },
        ],
      },
    ],
  },
];

// ─── Quiz Component ──────────────────────────────────────────────────────────
function QuizSection({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  const handleSelect = (qi, opt) => {
    if (submitted[qi]) return;
    setAnswers(prev => ({ ...prev, [qi]: opt }));
  };

  const handleCheck = (qi) => {
    if (answers[qi] === undefined) return;
    setSubmitted(prev => ({ ...prev, [qi]: true }));
  };

  const score = Object.keys(submitted).filter(qi => answers[qi] === questions[qi].correct).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">Answer each question, then click Check to see if you're right.</p>
        {Object.keys(submitted).length === questions.length && (
          <span className={`text-sm font-black px-3 py-1 rounded-full ${score === questions.length ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"}`}>
            {score}/{questions.length} correct
          </span>
        )}
      </div>

      {questions.map((q, qi) => {
        const selected = answers[qi];
        const isSubmitted = submitted[qi];
        const isCorrect = selected === q.correct;

        return (
          <div key={qi} className="border border-white/8 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-white/80 text-sm font-semibold leading-relaxed">
                <span className="text-indigo-400 font-black mr-2">Q{qi + 1}.</span>{q.q}
              </p>
            </div>
            <div className="p-4 space-y-2">
              {q.options.map((opt, oi) => {
                let style = "border-white/8 text-white/50 hover:border-white/20 hover:text-white/70";
                if (selected === oi) {
                  if (!isSubmitted) style = "border-indigo-400/60 text-white bg-indigo-500/10";
                  else if (isCorrect) style = "border-emerald-400/60 text-emerald-300 bg-emerald-500/10";
                  else style = "border-red-400/60 text-red-300 bg-red-500/10";
                }
                if (isSubmitted && oi === q.correct && selected !== q.correct) {
                  style = "border-emerald-400/60 text-emerald-300 bg-emerald-500/10";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(qi, oi)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${style}`}
                  >
                    <span className="font-bold mr-2 opacity-60">{String.fromCharCode(65 + oi)}.</span>{opt}
                  </button>
                );
              })}

              {!isSubmitted ? (
                <button
                  onClick={() => handleCheck(qi)}
                  disabled={selected === undefined}
                  className="mt-2 px-5 py-2 rounded-xl text-sm font-black text-black disabled:opacity-30 transition-all"
                  style={{ background: "linear-gradient(135deg, #34d399, #10b981)" }}
                >
                  Check Answer
                </button>
              ) : (
                <div className={`mt-2 p-3 rounded-xl border text-sm ${isCorrect ? "border-emerald-500/25 bg-emerald-500/8 text-emerald-300/80" : "border-red-500/25 bg-red-500/8 text-red-300/80"}`}>
                  <p className="font-bold mb-1">{isCorrect ? "✅ Correct!" : "❌ Not quite."}</p>
                  <p className="leading-relaxed text-white/50">{q.explanation}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Render Section Content ──────────────────────────────────────────────────
function SectionContent({ section }) {
  if (section.isQuiz) return <QuizSection questions={section.questions} />;

  return (
    <div className="space-y-5">
      {section.content.map((block, i) => {
        if (block.type === "intro") return (
          <p key={i} className="text-white/60 text-sm leading-relaxed">{block.text}</p>
        );

        if (block.type === "section-header") return (
          <p key={i} className="text-white/70 font-black text-sm pt-2">{block.text}</p>
        );

        if (block.type === "info") return (
          <div key={i} className="border border-indigo-500/20 rounded-xl p-4" style={{ background: "rgba(99,102,241,0.04)" }}>
            <p className="text-indigo-300/80 text-[10px] font-black uppercase tracking-[3px] mb-2">{block.label}</p>
            <p className="text-white/60 text-sm leading-relaxed">{block.text}</p>
          </div>
        );

        if (block.type === "fact") return (
          <div key={i} className="border border-yellow-500/20 rounded-xl p-4" style={{ background: "rgba(212,160,23,0.04)" }}>
            <p className="text-yellow-400/70 text-[10px] font-black uppercase tracking-[3px] mb-2">💡 Key Insight</p>
            <p className="text-white/65 text-sm leading-relaxed italic">{block.text}</p>
          </div>
        );

        if (block.type === "list") return (
          <div key={i} className="border border-white/6 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-3">{block.label}</p>
            <ul className="space-y-2">
              {block.items.map((item, ii) => (
                <li key={ii} className="flex items-start gap-2.5 text-sm text-white/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );

        if (block.type === "feature") return (
          <div key={i} className="border border-white/6 rounded-xl p-4 hover:border-white/12 transition-colors" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-white/80 font-bold text-sm mb-2">{block.name}</p>
            <p className="text-white/50 text-sm leading-relaxed">{block.detail}</p>
          </div>
        );

        if (block.type === "template") return (
          <div key={i} className="border border-white/6 rounded-xl p-4 hover:border-indigo-500/20 transition-colors" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <p className="text-white/80 font-bold text-sm">{block.name}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{block.tag}</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">{block.detail}</p>
          </div>
        );

        if (block.type === "usecase") return (
          <div key={i} className="border border-white/6 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="px-4 py-3 border-b border-white/5" style={{ background: "rgba(99,102,241,0.06)" }}>
              <p className="text-indigo-300 font-black text-sm">{block.who}</p>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold text-xs shrink-0 mt-0.5">BEFORE:</span>
                <p className="text-white/45 leading-relaxed">{block.before}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold text-xs shrink-0 mt-0.5">AFTER:</span>
                <p className="text-white/65 leading-relaxed">{block.after}</p>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-white/5 mt-2">
                <span className="text-yellow-400 font-bold text-xs shrink-0 mt-0.5">RESULT:</span>
                <p className="text-yellow-300/70 leading-relaxed font-semibold">{block.result}</p>
              </div>
            </div>
          </div>
        );

        if (block.type === "prompt-group") return (
          <div key={i} className="space-y-3">
            <p className="text-[10px] font-black tracking-[3px] text-white/30 uppercase pt-2">{block.label}</p>
            {block.prompts.map((p, pi) => (
              <div key={pi} className="rounded-xl border border-indigo-500/20 overflow-hidden" style={{ background: "rgba(10,10,30,0.8)" }}>
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5" style={{ background: "rgba(99,102,241,0.08)" }}>
                  <div className="w-2 h-2 rounded-full bg-red-400/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                  <div className="w-2 h-2 rounded-full bg-green-400/50" />
                  <span className="text-white/30 text-[10px] ml-2 font-mono">{p.title}</span>
                </div>
                <div className="p-4">
                  <pre className="text-indigo-200 text-xs leading-relaxed font-mono whitespace-pre-wrap">{p.text}</pre>
                </div>
              </div>
            ))}
          </div>
        );

        return null;
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FreeLessonSection({ onSignUp }) {
  const [activeSection, setActiveSection] = useState(0);
  const section = SECTIONS[activeSection];

  return (
    <section className="py-12 sm:py-20 px-4 border-t border-white/5 relative" style={{ background: "#030308" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 65%)" }} />
      <div className="max-w-3xl mx-auto relative">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-2 mb-4 sm:mb-5">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-indigo-300 text-sm font-bold tracking-wide">FREE — No sign-up required</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">🎁 Free AI Lesson: Jasper AI</h2>
          <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
            A complete, in-depth lesson on Jasper AI — what it is, how every feature works, real use cases, interactive exercises, and prompts. Same depth as the paid course.
          </p>
        </div>

        {/* Section Tabs — scrollable row */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5 sm:mb-6" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {SECTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={`shrink-0 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border flex items-center gap-1.5 ${
                activeSection === i
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                  : "bg-white/3 border-white/8 text-white/35 hover:text-white/55 hover:border-white/15"
              }`}
            >
              <span>{s.emoji}</span>
              <span className="hidden sm:inline">{s.tab}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Lesson Card */}
        <div className="border border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.07)]">

          {/* Tool Header */}
          <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-white/6"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))" }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-xl shrink-0">✍️</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-base">Jasper AI — {section.tab}</p>
              <p className="text-indigo-300/70 text-sm mt-0.5 truncate">{section.title}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                section.level === "Quiz" ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" :
                section.level === "Prompts" ? "bg-purple-500/15 text-purple-400 border-purple-500/30" :
                section.level === "Intermediate" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              }`}>{section.level}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <div className="p-5 sm:p-7" style={{ background: "rgba(255,255,255,0.015)" }}>
                <h3 className="text-white font-black text-base sm:text-lg mb-5 leading-tight">{section.title}</h3>
                <SectionContent section={section} />

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                  <button
                    onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                    disabled={activeSection === 0}
                    className="flex items-center gap-1 text-white/25 hover:text-white/60 disabled:opacity-20 transition-colors text-xs font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>

                  <div className="flex items-center gap-1.5">
                    {SECTIONS.map((_, i) => (
                      <button key={i} onClick={() => setActiveSection(i)}
                        className={`rounded-full transition-all duration-200 ${i === activeSection ? "w-5 h-1.5 bg-indigo-500" : "w-1.5 h-1.5 bg-white/15 hover:bg-white/30"}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveSection(Math.min(SECTIONS.length - 1, activeSection + 1))}
                    disabled={activeSection === SECTIONS.length - 1}
                    className="flex items-center gap-1 text-white/25 hover:text-white/60 disabled:opacity-20 transition-colors text-xs font-semibold"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Soft CTA */}
          <div className="px-6 sm:px-8 py-5 border-t border-white/6 flex flex-col sm:flex-row items-center gap-4"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(0,0,0,0))" }}>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white/60 text-xs font-semibold">This is exactly what the paid course looks like — interactive, in-depth, hands-on.</p>
              <p className="text-white/25 text-[11px] mt-0.5">9 more tools. 60+ interactive lessons. 10 certificates. All for ₹500.</p>
            </div>
            <button onClick={onSignUp}
              className="shrink-0 text-black font-black text-sm py-3 px-7 rounded-xl"
              style={{ background: "linear-gradient(135deg, #34d399, #10b981)", boxShadow: "0 0 30px rgba(52,211,153,0.25)" }}>
              🚀 Sign Up Free — Get All 10 Tools →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}