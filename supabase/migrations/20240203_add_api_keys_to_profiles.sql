-- Add new columns to profiles table for trading configuration
alter table profiles 
add column if not exists preferred_market text,
add column if not exists api_key text,
add column if not exists api_secret text;
