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
import { Shield, Users, Key, Package, Coins, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { isAdmin, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [cryptoAddresses, setCryptoAddresses] = useState<any[]>([]);

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
    const [usersData, packagesData, licensesData, cryptoData] = await Promise.all([
      supabase.from("user_roles").select("*"),
      supabase.from("packages").select("*"),
      supabase.from("licenses").select("*"),
      supabase.from("crypto_addresses").select("*"),
    ]);
    setUsers(usersData.data || []);
    setPackages(packagesData.data || []);
    setLicenses(licensesData.data || []);
    setCryptoAddresses(cryptoData.data || []);
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
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />Users</TabsTrigger>
            <TabsTrigger value="licenses"><Key className="w-4 h-4 mr-2" />Licenses</TabsTrigger>
            <TabsTrigger value="packages"><Package className="w-4 h-4 mr-2" />Packages</TabsTrigger>
            <TabsTrigger value="crypto"><Coins className="w-4 h-4 mr-2" />Crypto</TabsTrigger>
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
