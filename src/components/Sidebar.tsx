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
  Crown,
} from "lucide-react";

interface SidebarProps {
  onSettingsClick: () => void;
}

const navItems = [
  { icon: MessageSquare, label: "Chat", id: "chat" },
  { icon: Code2, label: "Builder", id: "code" },
  { icon: FolderOpen, label: "Workspace", id: "files" },
  { icon: Layers, label: "Components", id: "components" },
  { icon: Database, label: "Storage", id: "database" },
  { icon: GitBranch, label: "Versions", id: "version" },
];

const Sidebar = ({ onSettingsClick }: SidebarProps) => {
  const [active, setActive] = useState("chat");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-full glass-panel border-r border-border/70 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-border/70 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 animate-pulse-glow">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-slide-in-left">
            <h1 className="font-display text-sm font-bold neon-gradient-text">TRITEC NEXUS</h1>
            <p className="text-[10px] text-muted-foreground font-mono tracking-wide">Premium Workspace</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="mx-3 mt-3 rounded-xl border border-primary/30 bg-primary/10 p-2.5">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Plan</p>
          <div className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-primary" />
            <p className="font-semibold text-sm text-foreground">Professional</p>
          </div>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1.5 mt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                active === item.id
                  ? "bg-primary/15 text-primary border border-primary/20 border-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active === item.id ? "text-primary" : ""}`} />
              {!collapsed && <span className="font-body font-medium truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border/70 space-y-1.5">
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="font-body">Settings</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
