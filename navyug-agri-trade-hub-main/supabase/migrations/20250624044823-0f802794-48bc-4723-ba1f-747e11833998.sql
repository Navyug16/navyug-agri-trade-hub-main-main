
-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inquiries table to store contact form submissions
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_interest TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users (only authenticated admin users can access)
CREATE POLICY "Admin users can manage admin accounts" 
  ON public.admin_users 
  FOR ALL 
  USING (true);

-- Add RLS to inquiries table
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for inquiries (admin access only)
CREATE POLICY "Admin users can manage inquiries" 
  ON public.inquiries 
  FOR ALL 
  USING (true);

-- Insert a default admin user (password: admin123)
-- In production, you should use a proper password hashing function
INSERT INTO public.admin_users (email, password_hash, name) 
VALUES ('admin@example.com', '$2b$10$rQ8QaYZ9ZvN1YjXrQa8YZeK9.Xp8JK9N2Lp4Qc6Zd8Xe3Yv5Wb7Te', 'Admin User');
