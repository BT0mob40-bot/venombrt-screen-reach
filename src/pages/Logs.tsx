import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Logs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("logs")
      .select(`
        *,
        bots (name, model)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch logs",
        variant: "destructive",
      });
      return;
    }

    setLogs(data || []);
  };

  const downloadLog = (log: any) => {
    const content = `
Command: ${log.command}
Status: ${log.status}
Bot: ${log.bots?.name} (${log.bots?.model})
Time: ${new Date(log.created_at).toLocaleString()}
Result: ${log.result || "No result"}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `log-${log.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearLogs = async () => {
    const { error } = await supabase.from("logs").delete().neq("id", "");

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "All logs cleared",
      });
      fetchLogs();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Command Logs
            </h1>
            <p className="text-muted-foreground">
              View and download bot command results
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearLogs}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Logs
          </Button>
        </div>

        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id} className="p-6 bg-card border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {log.command}
                      </h3>
                      <Badge
                        className={
                          log.status === "success"
                            ? "bg-primary text-primary-foreground"
                            : log.status === "pending"
                            ? "bg-muted text-muted-foreground"
                            : "bg-destructive text-destructive-foreground"
                        }
                      >
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Bot: {log.bots?.name} ({log.bots?.model})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                    {log.result && (
                      <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
                        <p className="text-xs font-mono text-foreground">
                          {log.result}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => downloadLog(log)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Logs;
