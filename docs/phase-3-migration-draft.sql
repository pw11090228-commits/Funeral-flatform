-- 검토용 Migration 초안. 실제 DB에 적용하지 마세요.
-- 전제: Supabase PostgreSQL, auth.users, auth.uid(), anon/authenticated/service_role.
-- 적용 전 별도 승인 및 RLS/보안/동시성 검증 필요.
begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table private.admin_roles (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role in ('admin', 'editor', 'counselor')),
  created_at timestamptz not null default now()
);
revoke all on private.admin_roles from public, anon, authenticated;

-- 함수 소유자는 RLS를 우회할 수 있는 신뢰된 소유자여야 한다.
-- 사용자 제공 값을 받지 않고 현재 인증 사용자의 역할만 반환한다.
create function private.has_role(allowed text[]) returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from private.admin_roles r
                     where r.user_id = (select auth.uid()) and r.role = any(allowed)); $$;
revoke all on function private.has_role(text[]) from public, anon;
grant execute on function private.has_role(text[]) to authenticated;

create table public.data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text,
  source_type text not null check (source_type in ('provider', 'public_source', 'platform_estimate', 'unknown')),
  published_at date,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.companies (
  id uuid primary key default gen_random_uuid(), name text not null, summary text,
  source_id uuid references public.data_sources(id), checked_at timestamptz,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified','needs_review')),
  information_origin text not null default 'unknown' check (information_origin in ('provider','public_source','platform_estimate','unknown')),
  is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (verification_status <> 'verified' or (source_id is not null and checked_at is not null))
);
create table public.products (
  id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id),
  name text not null, description text, is_sponsored boolean not null default false,
  source_id uuid references public.data_sources(id), checked_at timestamptz,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified','needs_review')),
  information_origin text not null default 'unknown' check (information_origin in ('provider','public_source','platform_estimate','unknown')),
  is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (verification_status <> 'verified' or (source_id is not null and checked_at is not null))
);
create table public.product_prices (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id),
  total_price_krw bigint check (total_price_krw between 0 and 9007199254740991),
  monthly_payment_krw bigint check (monthly_payment_krw between 0 and 9007199254740991),
  payment_months integer check (payment_months > 0), terms text,
  effective_from date not null, recorded_at timestamptz not null default clock_timestamp(),
  source_id uuid references public.data_sources(id), checked_at timestamptz,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified','needs_review')),
  information_origin text not null default 'unknown' check (information_origin in ('provider','public_source','platform_estimate','unknown')),
  supersedes_id uuid references public.product_prices(id),
  check (verification_status <> 'verified' or (source_id is not null and checked_at is not null))
);
create index product_prices_lookup on public.product_prices (product_id, effective_from desc, recorded_at desc, id desc);
create unique index product_price_correction_once on public.product_prices (supersedes_id) where supersedes_id is not null;
create table public.product_services (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id),
  name text not null, service_type text not null check (service_type in ('included','excluded','additional')),
  quantity numeric check (quantity >= 0), unit text,
  additional_cost_krw bigint check (additional_cost_krw between 0 and 9007199254740991), conditions text,
  source_id uuid references public.data_sources(id), checked_at timestamptz,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified','needs_review')),
  information_origin text not null default 'unknown' check (information_origin in ('provider','public_source','platform_estimate','unknown')),
  check (verification_status <> 'verified' or (source_id is not null and checked_at is not null))
);
create table public.funeral_halls (
  id uuid primary key default gen_random_uuid(), name text not null, region text not null, district text,
  address text not null, latitude numeric check (latitude between -90 and 90), longitude numeric check (longitude between -180 and 180), summary text,
  source_id uuid references public.data_sources(id), checked_at timestamptz,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified','needs_review')),
  information_origin text not null default 'unknown' check (information_origin in ('provider','public_source','platform_estimate','unknown')),
  is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (verification_status <> 'verified' or (source_id is not null and checked_at is not null))
);
create table public.hall_facilities (
  id uuid primary key default gen_random_uuid(), hall_id uuid not null references public.funeral_halls(id),
  name text not null, facility_type text not null, quantity integer check (quantity >= 0), details text,
  source_id uuid references public.data_sources(id), checked_at timestamptz,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified','needs_review')),
  information_origin text not null default 'unknown' check (information_origin in ('provider','public_source','platform_estimate','unknown')),
  unique (id, hall_id),
  check (verification_status <> 'verified' or (source_id is not null and checked_at is not null))
);
create table public.hall_fee_items (
  id uuid primary key default gen_random_uuid(), hall_id uuid not null references public.funeral_halls(id),
  facility_id uuid, name text not null, fee_type text not null, conditions text,
  foreign key (facility_id, hall_id) references public.hall_facilities(id, hall_id)
);
create table public.hall_fee_prices (
  id uuid primary key default gen_random_uuid(), fee_item_id uuid not null references public.hall_fee_items(id),
  amount_krw bigint check (amount_krw between 0 and 9007199254740991), billing_unit text not null, conditions text,
  effective_from date not null, recorded_at timestamptz not null default clock_timestamp(),
  source_id uuid references public.data_sources(id), checked_at timestamptz,
  verification_status text not null default 'unverified' check (verification_status in ('verified','unverified','needs_review')),
  information_origin text not null default 'unknown' check (information_origin in ('provider','public_source','platform_estimate','unknown')),
  supersedes_id uuid references public.hall_fee_prices(id),
  check (verification_status <> 'verified' or (source_id is not null and checked_at is not null))
);
create index hall_fee_prices_lookup on public.hall_fee_prices (fee_item_id, effective_from desc, recorded_at desc, id desc);
create unique index hall_fee_correction_once on public.hall_fee_prices (supersedes_id) where supersedes_id is not null;

