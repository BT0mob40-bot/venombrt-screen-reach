import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [telegramToken, setTelegramToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setTelegramToken(data.telegram_token || "");
      setTelegramChatId(data.telegram_chat_id || "");
      setNotificationsEnabled(data.notifications_enabled || false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("settings")
      .upsert({
        user_id: user.id,
        telegram_token: telegramToken,
        telegram_chat_id: telegramChatId,
        notifications_enabled: notificationsEnabled,
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    }

    setLoading(false);
  };

  const testTelegram = async () => {
    if (!telegramToken || !telegramChatId) {
      toast({
        title: "Error",
        description: "Please enter Telegram token and chat ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: "🔔 VenomBRT Test Notification\n\nTelegram integration is working!",
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Test message sent to Telegram",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test message",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure notifications and integrations
          </p>
        </div>

        {/* Telegram Integration */}
        <Card className="p-6 bg-card border-border mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Telegram Integration
              </h2>
              <p className="text-sm text-muted-foreground">
                Receive notifications and logs via Telegram
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="telegram-token" className="text-foreground">
                Bot Token
              </Label>
              <Input
                id="telegram-token"
                type="password"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                className="bg-input border-border text-foreground mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your bot token from @BotFather on Telegram
              </p>
            </div>

            <div>
              <Label htmlFor="telegram-chat-id" className="text-foreground">
                Chat ID
              </Label>
              <Input
                id="telegram-chat-id"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="123456789"
                className="bg-input border-border text-foreground mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your chat ID from @userinfobot
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
              <div>
                <p className="font-medium text-foreground">
                  Enable Notifications
                </p>
                <p className="text-sm text-muted-foreground">
                  Receive bot alerts and logs
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={saveSettings}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
              <Button variant="outline" onClick={testTelegram}>
                <Send className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
