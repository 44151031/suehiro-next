const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, mocks = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, require: name => name in mocks ? mocks[name] : require(name), process, Buffer, URL, Date, Intl, console });
  return exports;
}
const validation = load('src/lib/shopCommunityValidation.ts');
const base = { kind: 'support', nickname: 'お客さん', body: 'また行きます！', consent: 'yes' };
test('public UI hides the feature when disabled and escapes approved message text', () => {
  const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
  const {ShopCommunityProvider,ShopCommunityActions}=load('src/components/sections/shop/ShopCommunity.tsx',{'@/lib/shopCommunityValidation':validation});
  const child=React.createElement(ShopCommunityActions,{shop:{shopid:'test',name:'お店',address:''}});
  assert.equal(renderToStaticMarkup(React.createElement(ShopCommunityProvider,{community:null},child)),'');
  const html=renderToStaticMarkup(React.createElement(ShopCommunityProvider,{community:{key:'test',pagePath:'/test',messages:[{id:'test',shopid:'test',kind:'support',nickname:'利用者',body:'<script>alert(1)</script>',visit_month:null,created_at:'2026-09-15T01:00:00Z'}]}},child));
  assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('通報・削除依頼'));
});
test('accepts short messages, preserves text safely, requires consent', () => {
  assert.equal(validation.validateCommunityInput(base).body, base.body);
  assert.equal(validation.validateCommunityInput({...base,nickname:''}).nickname, 'まちのお客さん');
  assert.throws(() => validation.validateCommunityInput({...base,consent:undefined}));
  assert.throws(() => validation.validateCommunityInput({...base,body:'あ'.repeat(101)}));
  assert.throws(() => validation.validateCommunityInput({...base,nickname:'あ'.repeat(21)}));
});
test('rejects URLs, contacts, invalid months and unclassified corrections', () => {
  for (const body of ['https://example.com','mail@example.com','090-1234-5678']) assert.throws(() => validation.validateCommunityInput({...base,body}));
  assert.throws(() => validation.validateCommunityInput({...base,kind:'visit',visitMonth:'2099-01'}));
  assert.throws(() => validation.validateCommunityInput({...base,kind:'visit',visitMonth:'2026-13'}));
  assert.throws(() => validation.validateCommunityInput({...base,kind:'correction',reason:'invalid'}));
  assert.equal(validation.validateCommunityInput({...base,kind:'correction',reason:'店名・住所',body:'あ'.repeat(300)}).body.length,300);
});
test('API blocks disabled, foreign-origin, unknown shop, stale campaign and never accepts approval from visitor', async () => {
  let enabled = true, saved, rpcError = null;
  const scope = { key:'campaign@2026',pagePath:'/campaigns/aichi/ama/paypay',prefecture:'aichi',city:'ama',pay:'paypay',end:new Date('2099-01-01') };
  const db = { rpc: async (name,args) => { saved=args; return {error:rpcError}; } };
  const { POST } = load('src/app/api/shops/community/route.ts', {
    'next/server': { NextResponse: { json:(data,options)=>({data,status:options?.status??200}) } },
    '@/lib/shopCommunity': { communityEnabled:()=>enabled,communityScope:p=>p===scope.pagePath?scope:null,communityDatabase:()=>db },
    '@/lib/shopCommunityValidation':validation,
    '@/lib/loadShopList': { loadShopList:async()=>({'店舗':[{shopid:'shop-1',name:'確認済みの店'}]}) },
  });
  const oldUrl=process.env.NEXT_PUBLIC_SITE_URL, oldKey=process.env.SUPABASE_SERVICE_ROLE_KEY, oldVercel=process.env.VERCEL;
  const oldPreviewEnv=process.env.VERCEL_ENV, oldPreviewUrl=process.env.VERCEL_URL;
  process.env.NEXT_PUBLIC_SITE_URL='https://paycancampaign.com'; process.env.SUPABASE_SERVICE_ROLE_KEY='test-only'; delete process.env.VERCEL;
  const submit = (data={},origin='https://paycancampaign.com') => POST(new Request('https://paycancampaign.com/api/shops/community',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({...base,pagePath:scope.pagePath,campaignKey:scope.key,shopid:'shop-1',...data})}));
  try {
    enabled=false; assert.equal((await submit()).status,503); enabled=true;
    assert.equal((await submit({},'https://evil.example')).status,403);
    assert.equal((await submit({shopid:'missing'})).status,400);
    assert.equal((await submit({campaignKey:'old'})).status,400);
    assert.equal((await submit({pagePath:'/../../etc/passwd'})).status,400);
    assert.equal((await submit({website:'spam'})).status,400);
    assert.equal((await submit({body:'a'.repeat(9000)})).status,400);
    assert.equal((await submit({status:'approved',shop_name:'forged',fingerprint:'forged'})).status,200);
    assert.equal(saved.p_post.status,undefined); assert.equal(saved.p_post.shop_name,'確認済みの店');
    assert.match(saved.p_fingerprint,/^[a-f0-9]{64}$/); assert.notEqual(saved.p_fingerprint,'forged');
    process.env.VERCEL_ENV='preview'; process.env.VERCEL_URL='paycan-test.vercel.app';
    assert.equal((await submit({},'https://paycan-test.vercel.app')).status,200);
    assert.equal((await submit({},'https://unrelated.vercel.app')).status,403);
    process.env.VERCEL_ENV='production';
    assert.equal((await submit({},'https://paycan-test.vercel.app')).status,403);
    rpcError={message:'community_rate_limit'}; assert.equal((await submit()).status,429);
    rpcError={message:'unavailable'}; assert.equal((await submit()).status,503);
  } finally {
    for (const [key,value] of Object.entries({NEXT_PUBLIC_SITE_URL:oldUrl,SUPABASE_SERVICE_ROLE_KEY:oldKey,VERCEL:oldVercel,VERCEL_ENV:oldPreviewEnv,VERCEL_URL:oldPreviewUrl})) { if(value===undefined)delete process.env[key];else process.env[key]=value; }
  }
});
test('moderation checks authenticated admin on every action and does not publish corrections', async () => {
  let user=null, admin=false, writes=0;
  const { reviewCommunityPost }=load('src/app/admin/(protected)/community/actions.ts',{
    'next/cache':{revalidateTag:()=>{},revalidatePath:()=>{}},
    '@/lib/supabase/rsc':{createClientServerRSC:async()=>({auth:{getUser:async()=>({data:{user}})},from:()=>({select:()=>({eq:()=>({single:async()=>({data:{is_admin:admin}})})})})})},
    '@/lib/shopCommunity':{communityTag:'test',communityDatabase:()=>({from:()=>({select:()=>({eq:()=>({single:async()=>({data:{kind:'correction',page_path:'/campaigns'}})})}),update:()=>{writes++;return{eq:async()=>({error:null})};}})})},
  });
  const form=new FormData();form.set('id','11111111-1111-4111-8111-111111111111');form.set('status','approved');
  await assert.rejects(reviewCommunityPost(form));user={id:'admin'};
  await assert.rejects(reviewCommunityPost(form));admin=true;
  await assert.rejects(reviewCommunityPost(form));assert.equal(writes,0);
  form.set('status','resolved');await reviewCommunityPost(form);assert.equal(writes,1);
});
