"use client";
import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, ChevronRight } from "lucide-react";

export function GuidedTerminal({ 
  onCommand, 
  output 
}: { 
  onCommand: (cmd: string) => void, 
  output: string[]
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  // Maintain focus on the input
  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim().toLowerCase());
      setInput("");
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-zinc-500" />
          <span className="font-mono text-[10px] font-medium tracking-tight text-zinc-400">
            SECURE_SHELL // PROD_SERVER_04
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
          <div className="h-2 w-2 rounded-full bg-zinc-700" />
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-zinc-300 selection:bg-emerald-500/30"
      >
        <div className="space-y-1">
          {output.map((line, i) => {
            const isCommand = line.startsWith(">");
            const isError = line.includes("[ERROR]") || line.includes("CRITICAL");
            const isSuccess = line.includes("Success") || line.includes("complete");
            
            return (
              <div 
                key={i} 
                className={`
                  ${isCommand ? "text-emerald-500 font-bold" : ""}
                  ${isError ? "text-red-400" : ""}
                  ${isSuccess ? "text-emerald-400" : ""}
                  ${!isCommand && !isError && !isSuccess ? "opacity-90" : ""}
                `}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Input Prompt */}
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-zinc-800 bg-black/40 px-4 py-3"
      >
        <span className="flex items-center text-emerald-500">
          <ChevronRight size={14} strokeWidth={3} />
        </span>
        <input
          ref={inputRef}
          autoFocus
          className="flex-1 bg-transparent font-mono text-[11px] text-zinc-100 outline-none placeholder:text-zinc-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command (e.g., 'help')..."
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      
      {/* Decorative Scanline */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
}
