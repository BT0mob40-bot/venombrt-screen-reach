import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Smartphone,
  Monitor,
  Terminal,
  Wifi,
  FileText,
  Settings,
  LogOut,
  Shield,
  Activity,
  Command,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useRole();

  const navItems = [
    { icon: Activity, label: "Dashboard", path: "/dashboard" },
    { icon: Smartphone, label: "Bots", path: "/dashboard/bots" },
    { icon: Command, label: "Builder", path: "/dashboard/builder" },
    { icon: Package, label: "Pricing", path: "/dashboard/pricing" },
    { icon: Command, label: "Commands", path: "/dashboard/commands" },
    { icon: Wifi, label: "Connections", path: "/dashboard/connections" },
    { icon: Shield, label: "Servers", path: "/dashboard/servers" },
    { icon: Terminal, label: "Injection", path: "/dashboard/injection" },
    { icon: FileText, label: "Logs", path: "/dashboard/logs" },
    { icon: FileText, label: "File Manager", path: "/dashboard/files" },
    { icon: Terminal, label: "Terminal", path: "/dashboard/terminal" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    { icon: Shield, label: "Admin", path: "/dashboard/admin", adminOnly: true },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "See you soon!",
    });
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-sidebar-foreground">
                VENOM<span className="text-primary">BRT</span>
              </h2>
              <p className="text-xs text-muted-foreground">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            if ((item as any).adminOnly && !isAdmin) return null;
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-sidebar-accent text-primary font-semibold shadow-glow-red"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent/50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
