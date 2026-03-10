-- ─── ReeferPort Supabase Schema ───────────────────────────────────────────────
-- Run this in the Supabase SQL editor at:
-- https://supabase.com/dashboard/project/jtpommyckfviayapncoo/sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles (extends auth.users) ────────────────────────────────────────────
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  name         text not null default '',
  avatar       text not null default '',
  type         text not null default 'Privat' check (type in ('Privat', 'Händler')),
  location     text not null default '',
  verified     boolean not null default false,
  rating       numeric(3,2) not null default 5.0,
  review_count integer not null default 0,
  member_since text not null default to_char(now(), 'YYYY'),
  sales_count  integer not null default 0,
  bio          text not null default '',
  created_at   timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, avatar, type, location)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar', 'https://i.pravatar.cc/150?u=' || new.email),
    coalesce(new.raw_user_meta_data->>'type', 'Privat'),
    coalesce(new.raw_user_meta_data->>'location', 'Schweiz')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── Listings ─────────────────────────────────────────────────────────────────
create table if not exists listings (
  id             uuid primary key default uuid_generate_v4(),
  seller_id      uuid not null references profiles(id) on delete cascade,
  title          text not null,
  latin          text not null default '',
  subtitle       text not null default '',
  description    text not null default '',
  price          numeric(10,2) not null default 0,
  currency       text not null default 'CHF' check (currency in ('CHF', 'EUR')),
  location       text not null default '',
  category       text not null check (category in ('Korallen','Anemonen','Fische','Wirbellose','Equipment','Frags')),
  subcategory    text not null default '',
  condition      text not null default '' check (condition in ('Nachzucht','Wildfang','Neu','Gebraucht','')),
  listing_type   text not null default 'Verkaufen' check (listing_type in ('Verkaufen','Verschenken','Tauschen')),
  image          text not null default '',
  images         text[] not null default '{}',
  tags           text[] not null default '{}',
  shipping       boolean not null default false,
  shipping_cost  numeric(8,2),
  pickup         boolean not null default true,
  active         boolean not null default true,
  views          integer not null default 0,
  badge          text,
  -- CITES fields
  cites_relevant boolean not null default false,
  cites_appendix text,           -- 'I', 'II', 'III'
  cites_confirmed boolean not null default false,  -- seller confirmed CITES compliance
  cites_notes    text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ─── Saved listings ────────────────────────────────────────────────────────────
create table if not exists saved_listings (
  user_id    uuid not null references profiles(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- ─── Conversations ─────────────────────────────────────────────────────────────
create table if not exists conversations (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid references listings(id) on delete set null,
  buyer_id    uuid not null references profiles(id) on delete cascade,
  seller_id   uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ─── Messages ─────────────────────────────────────────────────────────────────
create table if not exists messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references profiles(id) on delete cascade,
  text            text not null,
  created_at      timestamptz not null default now()
);

-- ─── Storage bucket for listing images ────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- ─── Row Level Security ────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table listings enable row level security;
alter table saved_listings enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Profiles: public read, owner write
create policy "Public profiles are viewable by everyone" on profiles
  for select using (true);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Listings: public read, authenticated create, owner update/delete
create policy "Listings are viewable by everyone" on listings
  for select using (active = true);
create policy "Authenticated users can create listings" on listings
  for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own listings" on listings
  for update using (auth.uid() = seller_id);
create policy "Sellers can delete own listings" on listings
  for delete using (auth.uid() = seller_id);

-- Saved listings: owner only
create policy "Users can view own saved listings" on saved_listings
  for select using (auth.uid() = user_id);
create policy "Users can save listings" on saved_listings
  for insert with check (auth.uid() = user_id);
create policy "Users can unsave listings" on saved_listings
  for delete using (auth.uid() = user_id);

-- Conversations: participants only
create policy "Conversation participants can view" on conversations
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Buyers can create conversations" on conversations
  for insert with check (auth.uid() = buyer_id);

-- Messages: conversation participants
create policy "Message participants can view" on messages
  for select using (
    exists (
      select 1 from conversations c
      where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );
create policy "Participants can send messages" on messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from conversations c
      where c.id = conversation_id
      and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

-- Storage: public read, authenticated upload
create policy "Anyone can view listing images" on storage.objects
  for select using (bucket_id = 'listing-images');
create policy "Authenticated users can upload listing images" on storage.objects
  for insert with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');
create policy "Users can update own images" on storage.objects
  for update using (bucket_id = 'listing-images' and auth.uid() = owner);
create policy "Users can delete own images" on storage.objects
  for delete using (bucket_id = 'listing-images' and auth.uid() = owner);

-- ─── Updated_at trigger ────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists listings_updated_at on listings;
create trigger listings_updated_at
  before update on listings
  for each row execute function update_updated_at();