create table private.verification_events (
  id uuid primary key default gen_random_uuid(), target_type text not null, target_id uuid not null,
  source_id uuid references public.data_sources(id), status text not null check (status in ('verified','unverified','needs_review')),
  checked_at timestamptz not null, checked_by uuid references auth.users(id) on delete set null,
  note text, created_at timestamptz not null default now()
);
create table private.admin_audit_logs (
  id bigint generated always as identity primary key, actor_id uuid references auth.users(id) on delete set null,
  target_type text not null, target_id uuid not null, action text not null,
  before_data jsonb, after_data jsonb, created_at timestamptz not null default now()
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.products(id), hall_id uuid references public.funeral_halls(id),
  created_at timestamptz not null default now(),
  check ((product_id is not null)::int + (hall_id is not null)::int = 1)
);
create unique index favorites_product_unique on public.favorites (user_id, product_id) where product_id is not null;
create unique index favorites_hall_unique on public.favorites (user_id, hall_id) where hall_id is not null;
create table public.consultations (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  requester_type text not null check (requester_type in ('guest','member')),
  name text not null check (char_length(btrim(name)) between 1 and 50),
  phone text not null check (char_length(btrim(phone)) between 8 and 20),
  message text not null check (char_length(btrim(message)) between 1 and 2000),
  product_id uuid references public.products(id), hall_id uuid references public.funeral_halls(id),
  consented_at timestamptz not null, consent_version text not null,
  status text not null default 'received' check (status in ('received','in_progress','completed','closed')),
  retention_until timestamptz not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (requester_type <> 'guest' or user_id is null)
);
create index consultations_user_created on public.consultations (user_id, created_at desc);
create index consultations_retention on public.consultations (retention_until);

