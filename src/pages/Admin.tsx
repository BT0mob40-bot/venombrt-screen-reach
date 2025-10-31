import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";
import { Shield, Users, Key, Package, Coins, Trash2, Zap, Settings, Smartphone, Upload, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Admin = () => {
  const { isAdmin, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [cryptoAddresses, setCryptoAddresses] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [bots, setBots] = useState<any[]>([]);
  const [featuresSectionName, setFeaturesSectionName] = useState("Platform Features");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [websiteName, setWebsiteName] = useState("VenomRAT");
  const [selectedBotForScreenshot, setSelectedBotForScreenshot] = useState<string>("");

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    const [usersData, packagesData, licensesData, cryptoData, featuresData, botsData, settingsData] = await Promise.all([
      supabase.from("user_roles").select("*"),
      supabase.from("packages").select("*"),
      supabase.from("licenses").select("*"),
      supabase.from("crypto_addresses").select("*"),
      supabase.from("features").select("*").order("display_order"),
      supabase.from("bots").select("*").order("created_at", { ascending: false }),
      supabase.from("settings_global").select("*").in("key", ["features_section_name", "telegram_handle", "website_name"]),
    ]);
    setUsers(usersData.data || []);
    setPackages(packagesData.data || []);
    setLicenses(licensesData.data || []);
    setCryptoAddresses(cryptoData.data || []);
    setFeatures(featuresData.data || []);
    setBots(botsData.data || []);
    
    if (settingsData.data) {
      const featureName = settingsData.data.find(s => s.key === "features_section_name")?.value;
      const telegram = settingsData.data.find(s => s.key === "telegram_handle")?.value;
      const website = settingsData.data.find(s => s.key === "website_name")?.value;
      if (featureName) setFeaturesSectionName(featureName);
      if (telegram) setTelegramHandle(telegram);
      if (website) setWebsiteName(website);
    }
  };

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    try {
      // Use service role to create user directly
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Insert role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: authData.user.id, role } as any);

      if (roleError) throw roleError;

      toast({ title: "Success", description: "User created successfully" });
      fetchData();
      e.currentTarget.reset();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const generateLicense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const packageId = formData.get("package") as string;
    const platform = formData.get("platform") as string;
    const licenseKey = `VBT-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;

    const { error } = await supabase.from("licenses").insert({
      license_key: licenseKey,
      package_id: packageId,
      platform,
      status: "inactive",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: `License created: ${licenseKey}` });
    fetchData();
    e.currentTarget.reset();
  };

  const createPackage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from("packages").insert({
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      features: (formData.get("features") as string).split("\n").filter(Boolean),
      duration_days: parseInt(formData.get("duration") as string),
      platform: formData.get("platform"),
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Package created" });
    fetchData();
    e.currentTarget.reset();
  };

  const addCryptoAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from("crypto_addresses").insert({
      coin: formData.get("coin"),
      network: formData.get("network"),
      address: formData.get("address"),
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Crypto address added" });
    fetchData();
    e.currentTarget.reset();
  };

  const deleteItem = async (table: any, id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Item deleted" });
    fetchData();
  };

  const createFeature = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase.from("features").insert({
      title: formData.get("title"),
      description: formData.get("description"),
      icon: formData.get("icon") || "Zap",
      display_order: parseInt(formData.get("display_order") as string) || 0,
    } as any);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Feature added" });
    fetchData();
    e.currentTarget.reset();
  };

  const updateGlobalSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const updates = [
      { key: "features_section_name", value: formData.get("features_section_name") as string },
      { key: "telegram_handle", value: formData.get("telegram_handle") as string },
      { key: "website_name", value: formData.get("website_name") as string },
    ];

    for (const setting of updates) {
      await supabase.from("settings_global").upsert(setting, { onConflict: "key" });
    }

    toast({ title: "Success", description: "Settings updated" });
    fetchData();
  };

  const uploadBotScreenshot = async (file: File) => {
    if (!selectedBotForScreenshot) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${selectedBotForScreenshot}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('bot-screenshots').upload(fileName, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from('bot-screenshots').getPublicUrl(fileName);
    const { error: updateError } = await supabase.from('bots').update({ screenshot_url: publicUrl }).eq('id', selectedBotForScreenshot);
    if (updateError) throw updateError;
    toast({ title: "Success", description: "Screenshot uploaded" });
    setSelectedBotForScreenshot("");
    fetchData();
  };

  if (roleLoading) return null;
  if (!isAdmin) return null;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage users, licenses, packages, and payments</p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />Users</TabsTrigger>
            <TabsTrigger value="licenses"><Key className="w-4 h-4 mr-2" />Licenses</TabsTrigger>
            <TabsTrigger value="packages"><Package className="w-4 h-4 mr-2" />Packages</TabsTrigger>
            <TabsTrigger value="crypto"><Coins className="w-4 h-4 mr-2" />Crypto</TabsTrigger>
            <TabsTrigger value="features"><Zap className="w-4 h-4 mr-2" />Features</TabsTrigger>
            <TabsTrigger value="screenshots"><Smartphone className="w-4 h-4 mr-2" />Screenshots</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="grid gap-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Create User</h2>
                <form onSubmit={createUser} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required minLength={6} />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demo">Demo</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Create User</Button>
                </form>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Existing Users</h2>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium">{user.user_id}</p>
                        <p className="text-xs text-muted-foreground">Role: {user.role}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteItem("user_roles", user.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="licenses">
            <div className="grid gap-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Generate License</h2>
                <form onSubmit={generateLicense} className="space-y-4">
                  <div>
                    <Label htmlFor="package">Package</Label>
                    <Select name="package" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>{pkg.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select name="platform" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="android">Android</SelectItem>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Generate License</Button>
                </form>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Existing Licenses</h2>
                <div className="space-y-2">
                  {licenses.map((license) => (
                    <div key={license.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium font-mono">{license.license_key}</p>
                        <p className="text-xs text-muted-foreground">
                          {license.platform} • {license.status}
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteItem("licenses", license.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="grid gap-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Create Package</h2>
                <form onSubmit={createPackage} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Package Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input id="price" name="price" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input id="duration" name="duration" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="features">Features (one per line)</Label>
                    <Textarea id="features" name="features" rows={5} />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select name="platform" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="android">Android</SelectItem>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Create Package</Button>
                </form>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Existing Packages</h2>
                <div className="space-y-2">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium">{pkg.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${pkg.price} • {pkg.duration_days} days • {pkg.platform}
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteItem("packages", pkg.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crypto">
            <div className="grid gap-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Add Crypto Address</h2>
                <form onSubmit={addCryptoAddress} className="space-y-4">
                  <div>
                    <Label htmlFor="coin">Coin</Label>
                    <Input id="coin" name="coin" placeholder="BTC, ETH, USDT..." required />
                  </div>
                  <div>
                    <Label htmlFor="network">Network</Label>
                    <Input id="network" name="network" placeholder="Bitcoin, Ethereum, TRC20..." required />
                  </div>
                  <div>
                    <Label htmlFor="address">Wallet Address</Label>
                    <Input id="address" name="address" required />
                  </div>
                  <Button type="submit" className="w-full">Add Crypto Address</Button>
                </form>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Existing Crypto Addresses</h2>
                <div className="space-y-2">
                  {cryptoAddresses.map((crypto) => (
                    <div key={crypto.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium">{crypto.coin} - {crypto.network}</p>
                        <p className="text-xs text-muted-foreground font-mono">{crypto.address}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteItem("crypto_addresses", crypto.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="grid gap-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Global Settings</h2>
                <form onSubmit={updateGlobalSettings} className="space-y-4">
                  <div>
                    <Label htmlFor="features_section_name">Features Section Name</Label>
                    <Input 
                      id="features_section_name" 
                      name="features_section_name" 
                      defaultValue={featuresSectionName}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="telegram_handle">Telegram Handle</Label>
                    <Input 
                      id="telegram_handle" 
                      name="telegram_handle" 
                      placeholder="@venomBRT_support"
                      defaultValue={telegramHandle}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="website_name">Website Name</Label>
                    <Input 
                      id="website_name" 
                      name="website_name" 
                      placeholder="VenomRAT"
                      defaultValue={websiteName}
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">Update Settings</Button>
                </form>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Add Dashboard Feature</h2>
                <form onSubmit={createFeature} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Feature Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" required />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon Name (Lucide)</Label>
                    <Input id="icon" name="icon" placeholder="Zap, Shield, Lock..." defaultValue="Zap" />
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input id="display_order" name="display_order" type="number" defaultValue="0" />
                  </div>
                  <Button type="submit" className="w-full">Add Feature</Button>
                </form>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Existing Features</h2>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteItem("features", feature.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="screenshots">
            <div className="grid gap-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Upload Bot Screenshots
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label>Select Bot</Label>
                    <Select value={selectedBotForScreenshot} onValueChange={setSelectedBotForScreenshot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a bot" />
                      </SelectTrigger>
                      <SelectContent>
                        {bots?.map((bot) => (
                          <SelectItem key={bot.id} value={bot.id}>
                            {bot.name} - {bot.platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedBotForScreenshot && (
                    <div>
                      <Label>Upload Screenshot</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadBotScreenshot(file);
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload a screenshot to show live screen mirror for this bot
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Bot Screenshots</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {bots?.filter(bot => bot.screenshot_url).map((bot) => (
                    <Card key={bot.id} className="overflow-hidden">
                      <div className="aspect-[9/16] relative">
                        <img 
                          src={bot.screenshot_url} 
                          alt={bot.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="font-semibold">{bot.name}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline">{bot.platform}</Badge>
                          <Badge variant="outline">{bot.model}</Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={async () => {
                            const { error } = await supabase
                              .from('bots')
                              .update({ screenshot_url: null })
                              .eq('id', bot.id);
                            if (!error) {
                              toast({ title: "Success", description: "Screenshot removed" });
                              fetchData();
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Screenshot
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
