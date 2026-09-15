-- Run once in the existing Supabase project. No existing tables are changed.
begin;
create table public.shop_community_posts (
  id uuid primary key default gen_random_uuid(),
  campaign_key text not null,
  page_path text not null,
  shopid text not null,
  shop_name text not null,
  kind text not null check (kind in ('support','visit','correction','report')),
  nickname text not null check (char_length(nickname) between 1 and 20),
  body text not null check (char_length(body) between 1 and 300),
  visit_month text,
  reason text,
  target_id uuid references public.shop_community_posts(id),
  status text not null default 'pending' check (status in ('pending','approved','hidden','resolved')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),
  check (status <> 'approved' or kind in ('support','visit')),
  check (kind not in ('support','visit') or char_length(body) <= 100)
);
create index shop_community_public on public.shop_community_posts(campaign_key, status, created_at desc);
create index shop_community_moderation on public.shop_community_posts(status, created_at desc);
alter table public.shop_community_posts enable row level security;
revoke all on public.shop_community_posts from public, anon, authenticated;
grant all on public.shop_community_posts to service_role;

-- Daily anonymous abuse-control buckets. Raw IP addresses are never stored.
create table public.shop_community_limits (
  fingerprint text primary key,
  hits integer not null default 0,
  expires_at timestamptz not null
);
alter table public.shop_community_limits enable row level security;
revoke all on public.shop_community_limits from public, anon, authenticated;
grant all on public.shop_community_limits to service_role;

create function public.submit_shop_community(p_fingerprint text, p_post jsonb)
returns uuid language plpgsql security invoker set search_path = public as $$
declare new_id uuid; used integer;
begin
  delete from public.shop_community_limits where expires_at < now();
  insert into public.shop_community_limits(fingerprint,hits,expires_at)
    values(p_fingerprint,1,now()+interval '2 days')
    on conflict(fingerprint) do update set hits=shop_community_limits.hits+1
    returning hits into used;
  if used > 10 then raise exception 'community_rate_limit'; end if;
  insert into public.shop_community_posts(campaign_key,page_path,shopid,shop_name,kind,nickname,body,visit_month,reason,target_id)
    values(p_post->>'campaign_key',p_post->>'page_path',p_post->>'shopid',p_post->>'shop_name',p_post->>'kind',p_post->>'nickname',p_post->>'body',p_post->>'visit_month',p_post->>'reason',(p_post->>'target_id')::uuid)
    returning id into new_id;
  return new_id;
end $$;
revoke all on function public.submit_shop_community(text,jsonb) from public, anon, authenticated;
grant execute on function public.submit_shop_community(text,jsonb) to service_role;

create function public.public_shop_messages(p_campaign_key text)
returns table(id uuid, shopid text, kind text, nickname text, body text, visit_month text, created_at timestamptz)
language sql stable security invoker set search_path = public as $$
  select id,shopid,kind,nickname,body,visit_month,created_at from (
    select p.id,p.shopid,p.kind,p.nickname,p.body,p.visit_month,p.created_at,
      row_number() over(partition by p.shopid order by p.created_at desc,p.id) as n
    from public.shop_community_posts p
    where p.campaign_key=p_campaign_key and p.status='approved' and p.kind in ('support','visit')
  ) ranked where n <= 3 order by created_at desc limit 1500;
$$;
revoke all on function public.public_shop_messages(text) from public, anon, authenticated;
grant execute on function public.public_shop_messages(text) to service_role;
commit;
