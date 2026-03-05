alter table orders
  add column if not exists order_id uuid,
  add column if not exists product_id uuid,
  add column if not exists quantity integer,
  add column if not exists total_price numeric(10,2),
  add column if not exists order_status text,
  add column if not exists payment_status text;

-- Optional: set defaults for new columns when inserting.
alter table orders
  alter column order_id set default gen_random_uuid(),
  alter column order_status set default 'submitted',
  alter column payment_status set default 'pending';
