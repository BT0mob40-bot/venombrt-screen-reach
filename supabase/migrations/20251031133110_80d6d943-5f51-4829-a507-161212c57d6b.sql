-- Create storage bucket for bot screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('bot-screenshots', 'bot-screenshots', true);

-- Create policies for bot screenshots
CREATE POLICY "Anyone can view bot screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'bot-screenshots');

CREATE POLICY "Admins can upload bot screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'bot-screenshots' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bot screenshots" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'bot-screenshots' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bot screenshots" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'bot-screenshots' AND has_role(auth.uid(), 'admin'));

-- Add screenshot_url column to bots table
ALTER TABLE public.bots ADD COLUMN screenshot_url text;

-- Insert website name into settings_global
INSERT INTO public.settings_global (key, value) 
VALUES ('website_name', 'VenomRAT')
ON CONFLICT (key) DO NOTHING;