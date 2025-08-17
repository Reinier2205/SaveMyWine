-- SaveMyWines Database Schema
-- This file contains the SQL for creating the wines table and RLS policies

-- wines table: no PII, segmented by device_id
create table if not exists wines (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  name text not null,
  producer text,
  varietal text,
  vintage int,
  region text,
  alcohol text,
  notes text,
  date_purchased date not null,
  best_drink_date date,
  label_image_url text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table wines enable row level security;

-- RLS Policies
create policy "select by device" on wines 
  for select using (device_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "insert by device" on wines 
  for insert with check (device_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

create policy "update by device" on wines 
  for update using (device_id = current_setting('request.jwt.claims', true)::jsonb->>'sub');

-- Storage bucket for labels
-- Note: Create bucket "labels" in Dashboard; set public = false; add RLS rules if needed
-- This is done through the Supabase Dashboard, not via SQL
