alter table products
  add column if not exists size_g integer;

alter table products
  add column if not exists scent_options text[];
