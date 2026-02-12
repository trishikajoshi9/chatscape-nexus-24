import { useState } from "react";
import { Activity, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ChatPanel from "../components/ChatPanel";
import CodePreview from "../components/CodePreview";
import SettingsModal from "../components/SettingsModal";

const statusCards = [
  { label: "AI Quality", value: "Premium", icon: Sparkles },
  { label: "Safety", value: "Guarded", icon: ShieldCheck },
  { label: "Runtime", value: "Realtime", icon: Activity },
  { label: "Analysis", value: "Deep", icon: BrainCircuit },
];

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [model, setModel] = useState("google/gemini-3-flash-preview");

  return (
    <div className="flex h-screen bg-background overflow-hidden grid-bg">
      <Sidebar onSettingsClick={() => setSettingsOpen(true)} />
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="px-5 py-4 border-b border-border/70 glass-panel flex items-center gap-3">
          <div>
            <h1 className="font-display text-lg leading-tight text-foreground">TRITEC Studio</h1>
            <p className="text-xs text-muted-foreground font-mono">Design • Analyze • Generate</p>
          </div>
          <div className="ml-auto grid grid-cols-2 lg:grid-cols-4 gap-2">
            {statusCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="px-2.5 py-1.5 rounded-lg border border-border bg-card/70 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <div>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-wide">{card.label}</p>
                    <p className="text-[11px] font-semibold text-foreground">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        <div className="flex-1 min-h-0 flex">
          <div className="w-[420px] border-r border-border/70 shrink-0">
            <ChatPanel model={model} />
          </div>
          <div className="flex-1 min-w-0">
            <CodePreview />
          </div>
        </div>
      </main>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        model={model}
        setModel={setModel}
      />
    </div>
  );
};

export default Index;
