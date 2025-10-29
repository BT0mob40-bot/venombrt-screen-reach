import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Coins, Copy, Timer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const pkg = location.state?.package;
  
  const [cryptoAddresses, setCryptoAddresses] = useState<any[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (!pkg) {
      navigate("/dashboard/pricing");
      return;
    }
    fetchCryptoAddresses();
    createPayment();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchCryptoAddresses = async () => {
    const { data } = await supabase
      .from("crypto_addresses")
      .select("*")
      .eq("is_active", true);
    setCryptoAddresses(data || []);
    if (data && data.length > 0) {
      setSelectedCrypto(data[0]);
    }
  };

  const createPayment = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !pkg) return;

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    const { data, error } = await supabase.from("payments").insert({
      user_id: user.id,
      package_id: pkg.id,
      crypto_address_id: cryptoAddresses[0]?.id,
      amount: pkg.price,
      expires_at: expiresAt.toISOString(),
    }).select().single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setPaymentId(data.id);
  };

  const confirmPayment = async () => {
    if (!paymentId) return;

    const { error } = await supabase
      .from("payments")
      .update({ status: "confirmed" })
      .eq("id", paymentId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Payment Submitted",
      description: "Your payment will be verified by an administrator",
    });
    navigate("/dashboard");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Address copied to clipboard" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!pkg) return null;

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-muted-foreground">
            Send payment to the address below
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {pkg.name}
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  ${pkg.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  {pkg.duration_days} days
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Select Cryptocurrency
              </h3>
              <div className="flex items-center gap-2 text-primary">
                <Timer className="w-5 h-5" />
                <span className="font-mono font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <Select
              value={selectedCrypto?.id}
              onValueChange={(id) =>
                setSelectedCrypto(cryptoAddresses.find((c) => c.id === id))
              }
            >
              <SelectTrigger className="mb-6">
                <SelectValue placeholder="Choose crypto" />
              </SelectTrigger>
              <SelectContent>
                {cryptoAddresses.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id}>
                    {crypto.coin} - {crypto.network}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCrypto && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 bg-background rounded-lg">
                    <QRCodeSVG
                      value={selectedCrypto.address}
                      size={200}
                      level="H"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Wallet Address
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-muted/30 rounded font-mono text-sm break-all">
                      {selectedCrypto.address}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(selectedCrypto.address)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Important:</strong> Send exactly ${pkg.price} worth
                    of {selectedCrypto.coin} to the address above. After
                    sending, click "I Have Paid" below.
                  </p>
                </div>

                <Button
                  onClick={confirmPayment}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  I Have Paid
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
