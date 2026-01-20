import { useState, useEffect } from "react";

const codeSnippets = [
  {
    title: "API Integration",
    code: `// Initialize API Connection
const api = new JavaLabAPI({
  endpoint: "https://api.javalab.co",
  version: "v2",
  auth: {
    type: "bearer",
    token: process.env.API_KEY
  }
});

// Fetch real-time data
const response = await api.get("/analytics");
console.log("✅ Connected successfully");`,
  },
  {
    title: "Payment Gateway",
    code: `// JL Payment Integration
import { PaymentGateway } from "@javalab/payments";

const gateway = new PaymentGateway({
  provider: "stripe",
  currency: "USD",
  webhooks: true
});

await gateway.processPayment({
  amount: 299.99,
  method: "card",
  customer: "cust_xyz123"
});`,
  },
  {
    title: "Database Query",
    code: `// Smart Database Operations
const db = await Database.connect({
  host: "cloud.javalab.co",
  ssl: true,
  pool: { min: 5, max: 20 }
});

const users = await db.query(\`
  SELECT * FROM customers
  WHERE status = 'active'
  ORDER BY created_at DESC
  LIMIT 100
\`);`,
  },
  {
    title: "Real-time Sync",
    code: `// WebSocket Real-time Sync
const socket = new JLSocket({
  channel: "inventory",
  reconnect: true
});

socket.on("update", (data) => {
  updateInventory(data);
  notifyStaff(data.changes);
  syncDashboard();
});

socket.connect();
console.log("🔄 Syncing in real-time...");`,
  },
];

const CodeTypingAnimation = () => {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentCode = codeSnippets[currentSnippetIndex].code;
    
    if (isTyping) {
      if (displayedCode.length < currentCode.length) {
        const timeout = setTimeout(() => {
          setDisplayedCode(currentCode.slice(0, displayedCode.length + 1));
        }, 20);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setDisplayedCode("");
        setCurrentSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [displayedCode, isTyping, currentSnippetIndex]);

  const currentSnippet = codeSnippets[currentSnippetIndex];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
              Powered by Innovation
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Clean Code,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Powerful Results
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our development team writes elegant, efficient code that powers your business. 
              From API integrations to real-time systems, we build technology that scales.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              {["APIs", "Databases", "Real-time", "Payments", "Cloud"].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-lg bg-background/50 border border-border text-sm text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Code Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-3xl opacity-30" />
            <div className="relative bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
                </div>
                <span className="text-xs text-[#8b949e] font-mono">{currentSnippet.title}</span>
                <div className="w-16" />
              </div>
              
              {/* Code Content */}
              <div className="p-6 min-h-[320px] font-mono text-sm">
                <pre className="text-[#c9d1d9] whitespace-pre-wrap">
                  {displayedCode.split('\n').map((line, i) => (
                    <div key={i} className="leading-relaxed">
                      <span className="text-[#6e7681] select-none mr-4">{String(i + 1).padStart(2, '0')}</span>
                      <span dangerouslySetInnerHTML={{
                        __html: line
                          .replace(/\/\/.*/g, '<span class="text-[#8b949e]">$&</span>')
                          .replace(/"[^"]*"/g, '<span class="text-[#a5d6ff]">$&</span>')
                          .replace(/`[^`]*`/g, '<span class="text-[#a5d6ff]">$&</span>')
                          .replace(/\b(const|let|var|import|from|await|new|async|function|return|if|else)\b/g, '<span class="text-[#ff7b72]">$&</span>')
                          .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-[#79c0ff]">$&</span>')
                          .replace(/\b(\d+)\b/g, '<span class="text-[#79c0ff]">$&</span>')
                          .replace(/console\.(log|error|warn)/g, '<span class="text-[#d2a8ff]">console.$1</span>')
                      }} />
                    </div>
                  ))}
                  <span className="inline-block w-2 h-5 bg-cyan-400 animate-pulse ml-1" />
                </pre>
              </div>
              
              {/* Status Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-t border-[#30363d] text-xs text-[#8b949e]">
                <span>TypeScript</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeTypingAnimation;