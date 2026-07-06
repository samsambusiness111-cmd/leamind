import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Award, Download, X, CheckCircle2, Lock } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { LOGO_URL } from "@/lib/constants";


const COURSE_HOURS = {
  "DeepSeek": "5 hours", "ChatGPT": "6 hours", "Claude": "5 hours",
  "Claude Cowork": "6 hours", "Claude Code": "7 hours",
  "Perplexity AI": "4 hours", "GitHub Copilot": "6 hours", "Midjourney": "5 hours",
  "Stable Diffusion": "6 hours", "Notion AI": "5 hours", "ElevenLabs": "4 hours", "Kling AI": "5 hours",
};

function generateCertId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const seg = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `LM-${seg(4)}-${seg(4)}-${seg(4)}`;
}

function CertificateCanvas({ name, moduleName, certId, date, hours }) {
  return (
    <div
      id="cert-canvas"
      style={{
        width: 900,
        height: 636,
        background: "linear-gradient(135deg, #0d0d2b 0%, #12123a 60%, #0a0a22 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Arial', sans-serif",
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {/* Gold border frame */}
      <div style={{ position: "absolute", inset: 12, border: "2px solid #d4a017", pointerEvents: "none", zIndex: 2 }} />
      <div style={{ position: "absolute", inset: 18, border: "1px solid rgba(212,160,23,0.3)", pointerEvents: "none", zIndex: 2 }} />

      {/* Corner ornaments */}
      {[
        { top: 6, left: 6 }, { top: 6, right: 6 }, { bottom: 6, left: 6 }, { bottom: 6, right: 6 }
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos, width: 28, height: 28,
          border: "2px solid #d4a017", borderRadius: "50%",
          background: "rgba(212,160,23,0.15)", zIndex: 3,
        }} />
      ))}

      {/* Decorative circles top-right */}
      <div style={{
        position: "absolute", top: -60, right: -60, width: 280, height: 280,
        border: "2px solid rgba(90,80,180,0.4)", borderRadius: "50%", zIndex: 1,
      }} />
      <div style={{
        position: "absolute", top: 20, right: 20, width: 180, height: 180,
        border: "1px solid rgba(90,80,180,0.3)", borderRadius: "50%", zIndex: 1,
      }} />

      {/* Left decorative arc */}
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 260, height: 260,
        border: "2px solid rgba(90,80,180,0.3)", borderRadius: "50%", zIndex: 1,
      }} />

      {/* HEADER: Logo + Academy name */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", padding: "32px 40px 0" }}>
        <div style={{
          width: 60, height: 60, borderRadius: 14,
          overflow: "hidden", marginRight: 16, flexShrink: 0,
          boxShadow: "0 2px 16px rgba(99,102,241,0.35)"
        }}>
          <img src={LOGO_URL} alt="Leamind" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 14, display: "block" }} crossOrigin="anonymous" />
        </div>
        <div>
          <div style={{ fontSize: 19, fontWeight: 900, letterSpacing: 2, color: "#ffffff", lineHeight: 1 }}>LeaMind</div>
          <div style={{ fontSize: 9.5, color: "#a0a0cc", marginTop: 5, letterSpacing: 0.5, fontStyle: "italic" }}>Learn AI the Right Way</div>
        </div>
      </div>

      {/* Gold divider with diamond */}
      <div style={{ position: "relative", zIndex: 10, margin: "20px 40px 0", display: "flex", alignItems: "center", gap: 0 }}>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #d4a017, transparent)" }} />
        <div style={{
          width: 14, height: 14, background: "#d4a017",
          transform: "rotate(45deg)", margin: "0 8px", flexShrink: 0,
        }} />
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #d4a017, transparent)" }} />
      </div>

      {/* CERTIFICATE OF COMPLETION */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginTop: 18 }}>
        <div style={{ letterSpacing: 8, fontSize: 11, color: "#d4a017", fontWeight: 700 }}>CERTIFICATE OF COMPLETION</div>
      </div>

      {/* Body text */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginTop: 14, padding: "0 80px" }}>
        <div style={{ fontSize: 11, color: "#a0a0cc", lineHeight: 1.8 }}>
          This is to certify that the following individual has successfully completed
        </div>
        <div style={{ fontSize: 11, color: "#a0a0cc", lineHeight: 1.8 }}>
          all required lessons, assessments, and demonstrated mastery in
        </div>
      </div>

      {/* Recipient Name */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginTop: 14 }}>
        <div style={{
          fontSize: 46, fontWeight: 900, color: "#ffffff",
          letterSpacing: -1, lineHeight: 1, padding: "0 40px",
          textShadow: "0 2px 20px rgba(255,255,255,0.15)"
        }}>
          {name}
        </div>
        <div style={{
          width: 200, height: 2,
          background: "linear-gradient(90deg, transparent, #6366f1, transparent)",
          margin: "10px auto 0"
        }} />
      </div>

      {/* Course Name */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginTop: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#6366f1", letterSpacing: 1 }}>
          {moduleName} — AI Professional Certification
        </div>
        <div style={{ fontSize: 10, color: "#7878aa", marginTop: 8, padding: "0 100px", lineHeight: 1.7 }}>
          This credential certifies professional-level competency in applied artificial intelligence, prompt engineering,
          practical tool mastery, and real-world AI integration as evaluated by the Leamind Academy curriculum.
        </div>
      </div>

      {/* Divider */}
      <div style={{
        position: "relative", zIndex: 10,
        margin: "18px 40px 0", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.4), transparent)"
      }} />

      {/* Footer: 3 columns */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "flex-start",
        padding: "14px 60px 0", gap: 0,
      }}>
        {/* Col 1: Date */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#d4a017", fontWeight: 700, marginBottom: 6 }}>DATE OF AWARD</div>
          <div style={{ width: 120, height: 1, background: "#d4a017", marginBottom: 6 }} />
          <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 600 }}>{date}</div>
        </div>

        {/* Col 2: Verification ID (center) */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#d4a017", fontWeight: 700, marginBottom: 6 }}>VERIFICATION ID</div>
          <div style={{ width: 120, height: 1, background: "#d4a017", margin: "0 auto 6px" }} />
          <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 700, fontFamily: "monospace" }}>{certId}</div>
        </div>

        {/* Col 3: Authorized By */}
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#d4a017", fontWeight: 700, marginBottom: 6 }}>AUTHORIZED BY</div>
          <div style={{ width: 120, height: 1, background: "#d4a017", marginLeft: "auto", marginBottom: 6 }} />
          <div style={{ fontSize: 13, color: "#ffffff", fontWeight: 600 }}>Leamind Academy</div>
          <div style={{ fontSize: 10, color: "#6366f1", marginTop: 2 }}>leamindai.com</div>
        </div>
      </div>

      {/* Seal bottom-right */}
      <div style={{
        position: "absolute", bottom: 36, right: 48, zIndex: 10,
        width: 80, height: 80, borderRadius: "50%",
        border: "3px solid #d4a017",
        background: "radial-gradient(circle, #1a1a4a, #0d0d2b)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 20px rgba(212,160,23,0.3)"
      }}>
        <div style={{ fontSize: 7, letterSpacing: 2, color: "#d4a017", fontWeight: 700 }}>CERTIFIED</div>
        <div style={{ fontSize: 9, letterSpacing: 1, color: "#ffffff", fontWeight: 900, marginTop: 2 }}>AI</div>
        <div style={{ fontSize: 7, letterSpacing: 2, color: "#d4a017", fontWeight: 700 }}>PROFESSIONAL</div>
      </div>

      {/* Footer fine print */}
      <div style={{
        position: "absolute", bottom: 22, left: 0, right: 0, zIndex: 10,
        textAlign: "center", fontSize: 8, color: "rgba(120,120,160,0.7)", padding: "0 80px"
      }}>
        This certificate is digitally issued by Leamind Academy. Verify at leamindai.com using the Verification ID.
      </div>
    </div>
  );
}

