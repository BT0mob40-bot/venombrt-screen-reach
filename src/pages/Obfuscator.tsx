import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Obfuscator = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState<string>("android");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File Selected",
        description: `${e.target.files[0].name} ready for encryption`,
      });
    }
  };

  const handleObfuscate = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to encrypt",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate obfuscation process
    setTimeout(() => {
      toast({
        title: "Encryption Complete",
        description: `${file.name} has been encrypted for ${platform}`,
      });
      setIsProcessing(false);
      
      // Create a download link
      const blob = new Blob([`Encrypted content for ${platform}`], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `encrypted_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            File Obfuscator
          </h1>
          <p className="text-muted-foreground">
            Encrypt and obfuscate your files for secure deployment
          </p>
        </div>

        <Card className="p-8 bg-card border-border max-w-2xl">
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <Label htmlFor="file-upload" className="text-foreground mb-2 block">
                Select File to Encrypt
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".apk,.ipa,.exe,.zip,.pdf,.png,.jpg"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  {file ? (
                    <div>
                      <p className="text-foreground font-medium mb-1">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-foreground font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        APK, IPA, EXE, ZIP, PDF, or Image files
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <Label className="text-foreground mb-2 block">Target Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="both">Both Platforms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleObfuscate}
                disabled={!file || isProcessing}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isProcessing ? "Encrypting..." : "Encrypt File"}
              </Button>
              {file && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    toast({
                      title: "Cleared",
                      description: "File selection cleared",
                    });
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-card border-border mt-6 max-w-2xl">
          <h3 className="font-semibold text-foreground mb-3">Encryption Features</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Advanced file obfuscation and encryption</li>
            <li>• Platform-specific optimization</li>
            <li>• Secure packaging for deployment</li>
            <li>• Anti-tampering protection</li>
            <li>• Code obfuscation for APK/IPA files</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Obfuscator;
