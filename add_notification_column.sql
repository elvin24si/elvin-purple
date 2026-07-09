-- add_notification_column.sql
-- Run this SQL command in your Supabase SQL Editor to add the notification column to the members table.

ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS notification BOOLEAN DEFAULT NULL;
