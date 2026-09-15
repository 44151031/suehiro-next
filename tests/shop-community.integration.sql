-- Run in the SQL editor AFTER the migration. All fixtures are rolled back.
begin;
do $$
declare n integer; i integer; v_id uuid; p jsonb;
begin
  if has_table_privilege('anon','public.shop_community_posts','SELECT') or
     has_table_privilege('authenticated','public.shop_community_posts','INSERT') or
     has_function_privilege('anon','public.submit_shop_community(text,jsonb)','EXECUTE') or
     has_function_privilege('authenticated','public.public_shop_messages(text)','EXECUTE') then
    raise exception 'Public privileges are too broad';
  end if;
  p := jsonb_build_object('campaign_key','integration-test','page_path','/test','shopid','test-shop',
    'shop_name','テスト用','kind','support','nickname','確認用','body','テスト用です');
  v_id := public.submit_shop_community('integration-test-fingerprint',p);
  select count(*) into n from public.public_shop_messages('integration-test');
  if n <> 0 then raise exception 'Pending content leaked'; end if;
  update public.shop_community_posts set status='approved' where shop_community_posts.id=v_id;
  select count(*) into n from public.public_shop_messages('integration-test');
  if n <> 1 then raise exception 'Approved content missing'; end if;
  update public.shop_community_posts set status='hidden' where shop_community_posts.id=v_id;
  select count(*) into n from public.public_shop_messages('integration-test');
  if n <> 0 then raise exception 'Hidden content leaked'; end if;
  for i in 2..10 loop perform public.submit_shop_community('integration-test-fingerprint',p); end loop;
  begin
    perform public.submit_shop_community('integration-test-fingerprint',p);
    raise exception 'Rate limit failed';
  exception when others then
    if sqlerrm <> 'community_rate_limit' then raise; end if;
  end;
  raise notice 'PASS: permissions, moderation visibility, daily rate limit';
end $$;
rollback;
