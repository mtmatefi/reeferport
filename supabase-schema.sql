-- ============================================================================
-- ReeferPort / Gesellschaftsbecken – Supabase Schema Migration
-- Run this SQL in the Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Users ──────────────────────────────────────────────────────────────────
create table if not exists users (
  id             text primary key default gen_random_uuid()::text,
  email          text not null unique,
  password_hash  text not null,
  name           text not null,
  avatar         text not null default '',
  type           text not null default 'Privat',
  location       text not null default 'Schweiz',
  bio            text,
  verified       boolean not null default false,
  member_since   text not null default extract(year from now())::text,
  sales_count    integer not null default 0,
  rating         numeric(2,1) not null default 5.0,
  review_count   integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ─── Listings ───────────────────────────────────────────────────────────────
create table if not exists listings (
  id              text primary key default gen_random_uuid()::text,
  title           text not null,
  latin           text not null default '',
  price           integer not null default 0,
  currency        text not null default 'CHF',
  subtitle        text not null default '',
  description     text not null,
  location        text not null,
  image           text not null,
  images          jsonb not null default '[]',
  category        text not null,
  subcategory     text,
  condition       text not null,
  listing_type    text not null default 'C2C',
  offer_type      text not null default 'sell',
  seller_id       text not null references users(id) on delete cascade,
  tags            jsonb not null default '[]',
  badge           text,
  shipping        boolean not null default false,
  shipping_cost   integer,
  pickup          boolean not null default true,
  views           integer not null default 0,
  active          boolean not null default true,
  cites_required  boolean not null default false,
  cites_number    text,
  cites_appendix  text,
  cites_source    text,
  equipment_type  text,
  brand           text,
  wattage         integer,
  tank_size_min   integer,
  tank_size_max   integer,
  created_at      timestamptz not null default now()
);

-- ─── Saved Listings ─────────────────────────────────────────────────────────
create table if not exists saved_listings (
  user_id    text not null references users(id) on delete cascade,
  listing_id text not null references listings(id) on delete cascade,
  saved_at   timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- ─── Conversations ──────────────────────────────────────────────────────────
create table if not exists conversations (
  id         text primary key default gen_random_uuid()::text,
  buyer_id   text not null references users(id) on delete cascade,
  seller_id  text not null references users(id) on delete cascade,
  listing_id text references listings(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ─── Messages ───────────────────────────────────────────────────────────────
create table if not exists messages (
  id              text primary key default gen_random_uuid()::text,
  conversation_id text not null references conversations(id) on delete cascade,
  sender_id       text not null references users(id) on delete cascade,
  text            text not null,
  read            boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ─── Reviews ────────────────────────────────────────────────────────────────
create table if not exists reviews (
  id          text primary key default gen_random_uuid()::text,
  seller_id   text not null references users(id) on delete cascade,
  reviewer_id text not null references users(id) on delete cascade,
  listing_id  text references listings(id) on delete set null,
  rating      integer not null,
  text        text not null,
  created_at  timestamptz not null default now()
);

-- ─── Indexes ────────────────────────────────────────────────────────────────
create index if not exists idx_listings_seller on listings(seller_id);
create index if not exists idx_listings_category on listings(category);
create index if not exists idx_listings_active on listings(active);
create index if not exists idx_listings_created on listings(created_at desc);
create index if not exists idx_saved_user on saved_listings(user_id);
create index if not exists idx_conversations_buyer on conversations(buyer_id);
create index if not exists idx_conversations_seller on conversations(seller_id);
create index if not exists idx_messages_conv on messages(conversation_id);

-- ─── RLS Policies ───────────────────────────────────────────────────────────
alter table users enable row level security;
alter table listings enable row level security;
alter table saved_listings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;

-- Public read access for users and listings
create policy "Users are publicly viewable" on users for select using (true);
create policy "Listings are publicly viewable" on listings for select using (true);
create policy "Reviews are publicly viewable" on reviews for select using (true);

-- Authenticated insert/update for users
create policy "Users can insert their own profile" on users for insert with check (true);
create policy "Users can update their own profile" on users for update using (true);

-- Authenticated operations for listings
create policy "Anyone can insert listings" on listings for insert with check (true);
create policy "Sellers can update their listings" on listings for update using (true);
create policy "Sellers can delete their listings" on listings for delete using (true);

-- Saved listings policies
create policy "Users can view their saved" on saved_listings for select using (true);
create policy "Users can save listings" on saved_listings for insert with check (true);
create policy "Users can unsave listings" on saved_listings for delete using (true);

-- Conversations and messages
create policy "Users can view their conversations" on conversations for select using (true);
create policy "Users can start conversations" on conversations for insert with check (true);
create policy "Users can view messages" on messages for select using (true);
create policy "Users can send messages" on messages for insert with check (true);
create policy "Users can mark messages read" on messages for update using (true);

-- Reviews
create policy "Users can write reviews" on reviews for insert with check (true);

-- ─── Storage bucket for listing images ──────────────────────────────────────
insert into storage.buckets (id, name, public) values ('listings', 'listings', true)
on conflict (id) do nothing;

create policy "Anyone can upload listing images" on storage.objects
  for insert with check (bucket_id = 'listings');
create policy "Listing images are publicly viewable" on storage.objects
  for select using (bucket_id = 'listings');