-- 가격 이력의 수정·삭제 및 임의 기록 시각을 차단한다.
create function private.price_insert_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.recorded_at := clock_timestamp();
  if tg_table_name = 'product_prices' and new.supersedes_id is not null then
    if not exists (select 1 from public.product_prices p where p.id = new.supersedes_id and p.product_id = new.product_id and p.effective_from = new.effective_from) then
      raise exception '정정 대상 상품과 적용일이 일치하지 않습니다';
    end if;
  elsif tg_table_name = 'hall_fee_prices' and new.supersedes_id is not null then
    if not exists (select 1 from public.hall_fee_prices p where p.id = new.supersedes_id and p.fee_item_id = new.fee_item_id and p.effective_from = new.effective_from) then
      raise exception '정정 대상 요금과 적용일이 일치하지 않습니다';
    end if;
  end if;
  return new;
end; $$;
create function private.reject_price_change() returns trigger language plpgsql set search_path = '' as $$
begin raise exception '가격 이력은 수정·삭제할 수 없습니다'; end; $$;
create trigger product_price_insert before insert on public.product_prices for each row execute function private.price_insert_guard();
create trigger hall_fee_price_insert before insert on public.hall_fee_prices for each row execute function private.price_insert_guard();
create trigger product_price_immutable before update or delete on public.product_prices for each row execute function private.reject_price_change();
create trigger hall_fee_price_immutable before update or delete on public.hall_fee_prices for each row execute function private.reject_price_change();

-- 상품·시설 데이터 변경 기록. 상담·프로필 등 개인정보는 기록하지 않는다.
create function private.audit_catalog() returns trigger
language plpgsql security definer set search_path = '' as $$
declare old_row jsonb; new_row jsonb; target uuid;
begin
  if tg_op <> 'INSERT' then old_row := to_jsonb(old); end if;
  if tg_op <> 'DELETE' then new_row := to_jsonb(new); end if;
  target := coalesce((new_row->>'id')::uuid, (old_row->>'id')::uuid);
  insert into private.admin_audit_logs(actor_id,target_type,target_id,action,before_data,after_data)
    values ((select auth.uid()),tg_table_name,target,tg_op,old_row,new_row);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end; $$;

-- 상담 변경 이력은 상태만 기록한다. 이름·연락처·상담 내용은 기록하지 않는다.
create function private.audit_consultation_status() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.status is distinct from new.status then
    insert into private.admin_audit_logs(actor_id,target_type,target_id,action,before_data,after_data)
      values ((select auth.uid()), 'consultations', new.id, 'STATUS',
              jsonb_build_object('status',old.status), jsonb_build_object('status',new.status));
  end if;
  return new;
end; $$;
create trigger consultation_status_audit after update of status on public.consultations
  for each row execute function private.audit_consultation_status();

-- 공개 테이블은 행 보안과 명시적 GRANT를 함께 적용한다.
revoke all on public.data_sources, public.companies, public.products, public.product_prices,
  public.product_services, public.funeral_halls, public.hall_facilities, public.hall_fee_items,
  public.hall_fee_prices, public.profiles, public.favorites, public.consultations from anon, authenticated;
revoke all on private.admin_roles, private.verification_events, private.admin_audit_logs from public, anon, authenticated;
grant select, insert, update, delete on public.consultations to service_role;
grant select, insert on private.verification_events to service_role;
grant select on private.admin_audit_logs to service_role;
grant select on public.data_sources, public.companies, public.products, public.product_prices,
  public.product_services, public.funeral_halls, public.hall_facilities, public.hall_fee_items,
  public.hall_fee_prices to anon, authenticated;
grant select, insert, update, delete on public.data_sources, public.companies, public.products,
  public.product_services, public.funeral_halls, public.hall_facilities, public.hall_fee_items to authenticated;
grant insert on public.product_prices, public.hall_fee_prices to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select on public.consultations to authenticated;
grant update (status, updated_at) on public.consultations to authenticated;

do $$
declare n text;
begin
  foreach n in array array['data_sources','companies','products','product_prices','product_services','funeral_halls','hall_facilities','hall_fee_items','hall_fee_prices','profiles','favorites','consultations'] loop
    execute format('alter table public.%I enable row level security', n);
  end loop;
  foreach n in array array['data_sources','companies','products','product_prices','product_services','funeral_halls','hall_facilities','hall_fee_items','hall_fee_prices'] loop
    execute format('create trigger audit_catalog after insert or update or delete on public.%I for each row execute function private.audit_catalog()', n);
  end loop;
