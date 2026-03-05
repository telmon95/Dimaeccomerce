create table if not exists deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  created_at timestamptz default now()
);

alter table deletion_requests enable row level security;

create policy "User create deletion request"
on deletion_requests for insert
to authenticated
with check (auth.uid() = user_id);

-- Allow users to delete their own orders when requesting deletion.
create policy "User delete own orders"
on orders for delete
to authenticated
using (auth.uid() = user_id);
