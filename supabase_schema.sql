-- Run this SQL in your Supabase SQL Editor to set up the database

-- 1. Create the heartscripts table
CREATE TABLE public.heartscripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    sender TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    tone TEXT NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    password_hint TEXT,
    response TEXT,
    opened_at TIMESTAMP WITH TIME ZONE
);

-- 2. Allow public access (For this prototype, we'll use open RLS since auth is local proxy)
ALTER TABLE public.heartscripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON public.heartscripts
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.heartscripts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.heartscripts
    FOR UPDATE USING (true);
