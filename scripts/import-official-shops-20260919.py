"""Import the reviewed 2026 voucher lists downloaded to tmp/add-20260919.

Uses pdfplumber and lxml. The source links, dates and scope are saved with the
lists. Paper vouchers and unrelated PayPay campaigns must not be mixed in.
"""
from pathlib import Path
from collections import defaultdict
import csv, hashlib, json, re, sys, unicodedata
import pdfplumber
from lxml import html

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'tmp/add-20260919'
OUT = ROOT / 'public/data'
sources_path = OUT / 'shop-list-sources.json'
sources = json.loads(sources_path.read_text(encoding='utf-8-sig'))
def clean(s): return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', str(s or ''))).strip()
def row(name,address='',genre='掲載店舗',local=None,note=''):
    r=dict(name=clean(name),address=clean(address),genre=clean(genre) or '掲載店舗')
    if local is not None:
        r['voucherTypes']=['common','local'] if local else ['common']
        r['note']='共通券・専用券の両方が利用可能' if local else '共通券のみ利用可能（専用券は対象外）'
    if note:r['note']=note
    return r
def save(key,rows,url,note,date=None):
    p=OUT/(key+'-shops.json');old=json.loads(p.read_text(encoding='utf-8-sig')) if p.exists() else {}
    oldrows=[r for arr in old.values() for r in arr] if isinstance(old,dict) else old
    oldmap={(clean(r['name']),clean(r.get('address'))):r for r in oldrows}
    groups=defaultdict(list);seen=set()
    for r in rows:
        identity=(r['name'],r['address'])
        if not r['name'] or identity in seen:continue
        seen.add(identity);previous=oldmap.get(identity,{})
        digest=hashlib.sha256('|'.join(identity).encode()).hexdigest()[:12]
        item={k:v for k,v in r.items() if k!='genre'}
        item['storeid']=previous.get('storeid',key.split('-paypay')[0]+'-'+digest)
        item['shopid']=previous.get('shopid',key+'-'+digest)
        groups[r['genre']].append(item)
    assert seen,key
    p.write_text(json.dumps(groups,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    sources[key]=dict(url=url,checkedAt='2026-09-19',note=note,count=len(seen))
    if date:sources[key]['sourceDate']=date
    sources_path.write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(key,len(seen),flush=True)

rows=[]
with pdfplumber.open(RAW/'kamisu.pdf') as pdf:
    for page in pdf.pages:
        for table in page.extract_tables():
            for r in table:
                if len(r)==5 and clean(r[0]).isdigit():
                    rows.append(row(r[1],'神栖市'+clean(r[2]),r[4],page.page_number>=3))
save('ibaraki-kamisu-paypay-voucher',rows,'https://www.kamisu.or.jp/coupon2026/kameitend.pdf','2026デジタルクーポン専用の公式取扱店一覧。共通券・専用券の利用区分を表示しています。')

rows=[]
for name in ['shinagawa','oosaki','ooi','ebara','yashio']:
    with pdfplumber.open(RAW/f'shinagawa-{name}.pdf') as pdf:
        for page in pdf.pages:
            for table in page.extract_tables():
                for r in table:
                    if len(r)==6 and clean(r[5])=='B券対象' and r[0]!='店名':
                        both=clean(r[4])=='A券対象'
                        rows.append(row(r[0],'品川区'+clean(r[2])+clean(r[3])+'丁目',r[1],both,'A券・B券の両方が利用可能' if both else 'B券のみ利用可能（A券は対象外）'))
for suffix in ['', '-2026-first']:
    save('tokyo-shinagawa-paypay-voucher'+suffix,rows,'https://www.city.shinagawa.tokyo.jp/PC/sangyo/sangyo-syomono/sangyo-syomono-syogyo/20250623114336.html','区公式の5地区のデジタル商品券利用可能店舗リスト。第1回・第2回で店舗の対象範囲は変更なしと公式が案内。所在地は町名・丁目まで。','2026-08-17')

rows=[]
with pdfplumber.open(RAW/'nasukarasuyama.pdf') as pdf:
    p=pdf.pages[0]
    # Five visually verified columns; district headings stay with their shops.
    for x in [46,178,309,441,574]:
        area='';large=False
        for line in p.crop((x,435,x+125,931)).extract_text().splitlines():
            s=clean(line)
            if s in ['烏山地区','南那須地区']:continue
            if s.startswith('◆'):area=s.strip('◆');large=False;continue
            if s.replace(' ','')=='大型店':large=True;area='';continue
            rows.append(row(s,'那須烏山市'+area,local=not large))
save('tochigi-nasukarasuyama-paypay-voucher',rows,'https://www.city.nasukarasuyama.lg.jp/data/doc/1788774570_doc_32_0.pdf','第3弾デジタルわくわく商品券の取扱店一覧。所在地は公式の地区名まで。大型店で支店名の記載がないものは原文どおり掲載。','2026-09-07')

rows=[]
for name in ['a','ka','sa','ta','na','ha','ma','ya','ra']:
    with (RAW/f'sumida-{name}.csv').open(encoding='utf-8-sig',newline='') as f:
        for r in csv.DictReader(f):
            rows.append(row(r['店舗名'],r['住所'],r['カテゴリ'],True,'A券・B券の両方が利用可能（公式掲載一覧。最新状況はアプリで確認）'))
t=html.fromstring((RAW/'sumida-b.html').read_text(encoding='utf8'))
for x in t.xpath('//script|//style'):x.drop_tree()
for line in t.text_content().splitlines():
    s=clean(line)
    if s.startswith('◯') and not any(x in s for x in ['paypay取扱店','マルイ','区内全店']):
        rows.append(row(s.lstrip('◯'),'墨田区',local=False,note='B券のみ利用可能（公式掲載一覧。最新状況はアプリで確認）'))
save('tokyo-sumida-paypay-voucher',rows,'https://www.sumida-showren.jp/paypay/','商店街連合会が案内するA・B券対象店CSVとB券一覧から個別店を掲載。公式側も最新情報はアプリで確認するよう案内しているため、変更がある場合があります。商業施設の一括表記は省略。')

bivi=['ACTUS','unico','LIVINGHOUSE.','WORK.LAB by H.L.D','KaILE','BoConcept','フランスベッドギャラリー sleep+福岡','sleep+PREMIUM','マスターウォール福岡','浜本工芸','ジャストカーテン','HIDA','FUJI FURNITURE']
save('fukuoka-fukuoka-paypay-voucher',[row(n,'福岡市中央区渡辺通4丁目1-36 BiVi福岡','家具・インテリア') for n in bivi],'https://www.e-bivi.com/fukuoka/shop/pop-eventnews.jsp?id=357','BiVi福岡公式の2026年モバイル商品券対象13店舗。紙券とは対象が異なり、シアトルズベストコーヒーは対象外です。')

t=html.fromstring((RAW/'doramori.html').read_text(encoding='utf8'))
for city,pref in [('鳴門市','tokushima-naruto'),('島原市','nagasaki-shimabara')]:
    rows=[]
    for tr in t.xpath('//tr'):
        cells=[clean(x.text_content()) for x in tr.xpath('./td')]
        if len(cells)>=3 and city+'プレミアム付デジタル商品券' in cells[1] and '2026/' in cells[2]:
            rows.append(row('ドラッグストアモリ '+cells[0],city,'ドラッグストア',note='店舗公式が2026年度のデジタル商品券対応を案内'))
    save(pref+'-paypay-voucher',rows,'https://www.doramori.co.jp/premium/','店舗公式の2026年度デジタル商品券取扱いを確認した店舗の一部を掲載。全対象店舗の一覧ではありません。')

rows=[]
with pdfplumber.open(RAW/'kawasaki.pdf') as pdf:
    for page in pdf.pages:
        for table in page.extract_tables():
            for r in table:
                if len(r)!=7 or '〇' not in clean(r[5]):continue
                brand,name=clean(r[0]),clean(r[1])
                display=name if not brand or brand in name else (brand+' '+name if name else brand)
                rows.append(row(display,'川崎市'+clean(r[2])+clean(r[3]),r[4],'〇' in clean(r[6])))
        if page.page_number%20==0:print('川崎市',page.page_number,'/129',flush=True)
save('kanagawa-kawasaki-paypay-voucher',rows,'https://kawasaki-premium.com/doc/map/map_01.pdf','令和8年度公式特設サイトの全区版一覧。全店舗共通券・中小店舗専用券の対応を店舗ごとに表示。所在地は公式に記載された町名・丁目まで。','2026-09-18')
