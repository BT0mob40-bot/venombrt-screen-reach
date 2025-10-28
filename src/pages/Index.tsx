import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("venombrt_auth");
    if (isAuth) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="text-center relative z-10 px-4">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Shield className="w-24 h-24 text-primary animate-pulse-glow" />
            <Smartphone className="w-12 h-12 text-primary absolute -bottom-2 -right-2" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-foreground mb-4 tracking-tight">
          VENOM<span className="text-primary">BRT</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Advanced Android Remote Administration Tool
          <br />
          Control, Monitor & Manage Android Devices Remotely
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => navigate("/auth")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 shadow-glow-red hover:shadow-glow-red-strong transition-all duration-300"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg bg-card border border-border">
            <Smartphone className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Remote Control</h3>
            <p className="text-sm text-muted-foreground">
              Full VNC access and device control
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Live Commands</h3>
            <p className="text-sm text-muted-foreground">
              Execute commands in real-time
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Secure</h3>
            <p className="text-sm text-muted-foreground">
              Encrypted connections and authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
