import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wifi, Usb, Terminal, Play, Download, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Connections = () => {
  const { toast } = useToast();
  const [bots, setBots] = useState<any[]>([]);
  const [selectedBot, setSelectedBot] = useState<string>("");
  const [wifiIp, setWifiIp] = useState("");
  const [wifiPort, setWifiPort] = useState("5555");
  const [adbCommand, setAdbCommand] = useState("");
  const [commandOutput, setCommandOutput] = useState("");
  const [extractionPlatform, setExtractionPlatform] = useState<string>("android");

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    const { data } = await supabase
      .from("bots")
      .select("*")
      .eq("status", "online");
    if (data) setBots(data);
  };

  const handleWifiConnect = async () => {
    if (!selectedBot || !wifiIp) {
      toast({
        title: "Missing Information",
        description: "Please select a bot and enter IP address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Connecting...",
      description: `Connecting to ${wifiIp}:${wifiPort}`,
    });

    // Simulate connection
    setTimeout(() => {
      toast({
        title: "Connected",
        description: "WiFi ADB connection established",
      });
    }, 1500);
  };

  const handleUsbScan = async () => {
    if (!selectedBot) {
      toast({
        title: "No Bot Selected",
        description: "Please select a bot first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Scanning...",
      description: "Looking for USB devices",
    });

    setTimeout(() => {
      toast({
        title: "Scan Complete",
        description: "No USB devices found",
      });
    }, 1500);
  };

  const handleExecuteCommand = async () => {
    if (!selectedBot || !adbCommand) {
      toast({
        title: "Missing Information",
        description: "Please select a bot and enter a command",
        variant: "destructive",
      });
      return;
    }

    setCommandOutput("Executing command...\n");
    
    // Simulate command execution
    setTimeout(() => {
      setCommandOutput(`$ ${adbCommand}\n\nCommand executed successfully on ${selectedBot}\nOutput: [simulated response]`);
      toast({
        title: "Command Executed",
        description: "Check output below",
      });
    }, 1000);
  };

  const handlePhoneExtraction = async () => {
    if (!selectedBot) {
      toast({
        title: "No Bot Selected",
        description: "Please select a bot first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Starting Extraction",
      description: `Extracting data from ${extractionPlatform} device...`,
    });

    setTimeout(() => {
      toast({
        title: "Extraction Complete",
        description: "Data has been extracted successfully",
      });
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Device Connections
          </h1>
          <p className="text-muted-foreground">
            Connect and manage devices via ADB
          </p>
        </div>

        {/* Bot Selection */}
        <Card className="p-6 bg-card border-border mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Select Bot Device
            </h2>
          </div>
          <Select value={selectedBot} onValueChange={setSelectedBot}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Choose a bot to connect" />
            </SelectTrigger>
            <SelectContent>
              {bots.map((bot) => (
                <SelectItem key={bot.id} value={bot.id}>
                  {bot.name} - {bot.model} ({bot.os})
                </SelectItem>
              ))}
              {bots.length === 0 && (
                <SelectItem value="none" disabled>
                  No online bots available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </Card>

        {/* Connection Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* WiFi ADB */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Wifi className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  WiFi Debugging
                </h2>
                <p className="text-sm text-muted-foreground">
                  Connect via network
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="wifi-ip" className="text-foreground">
                  Device IP Address
                </Label>
                <Input
                  id="wifi-ip"
                  placeholder="192.168.1.100"
                  value={wifiIp}
                  onChange={(e) => setWifiIp(e.target.value)}
                  className="bg-input border-border text-foreground mt-2"
                />
              </div>
              <div>
                <Label htmlFor="wifi-port" className="text-foreground">
                  ADB Port
                </Label>
                <Input
                  id="wifi-port"
                  placeholder="5555"
                  value={wifiPort}
                  onChange={(e) => setWifiPort(e.target.value)}
                  className="bg-input border-border text-foreground mt-2"
                />
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleWifiConnect}
                disabled={!selectedBot}
              >
                Connect via WiFi
              </Button>
            </div>
          </Card>

          {/* USB ADB */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Usb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  USB Debugging
                </h2>
                <p className="text-sm text-muted-foreground">
                  Connect via USB cable
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  USB Connection Status
                </p>
                <Badge variant="secondary">Not Connected</Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Enable USB debugging on device</p>
                <p>2. Connect device via USB cable</p>
                <p>3. Authorize debugging on device</p>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleUsbScan}
                disabled={!selectedBot}
              >
                Scan USB Devices
              </Button>
            </div>
          </Card>
        </div>

        {/* Phone Extraction */}
        <Card className="p-6 bg-card border-border mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Phone Data Extraction
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-foreground mb-2 block">Select Platform</Label>
              <Select value={extractionPlatform} onValueChange={setExtractionPlatform}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex items-end">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handlePhoneExtraction}
                disabled={!selectedBot}
              >
                <Download className="w-4 h-4 mr-2" />
                Extract Phone Data
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Extracts contacts, SMS, call logs, photos, and more from the selected device
          </p>
        </Card>

        {/* ADB Commands */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Execute ADB Command
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adb-command" className="text-foreground">
                Command
              </Label>
              <Input
                id="adb-command"
                placeholder="adb shell pm list packages"
                value={adbCommand}
                onChange={(e) => setAdbCommand(e.target.value)}
                className="bg-input border-border text-foreground mt-2 font-mono"
              />
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleExecuteCommand}
              disabled={!selectedBot}
            >
              <Play className="w-4 h-4 mr-2" />
              Execute
            </Button>
            <div className="p-4 rounded-lg bg-muted/30 border border-border min-h-[200px] font-mono text-sm text-foreground whitespace-pre-wrap">
              {commandOutput || "Command output will appear here..."}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Connections;
