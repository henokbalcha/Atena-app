-- 1. Create the 'profiles' table for User/Publisher Info
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT,
    full_name TEXT,
    is_publisher BOOLEAN DEFAULT FALSE,
    avatar_url TEXT
);

-- 2. Update the 'apps' table to include type and publisher_id
CREATE TABLE apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    price NUMERIC(10, 2) DEFAULT 0.00,
    category TEXT NOT NULL,
    type TEXT DEFAULT 'app', -- 'app' or 'game'
    apk_url TEXT,
    screenshots TEXT[] DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 0.00,
    downloads INTEGER DEFAULT 0,
    publisher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    developer TEXT, -- Legacy
    color TEXT
);

-- 3. Create the 'reviews' table
CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies

-- Profile Policies: Users can see all profiles, but only edit their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Apps Policies: Everyone can read apps, only publishers can insert
CREATE POLICY "Apps are viewable by everyone" ON apps
    FOR SELECT USING (true);

-- Requirement: Only users who are publishers can insert an app
CREATE POLICY "Publishers can insert apps" ON apps
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_publisher = TRUE
        )
    );

-- 6. Storage Buckets (Pre-configured via dashboard but here for SQL reference)
-- Please ensure buckets 'app-icons', 'screenshots', and 'app-bundles' are created in the Storage tab.

-- 7. Trigger to automatically create a profile for every new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
