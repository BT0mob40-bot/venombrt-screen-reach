import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Maximize, Volume2, Power, RotateCw } from "lucide-react";

const VNCViewer = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            VNC Remote Viewer
          </h1>
          <p className="text-muted-foreground">
            Live screen mirroring and remote control
          </p>
        </div>

        {/* VNC Screen */}
        <Card className="p-6 bg-card border-border">
          {/* Control Bar */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                Samsung Galaxy S21
              </span>
              <span className="text-sm text-muted-foreground">
                • 192.168.1.100
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Maximize className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon">
                <Power className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Screen Display Area */}
          <div className="relative bg-muted/30 rounded-lg overflow-hidden aspect-[9/16] max-w-md mx-auto border-2 border-border">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  No active VNC session
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a device from the Bots page to start streaming
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Connect to Device
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">30</p>
              <p className="text-sm text-muted-foreground">FPS</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">45</p>
              <p className="text-sm text-muted-foreground">Latency (ms)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">1080p</p>
              <p className="text-sm text-muted-foreground">Resolution</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">5.2</p>
              <p className="text-sm text-muted-foreground">Mbps</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VNCViewer;
