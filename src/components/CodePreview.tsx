import { useState } from "react";
import { Code2, FileCode, FolderOpen, Terminal, ChevronRight, File } from "lucide-react";

const mockFiles = [
  { name: "src", type: "folder" as const, children: [
    { name: "App.tsx", type: "file" as const, lang: "tsx" },
    { name: "main.tsx", type: "file" as const, lang: "tsx" },
    { name: "index.css", type: "file" as const, lang: "css" },
  ]},
  { name: "public", type: "folder" as const, children: [
    { name: "index.html", type: "file" as const, lang: "html" },
  ]},
  { name: "package.json", type: "file" as const, lang: "json" },
];

const sampleCode = `// ⚡ TRITEC Platform — Generated Code
import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <header className="neon-header">
        <h1>🎮 TRITEC Platform</h1>
        <p>Next-gen web development</p>
      </header>
      
      <main className="content">
        <button 
          onClick={() => setCount(c => c + 1)}
          className="neon-button"
        >
          Count: {count}
        </button>
      </main>
    </div>
  );
};

export default App;`;

const CodePreview = () => {
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "terminal">("code");
  const [selectedFile, setSelectedFile] = useState("App.tsx");

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center border-b border-border glass-panel">
        {(["code", "preview", "terminal"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-display uppercase tracking-wider transition-all border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary text-glow-cyan"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "code" && <Code2 className="w-3.5 h-3.5 inline mr-1.5" />}
            {tab === "preview" && <FileCode className="w-3.5 h-3.5 inline mr-1.5" />}
            {tab === "terminal" && <Terminal className="w-3.5 h-3.5 inline mr-1.5" />}
            {tab}
          </button>
        ))}
        <div className="ml-auto px-3">
          <span className="text-[10px] font-mono text-secondary text-glow-green">● LIVE</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        {activeTab === "code" && (
          <div className="w-48 border-r border-border bg-background/50 overflow-y-auto shrink-0">
            <div className="p-2">
              <p className="text-[10px] font-display uppercase text-muted-foreground tracking-wider px-2 py-1">
                Explorer
              </p>
              {mockFiles.map((item) => (
                <div key={item.name}>
                  {item.type === "folder" ? (
                    <>
                      <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                        <ChevronRight className="w-3 h-3" />
                        <FolderOpen className="w-3.5 h-3.5 text-primary" />
                        <span className="font-mono">{item.name}</span>
                      </div>
                      {item.children?.map((child) => (
                        <button
                          key={child.name}
                          onClick={() => setSelectedFile(child.name)}
                          className={`flex items-center gap-1.5 pl-7 pr-2 py-1 text-xs w-full text-left transition-colors ${
                            selectedFile === child.name
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          }`}
                        >
                          <File className="w-3 h-3" />
                          <span className="font-mono">{child.name}</span>
                        </button>
                      ))}
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedFile(item.name)}
                      className={`flex items-center gap-1.5 px-2 py-1 text-xs w-full text-left transition-colors ${
                        selectedFile === item.name
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      <File className="w-3 h-3" />
                      <span className="font-mono">{item.name}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {activeTab === "code" && (
            <div className="p-4">
              <div className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-primary" />
                {selectedFile}
              </div>
              <pre className="font-mono text-xs leading-relaxed">
                {sampleCode.split("\n").map((line, i) => (
                  <div key={i} className="flex hover:bg-muted/20 rounded px-1 -mx-1">
                    <span className="text-muted-foreground w-8 shrink-0 select-none text-right pr-3">
                      {i + 1}
                    </span>
                    <span className="text-foreground/90">{line}</span>
                  </div>
                ))}
              </pre>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center animate-float">
                  <Code2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground text-glow-cyan">
                  LIVE PREVIEW
                </h3>
                <p className="text-sm text-muted-foreground font-body max-w-xs">
                  Ask the AI to generate code and see real-time preview here
                </p>
              </div>
            </div>
          )}

          {activeTab === "terminal" && (
            <div className="p-4 font-mono text-xs space-y-1">
              <p className="text-secondary">$ ollama serve</p>
              <p className="text-muted-foreground">Ollama is running on http://localhost:11434</p>
              <p className="text-secondary mt-2">$ tritec dev</p>
              <p className="text-muted-foreground">⚡ TRITEC dev server started</p>
              <p className="text-muted-foreground">➜ Local: http://localhost:5173/</p>
              <p className="text-primary mt-2 animate-typing-cursor inline-block">▊</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
