import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: websiteName } = useQuery({
    queryKey: ["website-name"],
    queryFn: async () => {
      const { data } = await supabase
        .from("settings_global")
        .select("value")
        .eq("key", "website_name")
        .single();
      return data?.value || "VenomRAT";
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/dashboard");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: `Successfully logged in to ${websiteName || "VenomRAT"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-xl bg-primary/10 shadow-glow-red">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {websiteName || "VenomRAT"}
          </h1>
          <p className="text-muted-foreground">
            Android Remote Control Platform
          </p>
        </div>

        <Card className="p-8 bg-card border-border shadow-glow-red">
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-foreground flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="bg-input border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-input border-border text-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? "Please wait..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Contact your administrator for account access
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
