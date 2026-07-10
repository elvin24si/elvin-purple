-- add_promo_image_columns.sql
-- Run this SQL command in your Supabase SQL Editor to add image options to the promos table.

ALTER TABLE public.promos 
ADD COLUMN IF NOT EXISTS bg_type TEXT NOT NULL DEFAULT 'color',
ADD COLUMN IF NOT EXISTS bg_image_url TEXT DEFAULT NULL;
