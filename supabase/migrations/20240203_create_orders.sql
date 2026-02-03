-- Create orders table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  plan_name text not null,
  amount numeric(10, 2) not null,
  currency text default 'TRY' not null,
  status text default 'completed' check (status in ('completed', 'pending', 'failed', 'refunded')),
  invoice_url text
);

-- Enable RLS
alter table orders enable row level security;

-- Policies
drop policy if exists "Users can view their own orders" on orders;
create policy "Users can view their own orders" on orders
  for select using (auth.uid() = user_id);

-- Insert some dummy data for development (Optional - comment out for prod)
-- insert into orders (user_id, plan_name, amount, status, created_at) 
-- select id, 'Başlangıç Paketi', 0.00, 'completed', now() - interval '1 month' 
-- from auth.users limit 1;
