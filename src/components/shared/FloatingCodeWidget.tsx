import { useState, useEffect } from "react";
import { Code2, X, Minus } from "lucide-react";

const codeSnippets = [
  `// API Integration
const api = new JLApi({
  endpoint: "api.javalab.co",
  auth: "bearer"
});
await api.connect();`,
  `// Payment Gateway
const payment = await gateway.process({
  amount: 299.99,
  method: "card",
  currency: "USD"
});`,
  `// Database Query
const users = await db.query(\`
  SELECT * FROM customers
  WHERE status = 'active'
\`);`,
  `// WebSocket Sync
socket.on("update", (data) => {
  updateInventory(data);
  notifyDashboard();
});`,
];

const FloatingCodeWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    // Auto-open after 3 seconds
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen || isMinimized) return;

    const currentCode = codeSnippets[currentSnippetIndex];

    if (isTyping) {
      if (displayedCode.length < currentCode.length) {
        const timeout = setTimeout(() => {
          setDisplayedCode(currentCode.slice(0, displayedCode.length + 1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2500);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setDisplayedCode("");
        setCurrentSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsTyping(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [displayedCode, isTyping, currentSnippetIndex, isOpen, isMinimized]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-40 p-3 rounded-full bg-[#0d1117] border border-gray-700 hover:border-cyan-500/50 shadow-lg transition-all hover:scale-110 group"
        aria-label="Show code"
      >
        <Code2 className="w-5 h-5 text-cyan-400" />
        <span className="absolute left-full ml-2 px-2 py-1 bg-[#0d1117] border border-gray-700 rounded text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          View Live Code
        </span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 left-4 z-40 flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d1117] border border-gray-700 hover:border-cyan-500/50 shadow-lg transition-all"
      >
        <Code2 className="w-4 h-4 text-cyan-400" />
        <span className="text-xs text-gray-400">Code</span>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 z-40 w-72 animate-fade-in">
      <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Window Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#161b22] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-[10px] text-gray-500 font-mono">javalab.ts</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <Minus className="w-3 h-3 text-gray-500" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-3 min-h-[140px] font-mono text-[11px] leading-relaxed">
          <pre className="text-gray-300 whitespace-pre-wrap">
            {displayedCode.split('\n').map((line, i) => (
              <div key={i}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(/\/\/.*/g, '<span class="text-gray-500">$&</span>')
                      .replace(/"[^"]*"/g, '<span class="text-cyan-300">$&</span>')
                      .replace(/`[^`]*`/g, '<span class="text-cyan-300">$&</span>')
                      .replace(/\b(const|let|var|await|new|async|function|return)\b/g, '<span class="text-pink-400">$&</span>')
                      .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-blue-400">$&</span>')
                      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$&</span>')
                  }}
                />
              </div>
            ))}
            <span className="inline-block w-1.5 h-4 bg-cyan-400 animate-pulse ml-0.5" />
          </pre>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#161b22] border-t border-gray-800 text-[9px] text-gray-500">
          <span>TypeScript</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </div>
  );
};

export default FloatingCodeWidget;