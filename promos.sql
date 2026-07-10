-- ──────────────────────────────────────────────────────────────────────────
-- WhiteFrame Labs — Promo & Featured Order Tables
-- Run this in Supabase SQL Editor
-- ──────────────────────────────────────────────────────────────────────────

-- 1. PROMOS TABLE
--    Stores admin-created promotional banners shown on the catalog pages.

CREATE TABLE IF NOT EXISTS public.promos (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT         NOT NULL,
  subtitle         TEXT,
  type             TEXT         NOT NULL DEFAULT 'Banner',  -- Banner | New Release | Sale | Flash Deal | Featured
  bg_type          TEXT         NOT NULL DEFAULT 'color',   -- color | image
  color            TEXT         NOT NULL DEFAULT '#7C5CFC', -- CSS hex color for the banner background
  bg_image_url     TEXT         DEFAULT NULL,               -- URL of the background image
  text_color       TEXT         NOT NULL DEFAULT 'white',   -- 'white' or dark hex for readable contrast
  cta_label        TEXT,                                    -- Button label, e.g. "Shop Now"
  linked_product_id TEXT,                                   -- Optional FK reference to pc_catalog.product_id
  active           BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) — allow public read, restrict writes to service role
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;

-- Anyone can read active promos (catalog page visitors)
CREATE POLICY "promos_public_read"
  ON public.promos FOR SELECT
  USING (true);

-- Only authenticated admin writes (via service role / anon key depending on your setup)
-- If you use the publishable anon key for admin writes (as per current setup), allow all:
CREATE POLICY "promos_admin_write"
  ON public.promos FOR ALL
  USING (true)
  WITH CHECK (true);


-- 2. FEATURED ORDER TABLE
--    Stores the admin-defined ordering of product_ids for the default catalog view.
--    A single row holds the full ordered array (simpler than per-row ordering).

CREATE TABLE IF NOT EXISTS public.featured_order (
  id               INT          PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- enforce singleton row
  product_ids      TEXT[]       NOT NULL DEFAULT '{}',                -- ordered array of product_id strings
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Insert the singleton row on creation
INSERT INTO public.featured_order (id, product_ids)
VALUES (1, '{}')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.featured_order ENABLE ROW LEVEL SECURITY;

CREATE POLICY "featured_order_public_read"
  ON public.featured_order FOR SELECT
  USING (true);

CREATE POLICY "featured_order_admin_write"
  ON public.featured_order FOR ALL
  USING (true)
  WITH CHECK (true);
