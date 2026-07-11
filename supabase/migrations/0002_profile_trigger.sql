-- 0002_profile_trigger.sql
-- Auto-create a public.profiles row whenever a new auth user signs up.
-- The username comes from the signUp options.data.username metadata; if absent,
-- it falls back to the email local-part (with a short suffix to avoid collisions).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  desired_username text;
begin
  desired_username := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    split_part(new.email, '@', 1)
  );

  -- Guard against a unique-violation on username by appending a short suffix if taken.
  if exists (select 1 from public.profiles where username = desired_username) then
    desired_username := desired_username || '_' || substr(new.id::text, 1, 4);
  end if;

  insert into public.profiles (id, username)
  values (new.id, desired_username);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
