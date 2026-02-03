-- Add new columns to profiles table for trading configuration
alter table profiles 
add column if not exists preferred_market text,
add column if not exists api_keys jsonb default '{}'::jsonb;

-- Remove old single API key columns if they exist
alter table profiles 
drop column if exists api_key,
drop column if exists api_secret;
