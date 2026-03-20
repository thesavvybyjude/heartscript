-- ====================================================
-- 1. Create the profiles table (linked to auth.users)
-- ====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_id INT, -- Changed to INT to match our frontend UI
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ====================================================
-- 2. Create the heartscripts table
-- ====================================================
CREATE TABLE IF NOT EXISTS public.heartscripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sender TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    tone TEXT NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    password_hint TEXT,
    response TEXT,
    opened_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    -- MAGIC FIX: Automatically assigns the logged-in user's ID
    user_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid() 
);

-- Enable RLS on heartscripts
ALTER TABLE public.heartscripts ENABLE ROW LEVEL SECURITY;

-- Reading
CREATE POLICY "Heartscripts are viewable by everyone" ON public.heartscripts
    FOR SELECT USING (true);

-- Inserting (Only authenticated users, and they can only insert as themselves)
CREATE POLICY "Authenticated users can insert heartscripts" ON public.heartscripts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Updating (Only the author)
CREATE POLICY "Authors can update their own heartscripts" ON public.heartscripts
    FOR UPDATE USING (auth.uid() = user_id);

-- Deleting (Required for the 'Unsend' button)
CREATE POLICY "Authors can delete their own heartscripts" ON public.heartscripts
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================================
-- 3. Automatically create a profile when a user signs up
-- ====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_id)
    VALUES (
        new.id, 
        new.raw_user_meta_data->>'username', 
        new.raw_user_meta_data->>'full_name', 
        CAST(new.raw_user_meta_data->>'avatarId' AS INT) -- Grabs the frontend avatar ID
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function after a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
