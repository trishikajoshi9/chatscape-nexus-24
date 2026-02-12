import { useState } from "react";
import { X, Cpu, Save, Sparkles } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  model: string;
  setModel: (model: string) => void;
}

const models = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash", desc: "Fast & capable" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", desc: "Balanced" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", desc: "Best reasoning" },
  { id: "google/gemini-3-pro-preview", label: "Gemini 3 Pro", desc: "Next-gen" },
  { id: "openai/gpt-5", label: "GPT-5", desc: "Powerful all-rounder" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini", desc: "Fast & smart" },
  { id: "openai/gpt-5-nano", label: "GPT-5 Nano", desc: "Ultra fast" },
  { id: "openai/gpt-5.2", label: "GPT-5.2", desc: "Latest & best" },
];

const SettingsModal = ({ open, onClose, model, setModel }: SettingsModalProps) => {
  const [tempModel, setTempModel] = useState(model);

  if (!open) return null;

  const handleSave = () => {
    setModel(tempModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel border border-border rounded-xl w-full max-w-md mx-4 animate-scale-in border-glow">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-sm font-bold text-foreground text-glow-cyan flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            AI MODEL SETTINGS
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Select AI Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTempModel(m.id)}
                  className={`px-3 py-2.5 rounded-lg text-left transition-all border ${
                    tempModel === m.id
                      ? "bg-primary/15 border-primary/30 text-primary border-glow"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <span className="text-xs font-mono block">{m.label}</span>
                  <span className="text-[10px] text-muted-foreground">{m.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-display uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-xs font-display uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all border-glow flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
