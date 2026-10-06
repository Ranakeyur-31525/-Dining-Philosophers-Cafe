// src/components/EventLogTerminal.jsx
// Monospace millisecond-precision event stream terminal

import React, { useRef, useEffect } from 'react';
import { Terminal, Download, Trash2 } from 'lucide-react';

export default function EventLogTerminal({
  logs = [],
  title = "POSIX Kernel & Runtime Event Log",
  onClear
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const exportLogs = () => {
    const text = logs.map(l => `[${l.time}] [${l.type?.toUpperCase()}] ${l.msg}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `os-dining-cafe-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#181311] border border-[#3A2F2B] rounded-2xl p-4 shadow-lg flex flex-col font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#3A2F2B]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-slate-300 font-bold ml-1 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-terracotta-container" />
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={exportLogs}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-[#2A211D] transition-colors"
            title="Download Log as TXT"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          {onClear && (
            <button
              onClick={onClear}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-[#2A211D] transition-colors"
              title="Clear Terminal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Console Output */}
      <div
        ref={scrollRef}
        className="h-44 overflow-y-auto space-y-1.5 pr-1 text-slate-300 scrollbar-thin scrollbar-thumb-[#3A2F2B]"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic py-2">No events recorded. Waiting for thread scheduler...</div>
        ) : (
          logs.map((log) => {
            const isFatal = log.type === 'fatal' || log.type === 'error';
            const isWarn = log.type === 'warn';
            const isSuccess = log.type === 'success';

            return (
              <div key={log.id} className="leading-relaxed flex items-start gap-2">
                <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
                <span
                  className={`shrink-0 font-bold ${
                    isFatal
                      ? 'text-red-400'
                      : isWarn
                        ? 'text-amber-400'
                        : isSuccess
                          ? 'text-emerald-400'
                          : 'text-blue-400'
                  }`}
                >
                  [{log.type?.toUpperCase() || 'INFO'}]
                </span>
                <span
                  className={
                    isFatal
                      ? 'text-red-300 font-semibold'
                      : isWarn
                        ? 'text-amber-200'
                        : isSuccess
                          ? 'text-emerald-200'
                          : 'text-slate-300'
                  }
                >
                  {log.msg}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
