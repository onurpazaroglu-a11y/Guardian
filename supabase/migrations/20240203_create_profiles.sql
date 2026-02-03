-- Create a table for public profiles linkable to auth.users if it doesn't exist
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  email text,
  first_name text,
  last_name text,
  avatar_url text,
  tier text default 'free' check (tier in ('free', 'signal', 'blocker', 'bundle'))
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies (safely drop first to allow re-running)
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Function to handle new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name, tier)
  values (new.id, new.email, '', '', 'free')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger logic: Safely drop and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
