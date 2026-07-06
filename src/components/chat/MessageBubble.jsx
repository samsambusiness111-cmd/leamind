import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (message.role === "tool" || !message.content) return null;

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="h-7 w-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5 text-sm">
          🤖
        </div>
      )}
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2.5",
        isUser
          ? "bg-indigo-600 text-white"
          : "bg-white border border-slate-200 text-slate-800"
      )}>
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            className="text-sm prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            components={{
              p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
              ol: ({ children }) => <ol className="my-1 ml-4 list-decimal">{children}</ol>,
              li: ({ children }) => <li className="my-0.5">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
              code: ({ children }) => <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{children}</code>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}