import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";
import { Wrench, Image, FileText, Link as LinkIcon, Smartphone } from "lucide-react";

const Builder = () => {
  const { isDemo } = useRole();
  const { toast } = useToast();
  const [payloadType, setPayloadType] = useState<"image" | "pdf" | "link" | "apk">("image");
  const [platform, setPlatform] = useState<"android" | "ios" | "both">("android");

  const buildPayload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isDemo) {
      toast({
        title: "Demo Mode",
        description: "Upgrade your account to build payloads",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from("payloads").insert({
      user_id: user?.id,
      name: formData.get("name"),
      type: payloadType,
      content: formData.get("content"),
      platform,
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Payload built successfully" });
    e.currentTarget.reset();
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            Payload Builder
          </h1>
          <p className="text-muted-foreground">
            Create custom payloads to send to connected devices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className={`p-6 cursor-pointer transition-all duration-300 ${
              payloadType === "image"
                ? "bg-primary/10 border-primary"
                : "bg-card border-border hover:border-primary/50"
            }`}
            onClick={() => setPayloadType("image")}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <Image className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">Image Payload</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate custom images (PNG format)
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all duration-300 ${
              payloadType === "pdf"
                ? "bg-primary/10 border-primary"
                : "bg-card border-border hover:border-primary/50"
            }`}
            onClick={() => setPayloadType("pdf")}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">PDF Payload</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create PDF documents
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all duration-300 ${
              payloadType === "link"
                ? "bg-primary/10 border-primary"
                : "bg-card border-border hover:border-primary/50"
            }`}
            onClick={() => setPayloadType("link")}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <LinkIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">Link Payload</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate custom links
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border">
          <form onSubmit={buildPayload} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-foreground">Payload Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter payload name"
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="platform" className="text-foreground flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Target Platform
              </Label>
              <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="both">Both Platforms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content" className="text-foreground">
                {payloadType === "image" && "Image Description / Prompt"}
                {payloadType === "pdf" && "PDF Content"}
                {payloadType === "link" && "Target URL"}
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder={
                  payloadType === "image"
                    ? "Describe the image you want to generate..."
                    : payloadType === "pdf"
                    ? "Enter PDF content..."
                    : "Enter the URL..."
                }
                rows={6}
                required
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isDemo}
            >
              {isDemo ? "Upgrade to Build Payloads" : "Build Payload"}
            </Button>

            {isDemo && (
              <p className="text-center text-sm text-muted-foreground">
                You're in demo mode. Upgrade to access builder features.
              </p>
            )}
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Builder;
