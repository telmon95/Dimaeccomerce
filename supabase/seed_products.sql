-- Optional: remove duplicates if you re-run this seed.
delete from products
where name in (
  'Bath Bombs Jasmine Frankincense',
  'Bath Bombs Misty Mountains (Bubblegum)',
  'Bath Bombs Lemon',
  'Bath Bombs Sweet Orange',
  'Bath Bombs Rose',
  'Bath Bombs Lavender',
  'Bath Bombs Raspberry',
  'Bath Salts 3x150g Bundle',
  'Bath Salts 250g',
  'Bath Salts 500g',
  'Box Set 3x150g + Bath Bomb + Spoon',
  'Box Set 1x250g + Bath Bomb + Spoon',
  'Box Set 1x500g + Bath Bomb + Spoon'
);

insert into products (
  name,
  description,
  price,
  image_url,
  category,
  benefits,
  is_special,
  is_active,
  size_g,
  scent_options
)
values
  (
    'Bath Bombs Jasmine Frankincense',
    'Bath bomb with jasmine and frankincense notes.',
    60.00,
    null,
    'Bath Bombs',
    ARRAY[]::text[],
    false,
    true,
    null,
    null
  ),
  (
    'Bath Bombs Misty Mountains (Bubblegum)',
    'Bath bomb with a bubblegum scent.',
    60.00,
    null,
    'Bath Bombs',
    ARRAY[]::text[],
    false,
    true,
    null,
    null
  ),
  (
    'Bath Bombs Lemon',
    'Bath bomb with a fresh lemon scent.',
    60.00,
    null,
    'Bath Bombs',
    ARRAY[]::text[],
    false,
    true,
    null,
    null
  ),
  (
    'Bath Bombs Sweet Orange',
    'Bath bomb with a sweet orange scent.',
    60.00,
    null,
    'Bath Bombs',
    ARRAY[]::text[],
    false,
    true,
    null,
    null
  ),
  (
    'Bath Bombs Rose',
    'Bath bomb with a soft rose scent.',
    60.00,
    null,
    'Bath Bombs',
    ARRAY[]::text[],
    false,
    true,
    null,
    null
  ),
  (
    'Bath Bombs Lavender',
    'Bath bomb with a calming lavender scent.',
    60.00,
    null,
    'Bath Bombs',
    ARRAY[]::text[],
    false,
    true,
    null,
    null
  ),
  (
    'Bath Bombs Raspberry',
    'Bath bomb with a sweet raspberry scent.',
    60.00,
    null,
    'Bath Bombs',
    ARRAY[]::text[],
    false,
    true,
    null,
    null
  ),
  (
    'Bath Salts 3x150g Bundle',
    'Bundle of three 150g bath salts.',
    300.00,
    null,
    'Bath Salts',
    ARRAY[]::text[],
    false,
    true,
    150,
    ARRAY['Rose','Lavender','Jasmine','Ylang Ylang','Ocean','Mint','Eucalyptus']::text[]
  ),
  (
    'Bath Salts 250g',
    '250g bath salts.',
    350.00,
    null,
    'Bath Salts',
    ARRAY[]::text[],
    false,
    true,
    250,
    ARRAY['Rose','Lavender','Jasmine','Ylang Ylang','Ocean','Mint','Eucalyptus']::text[]
  ),
  (
    'Bath Salts 500g',
    '500g bath salts.',
    400.00,
    null,
    'Bath Salts',
    ARRAY[]::text[],
    false,
    true,
    500,
    ARRAY['Rose','Lavender','Jasmine','Ylang Ylang','Ocean','Mint','Eucalyptus']::text[]
  ),
  (
    'Box Set 3x150g + Bath Bomb + Spoon',
    'Box set with 3x150g bath salts, bath bomb, and bath salt spoon.',
    350.00,
    null,
    'Box Sets',
    ARRAY[]::text[],
    false,
    true,
    null,
    ARRAY['Rose','Lavender','Jasmine','Ylang Ylang','Ocean','Mint','Eucalyptus']::text[]
  ),
  (
    'Box Set 1x250g + Bath Bomb + Spoon',
    'Box set with 1x250g bath salts, bath bomb, and bath salt spoon.',
    400.00,
    null,
    'Box Sets',
    ARRAY[]::text[],
    false,
    true,
    null,
    ARRAY['Rose','Lavender','Jasmine','Ylang Ylang','Ocean','Mint','Eucalyptus']::text[]
  ),
  (
    'Box Set 1x500g + Bath Bomb + Spoon',
    'Box set with 1x500g bath salts, bath bomb, and bath salt spoon.',
    450.00,
    null,
    'Box Sets',
    ARRAY[]::text[],
    false,
    true,
    null,
    ARRAY['Rose','Lavender','Jasmine','Ylang Ylang','Ocean','Mint','Eucalyptus']::text[]
  );
