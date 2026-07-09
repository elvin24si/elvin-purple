-- custom_commissions.sql
-- Run this SQL command in your Supabase SQL Editor to create the custom commissions table.

-- Create table custom_commissions
CREATE TABLE IF NOT EXISTS public.custom_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    member_id VARCHAR(255), -- references members(member_id)
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('Individual', 'Organization')),
    usage_focus VARCHAR(50) NOT NULL CHECK (usage_focus IN ('Gaming', 'Work', 'Stream')),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewing', 'Approved', 'Rejected', 'Completed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.custom_commissions ENABLE ROW LEVEL SECURITY;

-- Create Policies to grant full CRUD access from client integrations
CREATE POLICY "Allow public insert" ON public.custom_commissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.custom_commissions FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON public.custom_commissions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.custom_commissions FOR DELETE USING (true);
