const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');

test('support button sends one request before rerender and releases lock after failure',async()=>{
  let calls=0, rejectRequest;
  const states=[0,false,false,true,false];
  const react={useContext:()=>null,useEffect:()=>{},useRef:()=>({current:false}),useState:()=>[states.shift(),()=>{}]};
  const mocks={
    react,
    'react/jsx-runtime':require('react/jsx-runtime'),
    '@/components/sections/shop/ShopSupportContext':{ShopSupportContext:{}},
    '@/app/actions/support':{toggleSupport:()=>{calls++;return new Promise((_,reject)=>{rejectRequest=reject;});}},
    sonner:{toast:{error:()=>{}}},
    '@/lib/supabase/client':{},
    '@/lib/sessionClient':{},
    '@/components/sections/shop/ShopCommunity':{useShopCommunity:()=>null},
  };
  const exports={};
  const code=ts.transpileModule(fs.readFileSync('src/components/common/SupportButton.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  vm.runInNewContext(code,{exports,require:n=>mocks[n],console});
  const button=exports.default({shopid:'test',initialLikes:0,initialLiked:false});
  assert.equal(button.props.type,'button');
  const first=button.props.onClick();
  await button.props.onClick();
  assert.equal(calls,1);
  rejectRequest(new Error('network'));await first;
  const retry=button.props.onClick();assert.equal(calls,2);
  rejectRequest(new Error('network'));await retry;
});
