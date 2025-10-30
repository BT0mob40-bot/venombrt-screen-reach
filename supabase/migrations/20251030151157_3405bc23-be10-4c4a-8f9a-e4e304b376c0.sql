-- Create features table for dynamic dashboard content
CREATE TABLE public.features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Zap',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings_global table for app-wide settings
CREATE TABLE public.settings_global (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default global settings
INSERT INTO public.settings_global (key, value) VALUES
  ('features_section_name', 'Platform Features'),
  ('telegram_handle', '@venomBRT_support');

-- Enable RLS
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_global ENABLE ROW LEVEL SECURITY;

-- RLS policies for features (everyone can view active features)
CREATE POLICY "Anyone can view active features"
ON public.features
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage features"
ON public.features
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for settings_global
CREATE POLICY "Anyone can view global settings"
ON public.settings_global
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage global settings"
ON public.settings_global
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_features_updated_at
BEFORE UPDATE ON public.features
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_global_updated_at
BEFORE UPDATE ON public.settings_global
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();