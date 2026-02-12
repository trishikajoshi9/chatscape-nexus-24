import { useState } from "react";
import { X, Server, Cpu, Save } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;
  model: string;
  setModel: (model: string) => void;
}

const models = ["llama3.2", "llama3.1", "llama3", "codellama", "mistral", "deepseek-coder", "phi3", "gemma2"];

const SettingsModal = ({ open, onClose, ollamaUrl, setOllamaUrl, model, setModel }: SettingsModalProps) => {
  const [tempUrl, setTempUrl] = useState(ollamaUrl);
  const [tempModel, setTempModel] = useState(model);

  if (!open) return null;

  const handleSave = () => {
    setOllamaUrl(tempUrl);
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
            SETTINGS
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Ollama URL */}
          <div className="space-y-2">
            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              Ollama Server URL
            </label>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="http://localhost:11434"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {models.map((m) => (
                <button
                  key={m}
                  onClick={() => setTempModel(m)}
                  className={`px-3 py-2 rounded-lg text-xs font-mono transition-all border ${
                    tempModel === m
                      ? "bg-primary/15 border-primary/30 text-primary border-glow"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tempModel}
              onChange={(e) => setTempModel(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Custom model name..."
            />
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
