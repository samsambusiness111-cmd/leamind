import React, { useState } from "react";
import { Wand2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const STYLE_PRESETS = [
  "Photorealistic", "Digital Art", "Oil Painting", "Anime", "3D Render", "Watercolor", "Cinematic", "Minimalist"
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setImageUrl(null);
    const fullPrompt = `${prompt.trim()}, ${style} style, high quality, detailed`;
    setImageUrl(result.url);
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Wand2 className="w-7 h-7 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">AI Image Creator</h2>
        <p className="text-sm text-slate-500 mt-1">Describe what you want to create</p>
      </div>

      {/* Style Selector */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Style</p>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                style === s
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-3 flex gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. A futuristic robot teaching AI to students in a glowing classroom..."
          rows={3}
          className="flex-1 resize-none text-sm px-2 py-1.5 focus:outline-none text-slate-800 placeholder-slate-400 bg-transparent"
        />
        <Button
          onClick={generate}
          disabled={!prompt.trim() || loading}
          className="bg-purple-600 hover:bg-purple-700 rounded-xl px-5 self-end shrink-0 gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Generate
        </Button>
      </div>

      {/* Result */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-sm text-slate-500">Creating your image...</p>
        </div>
      )}

      {imageUrl && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <img src={imageUrl} alt="Generated" className="w-full object-cover" />
          <div className="p-4 flex items-center justify-between">
            <p className="text-xs text-slate-500 truncate max-w-xs">{prompt}</p>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 shrink-0 ml-3"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}