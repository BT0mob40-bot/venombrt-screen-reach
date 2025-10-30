import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Bots from "./pages/Bots";
import VNCViewer from "./pages/VNCViewer";
import Commands from "./pages/Commands";
import Connections from "./pages/Connections";
import Servers from "./pages/Servers";
import Injection from "./pages/Injection";
import Logs from "./pages/Logs";
import FileManager from "./pages/FileManager";
import Terminal from "./pages/Terminal";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Builder from "./pages/Builder";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Obfuscator from "./pages/Obfuscator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/bots" element={<Bots />} />
          <Route path="/dashboard/vnc" element={<VNCViewer />} />
          <Route path="/dashboard/commands" element={<Commands />} />
          <Route path="/dashboard/connections" element={<Connections />} />
          <Route path="/dashboard/servers" element={<Servers />} />
          <Route path="/dashboard/injection" element={<Injection />} />
          <Route path="/dashboard/logs" element={<Logs />} />
          <Route path="/dashboard/files" element={<FileManager />} />
          <Route path="/dashboard/terminal" element={<Terminal />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/admin" element={<Admin />} />
        <Route path="/dashboard/builder" element={<Builder />} />
          <Route path="/dashboard/pricing" element={<Pricing />} />
          <Route path="/dashboard/checkout" element={<Checkout />} />
          <Route path="/dashboard/obfuscator" element={<Obfuscator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
