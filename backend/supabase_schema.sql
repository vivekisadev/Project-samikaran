-- Supabase Schema for Samikaran Backend
-- Please execute this query in your Supabase project's SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  status TEXT DEFAULT 'Active',
  date TEXT,
  location TEXT,
  stats JSONB,
  full_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'Unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address TEXT,
  phone TEXT,
  email TEXT,
  impact_stats JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default admin for initial login
-- Change the email and password_hash (this hash corresponds to "admin123") if needed.
INSERT INTO public.admins (name, email, password_hash, role) 
VALUES ('Super Admin', 'admin@samikaran.org', '$2a$10$23LE4D1T2QT6qryZaoZJQetE5IAnpNz3UdBqYPTtcGKDHJg2mwSNa', 'superadmin')
ON CONFLICT DO NOTHING;

-- Disable Row Level Security temporarily to easily migrate and test the backend without policies
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.media DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;

CREATE TABLE public.donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.donations DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media TEXT,
  link TEXT,
  date TEXT,
  type TEXT,
  "fullContent" TEXT,
  stats JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure all necessary columns exist on reports if it was created manually
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS media TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS "fullContent" TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS stats JSONB;

ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  media TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;

-- Ensure all necessary columns exist on media if it was created manually
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS "mainImage" TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS gallery JSONB;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE public.media ALTER COLUMN url DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  text TEXT NOT NULL,
  avatar TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;
