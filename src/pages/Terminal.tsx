import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Terminal as TerminalIcon } from "lucide-react";

const Terminal = () => {
  const [history, setHistory] = useState<string[]>([
    "VenomBRT Terminal v1.0",
    "Type 'help' for available commands",
  ]);
  const [command, setCommand] = useState("");

  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newHistory = [...history, `$ ${command}`, "Command executed"];
    setHistory(newHistory);
    setCommand("");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Terminal
          </h1>
          <p className="text-muted-foreground">
            Execute shell commands on connected devices
          </p>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-4">
            <TerminalIcon className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Shell Terminal
            </h2>
          </div>

          <div className="bg-black/90 rounded-lg p-4 min-h-[500px] font-mono text-sm">
            <div className="space-y-2 mb-4">
              {history.map((line, idx) => (
                <div key={idx} className="text-green-400">
                  {line}
                </div>
              ))}
            </div>

            <form onSubmit={executeCommand} className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="bg-transparent border-none text-green-400 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
                placeholder="Enter command..."
              />
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Terminal;
