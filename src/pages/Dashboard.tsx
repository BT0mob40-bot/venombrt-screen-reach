import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Activity, Smartphone, Zap, Globe, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";

const Dashboard = () => {
  const [features, setFeatures] = useState<any[]>([]);
  const [featuresSectionName, setFeaturesSectionName] = useState("Platform Features");
  const [telegramHandle, setTelegramHandle] = useState("");

  useEffect(() => {
    fetchFeatures();
    fetchGlobalSettings();
  }, []);

  const fetchFeatures = async () => {
    const { data } = await supabase
      .from("features")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (data) setFeatures(data);
  };

  const fetchGlobalSettings = async () => {
    const { data } = await supabase
      .from("settings_global")
      .select("*")
      .in("key", ["features_section_name", "telegram_handle"]);
    
    if (data) {
      const featureName = data.find(s => s.key === "features_section_name")?.value;
      const telegram = data.find(s => s.key === "telegram_handle")?.value;
      if (featureName) setFeaturesSectionName(featureName);
      if (telegram) setTelegramHandle(telegram);
    }
  };

  const stats = [
    {
      icon: Smartphone,
      label: "Connected Bots",
      value: "12",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Activity,
      label: "Active Sessions",
      value: "3",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Zap,
      label: "Commands Executed",
      value: "1,247",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Globe,
      label: "Network Status",
      value: "Online",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to VenomBRT
          </h1>
          <p className="text-muted-foreground">
            Monitor and control your Android devices remotely
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Dynamic Features Section */}
        {features.length > 0 && (
          <Card className="p-6 bg-card border-border mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {featuresSectionName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => {
                const IconComponent = (Icons as any)[feature.icon] || Zap;
                return (
                  <div
                    key={feature.id}
                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Support Section */}
        {telegramHandle && (
          <Card className="p-6 bg-card border-border mb-8">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Need Support?
              </h2>
            </div>
            <p className="text-muted-foreground">
              Contact us on Telegram: <span className="text-primary font-medium">{telegramHandle}</span>
            </p>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                device: "Samsung Galaxy S21",
                action: "SMS Command Executed",
                time: "2 minutes ago",
              },
              {
                device: "Xiaomi Redmi Note 10",
                action: "VNC Session Started",
                time: "15 minutes ago",
              },
              {
                device: "OnePlus 9 Pro",
                action: "File Downloaded",
                time: "1 hour ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {activity.device}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
