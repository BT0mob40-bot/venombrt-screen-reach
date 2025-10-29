import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Check, Smartphone } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data } = await supabase
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("price", { ascending: true });
    setPackages(data || []);
  };

  const handlePurchase = (pkg: any) => {
    navigate("/dashboard/checkout", { state: { package: pkg } });
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground">
            Upgrade your account to unlock full features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pkg.description}
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary">
                  <Smartphone className="w-3 h-3 mr-1" />
                  {pkg.platform}
                </Badge>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">
                    ${pkg.price}
                  </span>
                  <span className="text-muted-foreground">
                    / {pkg.duration_days} days
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {pkg.features?.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handlePurchase(pkg)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Purchase Now
              </Button>
            </Card>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No packages available at the moment
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
