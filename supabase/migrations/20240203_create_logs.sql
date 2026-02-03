-- Create logs table
create table if not exists logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  log_type text not null check (log_type in ('success', 'error', 'warning', 'info')),
  message text not null,
  details text,
  source text
);

-- Create index for faster queries
create index if not exists logs_user_id_idx on logs(user_id);
create index if not exists logs_created_at_idx on logs(created_at desc);

-- Enable RLS
alter table logs enable row level security;

-- Policies
drop policy if exists "Users can view their own logs" on logs;
create policy "Users can view their own logs" on logs
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own logs" on logs;
create policy "Users can insert their own logs" on logs
  for insert with check (auth.uid() = user_id);
