-- Auto-create profile when a new user signs up
-- This function will be triggered when a new user is created in auth.users

-- Allow service_role to insert profiles (required for the trigger to work with RLS)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'profiles'
    and policyname = 'Service role can insert profiles'
  ) then
    create policy "Service role can insert profiles"
      on profiles for insert
      to service_role
      with check (true);
  end if;
end $$;

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, display_name, email)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'engineer'),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger to automatically create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

