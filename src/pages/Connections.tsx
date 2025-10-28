import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wifi, Usb, Terminal, Play } from "lucide-react";

const Connections = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Connections
          </h1>
          <p className="text-muted-foreground">
            Connect to devices via ADB over WiFi or USB
          </p>
        </div>

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
                  defaultValue="5555"
                  className="bg-input border-border text-foreground mt-2"
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
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
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Scan USB Devices
              </Button>
            </div>
          </Card>
        </div>

        {/* Connected Devices */}
        <Card className="p-6 bg-card border-border mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Active ADB Connections
          </h2>
          <div className="space-y-3">
            {[
              {
                device: "Samsung Galaxy S21",
                ip: "192.168.1.100:5555",
                method: "WiFi",
                status: "Connected",
              },
              {
                device: "Xiaomi Redmi Note 10",
                ip: "192.168.1.101:5555",
                method: "WiFi",
                status: "Connected",
              },
            ].map((device, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded bg-primary/10">
                    {device.method === "WiFi" ? (
                      <Wifi className="w-5 h-5 text-primary" />
                    ) : (
                      <Usb className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {device.device}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {device.ip}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary text-primary-foreground">
                    {device.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
                className="bg-input border-border text-foreground mt-2 font-mono"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Play className="w-4 h-4 mr-2" />
              Execute
            </Button>
            <div className="p-4 rounded-lg bg-muted/30 border border-border min-h-[200px] font-mono text-sm text-foreground">
              <p className="text-muted-foreground">Command output will appear here...</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Connections;