end $$;

create policy sources_public on public.data_sources for select to anon, authenticated using (is_published);
create policy companies_public on public.companies for select to anon, authenticated using (is_published);
create policy products_public on public.products for select to anon, authenticated using (is_published and exists (select 1 from public.companies c where c.id = company_id and c.is_published));
create policy product_prices_public on public.product_prices for select to anon, authenticated using (exists (select 1 from public.products p join public.companies c on c.id = p.company_id where p.id = product_id and p.is_published and c.is_published));
create policy product_services_public on public.product_services for select to anon, authenticated using (exists (select 1 from public.products p join public.companies c on c.id = p.company_id where p.id = product_id and p.is_published and c.is_published));
create policy halls_public on public.funeral_halls for select to anon, authenticated using (is_published);
create policy facilities_public on public.hall_facilities for select to anon, authenticated using (exists (select 1 from public.funeral_halls h where h.id = hall_id and h.is_published));
create policy fee_items_public on public.hall_fee_items for select to anon, authenticated using (exists (select 1 from public.funeral_halls h where h.id = hall_id and h.is_published));
create policy fee_prices_public on public.hall_fee_prices for select to anon, authenticated using (exists (select 1 from public.hall_fee_items f join public.funeral_halls h on h.id = f.hall_id where f.id = fee_item_id and h.is_published));

do $$
declare n text;
begin
  foreach n in array array['data_sources','companies','products','product_services','funeral_halls','hall_facilities','hall_fee_items'] loop
    execute format('create policy catalog_staff_select on public.%I for select to authenticated using (private.has_role(array[''admin'',''editor'']))', n);
    execute format('create policy catalog_staff_insert on public.%I for insert to authenticated with check (private.has_role(array[''admin'',''editor'']))', n);
    execute format('create policy catalog_staff_update on public.%I for update to authenticated using (private.has_role(array[''admin'',''editor''])) with check (private.has_role(array[''admin'',''editor'']))', n);
    execute format('create policy catalog_admin_delete on public.%I for delete to authenticated using (private.has_role(array[''admin'']))', n);
  end loop;
  foreach n in array array['product_prices','hall_fee_prices'] loop
    execute format('create policy price_staff_select on public.%I for select to authenticated using (private.has_role(array[''admin'',''editor'']))', n);
    execute format('create policy price_staff_insert on public.%I for insert to authenticated with check (private.has_role(array[''admin'',''editor'']))', n);
  end loop;
end $$;

create policy profile_select on public.profiles for select to authenticated using (user_id = (select auth.uid()));
create policy profile_insert on public.profiles for insert to authenticated with check (user_id = (select auth.uid()));
create policy profile_update on public.profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy favorites_select on public.favorites for select to authenticated using (user_id = (select auth.uid()));
create policy favorites_insert on public.favorites for insert to authenticated with check (user_id = (select auth.uid()) and ((product_id is not null and exists (select 1 from public.products p join public.companies c on c.id = p.company_id where p.id = product_id and p.is_published and c.is_published)) or (hall_id is not null and exists (select 1 from public.funeral_halls h where h.id = hall_id and h.is_published))));
create policy favorites_delete on public.favorites for delete to authenticated using (user_id = (select auth.uid()));
create policy consultations_own_read on public.consultations for select to authenticated using (user_id = (select auth.uid()));
create policy consultations_staff_read on public.consultations for select to authenticated using (private.has_role(array['admin','counselor']));
create policy consultations_staff_update on public.consultations for update to authenticated using (private.has_role(array['admin','counselor'])) with check (private.has_role(array['admin','counselor']));

-- 익명·회원 모두 상담 INSERT는 Edge Function의 service_role 경유만 허용.
-- private 스키마는 API에 노출하지 않으며 관리자 감사/검증 조회도 서버 경유.
commit;
