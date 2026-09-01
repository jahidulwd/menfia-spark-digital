-- ROLES ---------------------------------------------------------------
create type public.app_role as enum ('admin', 'customer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, case when lower(new.email) = 'jahidulwd@gmail.com' then 'admin'::public.app_role else 'customer'::public.app_role end)
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- PRODUCTS ------------------------------------------------------------
create type public.product_type as enum ('theme', 'template', 'script', 'plugin', 'service', 'other');
create type public.product_status as enum ('draft', 'published');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  type public.product_type not null default 'template',
  status public.product_status not null default 'draft',
  featured boolean not null default false,
  price_cents integer not null default 0,
  currency text not null default 'USD',
  cover_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  demo_url text,
  version text,
  file_path text,
  external_download_url text,
  paddle_price_id text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "published products are public" on public.products for select to anon, authenticated using (status = 'published');
create policy "admins manage products" on public.products for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ORDERS --------------------------------------------------------------
create type public.order_status as enum ('pending', 'paid', 'failed', 'refunded');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  email text not null,
  amount_cents integer not null default 0,
  currency text not null default 'USD',
  status public.order_status not null default 'pending',
  paddle_transaction_id text,
  created_at timestamptz not null default now()
);
grant select on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "read own orders" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "admins manage orders" on public.orders for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- CMS PAGES -----------------------------------------------------------
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo_description text,
  content text not null default '',
  published boolean not null default true,
  show_in_footer boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
grant select on public.pages to anon, authenticated;
grant all on public.pages to service_role;
alter table public.pages enable row level security;
create policy "published pages are public" on public.pages for select to anon, authenticated using (published);
create policy "admins manage pages" on public.pages for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- CONTACT -------------------------------------------------------------
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  website text,
  project_type text,
  budget text,
  timeline text,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
grant all on public.contact_submissions to service_role;
grant select, update on public.contact_submissions to authenticated;
alter table public.contact_submissions enable row level security;
create policy "admins read submissions" on public.contact_submissions for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "admins update submissions" on public.contact_submissions for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- SETTINGS (paddle config etc, admin only) ----------------------------
create table public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant all on public.app_settings to service_role;
alter table public.app_settings enable row level security;

insert into public.app_settings (key, value) values
  ('paddle', '{"environment":"sandbox","client_token":"","api_key":"","webhook_secret":""}'::jsonb);

insert into public.pages (slug, title, seo_description, content, sort_order) values
  ('terms-and-conditions', 'Terms & Conditions', 'The terms that govern use of Menfia Digital products and services.', E'## 1. Agreement\n\nBy purchasing or using any Menfia Digital product you agree to these terms.\n\n## 2. Licence\n\nEach purchase grants a single-project licence unless an extended licence is bought.\n\n## 3. Support\n\nProduct support covers bugs and defects for 6 months from purchase.', 1),
  ('privacy-policy', 'Privacy Policy', 'How Menfia Digital collects, uses and protects your data.', E'## Data we collect\n\nWe collect your name, email and purchase history to deliver your products and support.\n\n## How we use it\n\nOrder fulfilment, product updates and support. We never sell your data.\n\n## Contact\n\nEmail jahidulwd@gmail.com for any data request.', 2),
  ('refund-policy', 'Refund Policy', 'Our refund terms for digital products.', E'## 14-day refunds\n\nDigital products can be refunded within 14 days if the item is faulty or materially different from its description.\n\n## Not eligible\n\nChange of mind after download, or partial use of a licence.\n\n## How to request\n\nEmail jahidulwd@gmail.com with your order ID.', 3);