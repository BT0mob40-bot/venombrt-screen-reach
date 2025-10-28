import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Server, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Servers = () => {
  const [servers, setServers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    const { data, error } = await supabase
      .from("servers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch servers",
        variant: "destructive",
      });
      return;
    }

    setServers(data || []);
  };

  const addServer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("servers").insert({
      user_id: user.id,
      name,
      url,
      type: "webhook",
      status: "active",
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
        description: "Server added successfully",
      });
      setName("");
      setUrl("");
      fetchServers();
    }

    setLoading(false);
  };

  const deleteServer = async (id: string) => {
    const { error } = await supabase.from("servers").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Server deleted",
      });
      fetchServers();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Servers
          </h1>
          <p className="text-muted-foreground">
            Manage webhook servers and notification endpoints
          </p>
        </div>

        {/* Add Server Form */}
        <Card className="p-6 bg-card border-border mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Add New Server
            </h2>
          </div>
          <form onSubmit={addServer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Server Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Webhook Server"
                  required
                  className="bg-input border-border text-foreground mt-2"
                />
              </div>
              <div>
                <Label htmlFor="url" className="text-foreground">
                  Server URL
                </Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/webhook"
                  required
                  className="bg-input border-border text-foreground mt-2"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Server
            </Button>
          </form>
        </Card>

        {/* Servers List */}
        <div className="space-y-4">
          {servers.map((server) => (
            <Card key={server.id} className="p-6 bg-card border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {server.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      {server.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      server.status === "active"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {server.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteServer(server.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Servers;
