// Creates campaign artwork from local HTML/CSS and existing city photographs.
// No network resources or fonts are required. Run: node scripts/generate-september-campaign-images.cjs
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
function read(relative, key) {
  const mod = { exports: {} };
  new Function('exports', ts.transpile(fs.readFileSync(path.join(root, relative), 'utf8'), { module: ts.ModuleKind.CommonJS }))(mod.exports);
  return mod.exports[key];
}
const campaigns = [...read('src/lib/campaignAdditions202609.ts', 'campaignAdditions202609'), ...read('src/lib/voucherAdditions202609.ts', 'voucherAdditions202609')];
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = { paypay: 'PayPay', aupay: 'au PAY', dbarai: 'd払い', 'paypay-voucher': 'PayPay商品券' };
const out = path.join(root, 'public/images/campaigns');
const date = s => s.slice(0,10).replaceAll('-', '.');
const base = '<style>*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;font-family:"Yu Gothic","Meiryo",sans-serif;color:#162b32}.scene{position:absolute;inset:0;background:linear-gradient(145deg,#d6eee8,#e8f3e2 45%,#f9dcb2)}.scene:before{content:"";position:absolute;width:900px;height:900px;border:90px solid #fff7;border-radius:50%;left:500px;top:-500px}.street{position:absolute;bottom:0;left:0;right:0;height:170px;background:linear-gradient(transparent,#1b586533)}.building{position:absolute;bottom:40px;width:100px;background:#fff8;border-radius:7px 7px 0 0;box-shadow:inset 0 -30px #225f6633}.building:after{content:"";position:absolute;inset:20px 20px 40px;background:repeating-linear-gradient(0deg,transparent 0 20px,#26798144 20px 30px)}.brand{position:absolute;right:45px;bottom:26px;font-size:26px;font-weight:900}.brand b{color:#c92b34}</style>';
const scene = '<div class="scene"><div class="street"></div>'+[0,1,2,3,4,5,6,7].map((n)=>`<div class="building" style="left:${n*160-30}px;height:${110+(n%3)*45}px"></div>`).join('')+'</div>';
(async () => {
 const browser = await puppeteer.launch({ headless: true, pipe: true, args: ['--no-sandbox', '--disable-gpu'] });
 try {
  const page = await browser.newPage(); await page.setViewport({width:1200,height:630,deviceScaleFactor:1});
  for(const c of campaigns) {
   const cityKey = `${c.prefectureSlug}-${c.citySlug}`;
   const bg = path.join(out, `${cityKey}.webp`);
   if(!fs.existsSync(bg)) {
    await page.setContent(base+scene+`<div class="brand"><b>Pay</b>キャン · ${escape(c.city)}</div>`);
    await sharp(await page.screenshot({type:'png'})).webp({quality:88}).toFile(bg);
   }
   const voucher = c.paytype === 'paypay-voucher';
   const rate = voucher ? Math.round((c.ticketAmount-c.purchasePrice)/c.purchasePrice*100) : c.offer;
   const photo = fs.readFileSync(bg).toString('base64');
   const range = voucher ? `利用期限 ${date(c.useEndDate)}` : `${date(c.startDate)} — ${date(c.endDate)}`;
   const benefit = voucher ? `${c.purchasePrice.toLocaleString()}円で${c.ticketAmount.toLocaleString()}円分` : `1回 ${Number(c.onepoint).toLocaleString()}pt / 期間 ${Number(c.fullpoint).toLocaleString()}pt`;
   await page.setContent(base+`<div style="position:absolute;inset:0;background:linear-gradient(90deg,#f8faf9 0%,#f8faf9ed 58%,#f8faf999 100%),url(data:image/webp;base64,${photo}) center/cover"></div><main style="position:absolute;inset:42px 50px"><div style="font-size:23px;font-weight:800;color:#217468">${escape(c.prefecture)} ${escape(c.city)} · ${labels[c.paytype]}</div><h1 style="font-size:${c.campaigntitle.length>30?30:36}px;line-height:1.4;margin:22px 0 5px;max-width:1070px">${escape(c.campaigntitle)}</h1><div style="display:flex;align-items:baseline;gap:12px;margin-top:8px"><span style="font-size:34px;font-weight:800">最大</span><strong style="font-size:150px;line-height:1.2;letter-spacing:-8px;color:#cf2937">${rate}</strong><span style="font-size:58px;font-weight:800">%</span><span style="font-size:34px;font-weight:800">${voucher?'お得':'還元'}</span></div><p style="font-size:29px;font-weight:800;margin:8px 0">${benefit}</p><p style="font-size:25px;margin:18px 0">${range}</p>${c.salesStatus==='sold-out'?'<span style="background:#34484e;color:white;border-radius:6px;padding:7px 15px;font-size:22px">完売・購入済み商品券は利用可能</span>':''}</main><div class="brand"><b>Pay</b>キャン</div>`);
   await page.evaluate(()=>document.fonts.ready);
   const assetKey = `${cityKey}-${c.paytype}${c.campaignSlug?`-${c.campaignSlug}`:''}`;
   await page.screenshot({path:path.join(out,'ogp',`${assetKey}-ogp.jpg`),type:'jpeg',quality:90});
   console.log(assetKey);
  }
 } finally { await browser.close(); }
})();
