import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Wifi, Battery, MapPin, MoreVertical } from "lucide-react";

const Bots = () => {
  const devices = [
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
          {devices.map((device) => (
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
                  disabled={device.status === "offline"}
                >
                  Control
                </Button>
                <Button variant="outline" className="flex-1">
                  Details
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
      </div>
    </DashboardLayout>
  );
};

export default Bots;
