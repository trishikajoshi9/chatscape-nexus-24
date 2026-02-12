import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatPanel from "../components/ChatPanel";
import CodePreview from "../components/CodePreview";
import SettingsModal from "../components/SettingsModal";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [model, setModel] = useState("llama3.2");

  return (
    <div className="flex h-screen bg-background overflow-hidden grid-bg">
      {/* Sidebar */}
      <Sidebar onSettingsClick={() => setSettingsOpen(true)} />

      {/* Chat Panel */}
      <div className="w-[400px] border-r border-border shrink-0">
        <ChatPanel ollamaUrl={ollamaUrl} model={model} />
      </div>

      {/* Code Preview */}
      <div className="flex-1 min-w-0">
        <CodePreview />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        ollamaUrl={ollamaUrl}
        setOllamaUrl={setOllamaUrl}
        model={model}
        setModel={setModel}
      />
    </div>
  );
};

export default Index;
