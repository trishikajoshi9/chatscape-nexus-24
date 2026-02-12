import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatPanel from "../components/ChatPanel";
import CodePreview from "../components/CodePreview";
import SettingsModal from "../components/SettingsModal";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [model, setModel] = useState("google/gemini-3-flash-preview");

  return (
    <div className="flex h-screen bg-background overflow-hidden grid-bg">
      <Sidebar onSettingsClick={() => setSettingsOpen(true)} />
      <div className="w-[400px] border-r border-border shrink-0">
        <ChatPanel model={model} />
      </div>
      <div className="flex-1 min-w-0">
        <CodePreview />
      </div>
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
