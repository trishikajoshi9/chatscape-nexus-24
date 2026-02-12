import { useState } from "react";
import {
  MessageSquare,
  Code2,
  FolderOpen,
  Settings,
  Zap,
  Layers,
  GitBranch,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  onSettingsClick: () => void;
}

const navItems = [
  { icon: MessageSquare, label: "Chat", id: "chat" },
  { icon: Code2, label: "Code", id: "code" },
  { icon: FolderOpen, label: "Files", id: "files" },
  { icon: Layers, label: "Components", id: "components" },
  { icon: Database, label: "Database", id: "database" },
  { icon: GitBranch, label: "Version", id: "version" },
];

const Sidebar = ({ onSettingsClick }: SidebarProps) => {
  const [active, setActive] = useState("chat");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`flex flex-col h-full glass-panel border-r border-border transition-all duration-300 ${
        collapsed ? "w-14" : "w-52"
      }`}
    >
      {/* Logo */}
      <div className="p-3 border-b border-border flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 animate-pulse-glow">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-slide-in-left">
            <h1 className="font-display text-sm font-bold neon-gradient-text">
              TRITEC
            </h1>
            <p className="text-[9px] text-muted-foreground font-mono tracking-widest">
              PLATFORM
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-200 group ${
                active === item.id
                  ? "bg-primary/15 text-primary border border-primary/20 border-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active === item.id ? "text-primary" : ""}`} />
              {!collapsed && (
                <span className="font-body font-medium truncate">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-border space-y-1">
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-body">Settings</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