export default function CertificateDownload({ moduleName, open, onClose, prefillName = "", allLessonsCompleted = true }) {
  // Keep a stable reference to the module name that was active when the modal opened
  const [stableModuleName, setStableModuleName] = React.useState(moduleName);
  useEffect(() => {
    if (open && moduleName) setStableModuleName(moduleName);
  }, [open, moduleName]);
  const [name, setName] = useState(prefillName);
  const [generating, setGenerating] = useState(false);
  const certRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      setScale(Math.min(1, w / 900));
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [open]);
  const certId = useMemo(() => generateCertId(), [stableModuleName]);
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const hours = COURSE_HOURS[stableModuleName] || "5 hours";

  useEffect(() => { if (prefillName) setName(prefillName); }, [prefillName]);

  if (!open) return null;

  if (!allLessonsCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-8 py-7 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white/50" />
            </div>
            <h2 className="text-xl font-bold text-white">Certificate Locked</h2>
            <p className="text-white/60 text-sm mt-1">Complete all lessons in <span className="text-white font-semibold">{stableModuleName}</span> to unlock your certificate.</p>
          </div>
          <div className="px-8 py-6">
            <Button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700">Continue Learning</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!name.trim()) return;
    setGenerating(true);
    try {
      // Create a full-size off-screen container so html2canvas captures at full resolution
      const offscreen = document.createElement("div");
      offscreen.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:900px;height:636px;z-index:-1;";
      document.body.appendChild(offscreen);

      const { createRoot } = await import("react-dom/client");
      const root = createRoot(offscreen);

      await new Promise(resolve => {
        root.render(
          React.createElement(CertificateCanvas, { name: name.trim(), moduleName: stableModuleName, certId, date, hours }),
        );
        // Wait for render + any image loads
        setTimeout(resolve, 800);
      });

      const canvas = await html2canvas(offscreen.firstChild, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#0d0d2b",
        logging: false,
        width: 900,
        height: 636,
      });

      root.unmount();
      document.body.removeChild(offscreen);

      const imgData = canvas.toDataURL("image/png");
      // A4 landscape in mm: 297 x 210
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`Leamind_Certificate_${stableModuleName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Certificate generation failed:", err);
      alert("Download failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#12123a] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-yellow-600/30">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Leamind" className="h-9 w-9 rounded-xl object-cover" />
            <div>
              <span className="font-extrabold text-white text-base">Leamind Academy</span>
              <p className="text-[10px] text-indigo-300">Certificate of Completion</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* Certificate Preview */}
        <div ref={containerRef} className="p-4 md:p-6 w-full" style={{ overflow: 'hidden' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 900, height: 636, marginBottom: `${Math.round(636 * (scale - 1))}px` }}>
            <div ref={certRef}>
              <CertificateCanvas
                name={name.trim() || "Your Name"}
                moduleName={stableModuleName}
                certId={certId}
                date={date}
                hours={hours}
              />
            </div>
          </div>
        </div>

        {/* Name input & download */}
        <div className="px-8 py-5 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-end pb-safe">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Full Name on Certificate <span className="text-yellow-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleDownload()}
              placeholder="e.g. Sarah Johnson"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button
            onClick={handleDownload}
            disabled={!name.trim() || generating}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold gap-2 px-8 py-6 rounded-xl shrink-0"
          >
            <Download className="w-4 h-4" />
            {generating ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
}