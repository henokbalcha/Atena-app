-- ATHENA NETWORK: STORAGE CONFIGURATION
-- Run this in the Supabase SQL Editor to prepare your buckets

-- 1. Create Public Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-icons', 'app-icons', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-bundles', 'app-bundles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Create Storage Policies for Public Access
-- Anyone can view
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);

-- Authenticated publishers can upload to their respective paths
CREATE POLICY "Publishers can upload icons" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'app-icons' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Publishers can upload screenshots" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'screenshots' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Publishers can upload bundles" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'app-bundles' AND
        auth.role() = 'authenticated'
    );
