-- The insert/delete-specific triggers and trg_update_shop_stats both maintained
-- the same counter. Keep the specific triggers; retain the duplicate disabled
-- so its original definition remains available for rollback/audit.
BEGIN;
LOCK TABLE public.support_events IN SHARE ROW EXCLUSIVE MODE;
LOCK TABLE public.shop_stats IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE public.support_events DISABLE TRIGGER trg_update_shop_stats;

INSERT INTO public.shop_stats (shopid, likes_total)
SELECT shopid, count(*)::integer FROM public.support_events GROUP BY shopid
ON CONFLICT (shopid) DO UPDATE SET likes_total = EXCLUDED.likes_total;
UPDATE public.shop_stats s SET likes_total = 0
WHERE s.likes_total IS DISTINCT FROM 0
  AND NOT EXISTS (SELECT 1 FROM public.support_events e WHERE e.shopid = s.shopid);

-- Exercise the real RPC and both remaining triggers in a rolled-back subtransaction.
DO $$
DECLARE
  test_shop text := 'support-count-regression-' || gen_random_uuid()::text;
  test_session uuid := gen_random_uuid();
  result record;
  total integer;
BEGIN
  BEGIN
    SELECT * INTO result FROM public.toggle_support(test_shop, test_session);
    SELECT likes_total INTO total FROM public.shop_stats WHERE shopid = test_shop;
    IF result.ok IS DISTINCT FROM true OR result.liked IS DISTINCT FROM true
       OR result.likes IS DISTINCT FROM 1 OR total IS DISTINCT FROM 1 THEN
      RAISE EXCEPTION 'Single support must produce exactly one event and one aggregate count';
    END IF;
    SELECT * INTO result FROM public.toggle_support(test_shop, test_session);
    SELECT likes_total INTO total FROM public.shop_stats WHERE shopid = test_shop;
    IF result.ok IS DISTINCT FROM true OR result.liked IS DISTINCT FROM false
       OR result.likes IS DISTINCT FROM 0 OR total IS DISTINCT FROM 0 THEN
      RAISE EXCEPTION 'Cancellation must restore both counts to zero';
    END IF;
    RAISE EXCEPTION USING ERRCODE = 'ZX001', MESSAGE = 'Rollback test fixture';
  EXCEPTION WHEN SQLSTATE 'ZX001' THEN NULL;
  END;
  IF EXISTS (SELECT 1 FROM public.shop_stats s WHERE s.likes_total IS DISTINCT FROM
      (SELECT count(*)::integer FROM public.support_events e WHERE e.shopid = s.shopid)) THEN
    RAISE EXCEPTION 'Aggregate counts still differ from support events';
  END IF;
END;
$$;
COMMIT;
