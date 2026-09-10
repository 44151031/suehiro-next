"""Import reviewed September 2026 official lists from tmp/shop-import.

Requires pdfplumber and lxml. Source URLs are recorded beside the generated
lists in public/data/shop-list-sources.json. Never infer payment acceptance
from a different service's list. Existing matching shop IDs are retained.
"""
from pathlib import Path
from collections import defaultdict
from urllib.parse import unquote
import hashlib
import json
import re
import unicodedata
import pdfplumber
from lxml import html

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / 'tmp/shop-import'
OUT = ROOT / 'public/data'
sources = {}

def clean(value):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', str(value or ''))).strip()

def key(value):
    return re.sub(r'\s+', '', clean(value)).casefold()

def row(name, address='', genre='掲載店舗', note=''):
    return dict(name=clean(name), address=clean(address), genre=clean(genre) or '掲載店舗', note=clean(note))

def tables(city):
    with pdfplumber.open(RAW / f'{city}.pdf') as pdf:
        for page in pdf.pages:
            yield from page.extract_tables()

def save(pref, city, pay, rows, url, note, source_date=None):
    base = f'{pref}-{city}-{pay}'
    path = OUT / f'{base}-shops.json'
    old = json.loads(path.read_text(encoding='utf-8-sig')) if path.exists() else {}
    oldrows = [r for group in old.values() for r in group] if isinstance(old, dict) else old
    byname = defaultdict(list)
    for r in oldrows:
        byname[key(r['name'])].append(r)
    groups, seen, retained = defaultdict(list), set(), 0
    for r in rows:
        identity = (key(r['name']), key(r['address']))
        if not r['name'] or identity in seen:
            continue
        seen.add(identity)
        matches = byname[key(r['name'])]
        exact = [x for x in matches if key(x.get('address')) == identity[1]]
        previous = exact[0] if len(exact) == 1 else (matches[0] if len(matches) == 1 else {})
        digest = hashlib.md5((r['name'] + ('-' + r['address'] if r['address'] else '')).encode()).hexdigest()[:6]
        storeid = previous.get('storeid') or f'{city}-{digest}'
        shopid = previous.get('shopid') or f'{storeid}-{pay}'
        retained += bool(previous.get('shopid'))
        item = dict(name=r['name'], address=r['address'], storeid=storeid, shopid=shopid)
        if r['note']:
            item['note'] = r['note']
        if 'voucherTypes' in r:
            item['voucherTypes'] = r['voucherTypes']
        if 'benefit' in r:
            item['benefit'] = r['benefit']
        groups[r['genre']].append(item)
    ids = [x['shopid'] for group in groups.values() for x in group]
    assert ids and len(ids) == len(set(ids)), f'Duplicate IDs: {base}'
    path.write_text(json.dumps(groups, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    sources[base] = dict(url=url, checkedAt='2026-09-10', note=note, count=len(ids))
    if source_date:
        sources[base]['sourceDate'] = source_date
    print(base, len(ids), 'retained IDs:', retained)

payments = {'paypay':'PayPay', 'dbarai':'d払い', 'aupay':'au PAY', 'rakutenpay':'楽天ペイ', 'aeonpay':'AEON Pay'}
rows = defaultdict(list)
for table in tables('yurihonjo'):
    for r in table:
        if len(r) != 5 or '%' not in clean(r[0]):
            continue
        for pay, label in payments.items():
            if key(label) in key(r[4]):
                item = row(r[1], r[3], note=f'最大{clean(r[0])}還元')
                item['benefit'] = dict(rate=float(clean(r[0]).replace('%', '')), type='cashback')
                rows[pay].append(item)
for pay, items in rows.items():
    save('akita','yurihonjo',pay,items,'https://yurihonjo-cashless.jp/wp-content/uploads/2026/09/storelist-2026-09-09.pdf','公式一覧の対象決済サービスで絞り込んでいます。未掲載の対象店もあります。一般店と大型店では還元率が異なります。','2026-09-09')

rows = defaultdict(list)
for table in tables('makurazaki'):
    for r in table:
        if len(r) != 9 or not clean(r[0]).isdigit():
            continue
        for col, pay in enumerate(['dbarai','aupay','paypay','rakutenpay','paydon'],3):
            if '●' in (r[col] or ''):
                rows[pay].append(row(r[1], '枕崎市'+clean(r[2]), r[8]))
for pay, items in rows.items():
    save('kagoshima','makurazaki',pay,items,'https://www.city.makurazaki.lg.jp/uploaded/attachment/22891.pdf','各決済の対応マークがある店舗のみ掲載。所在地は公式一覧に記載された町名までです。','2026-08-31')

rows = []
region = ''
for table in tables('takehara'):
    for r in table:
        if len(r) != 3 or not r[-1] or '店舗名' in r[-1]:
            continue
        region = clean(r[0] or r[1]) or region
        rows.append(row(r[-1], '竹原市'+region))
save('hiroshima','takehara','paypay',rows,'https://www.city.takehara.lg.jp/material/files/group/6/dai7dan-rist.pdf','公式の第7弾対象店舗一覧を掲載。所在地は地域名までです。未掲載の対象店もあります。')

rows = []
for table in tables('misato'):
    for r in table:
        if len(r)!=2 or not r[0] or r[0]=='店舗名': continue
        # Mall-wide entries include exceptions, so do not treat them as individual stores.
        if 'ららぽーと新三郷' in r[0] and ('対象外' in r[0] or '下記店舗' in r[0]): continue
        rows.append(row(r[0], genre=r[1]))
save('saitama','misato','paypay-voucher',rows,'https://www.city.misato.lg.jp/material/files/group/21/20260901_tenpoichiran.pdf','個別の店舗名が確認できる店舗を掲載。ららぽーと新三郷・ANNEXの館内店舗は公式PDFの対象外条件をご確認ください。','2026-09-01')

rows = []
for table in tables('tondabayashi'):
    for r in table:
        if len(r)!=5 or not r[0] or not any(mark in (r[3] or '') for mark in ['〇','○']): continue
        both = any(mark in (r[4] or '') for mark in ['〇','○'])
        item = row(r[0], '富田林市'+clean(r[1]), r[2], '共通券・地元応援券が利用可能' if both else '共通券のみ利用可能（地元応援券は対象外）')
        item['voucherTypes'] = ['common', 'local'] if both else ['common']
        rows.append(item)
save('osaka','tondabayashi','paypay-voucher',rows,'https://www.city.tondabayashi.lg.jp/uploaded/attachment/115818.pdf','とっぴーPAY対象店。共通券と地元応援券の区分を店舗ごとに表示しています。')

rows=[]
with pdfplumber.open(RAW/'ako.pdf') as pdf:
    for p in pdf.pages:
        for table in p.extract_tables({'vertical_strategy':'explicit','explicit_vertical_lines':[37.464,182,326,567.206]}):
            for r in table:
                if len(r)==3 and clean(r[2]).startswith('赤穂市'):
                    name = clean(r[1]) or clean(r[0])
                    if r[0] and name in ['赤穂SS','西相生トラックステーション','西兵庫トラックステーション','赤穂店']: name=clean(r[0])+' '+name
                    rows.append(row(name,r[2]))
save('hyogo','ako','paypay-voucher',rows,'https://www.city.ako.lg.jp/sangyoshinko/shoukou/documents/0901tennporisuto.pdf','あこう地域応援デジタル商品券の対象店。公式一覧にも未掲載の店舗があります。','2026-09-01')

h=html.parse(str(RAW/'kinokawa.html'))
rows=[]
for li in h.xpath('//ul[@id="shopList"]/li'):
    def field(cls): return clean(' '.join(li.xpath(f'.//div[@class="{cls}"]//text()')))
    rows.append(row(field('shop_name'),field('shop_address'),field('shop_type')))
save('wakayama','kinokawa','paypay-voucher',rows,'https://kinokawa-digi.com/list.html','紀の川市プレミアム付デジタル商品券の公式取扱店一覧から掲載しています。')

rows=[]
for i in range(1,42):
    h=html.parse(str(RAW/('nishiwaki.html' if i==1 else f'nishiwaki-{i}.html')))
    for a in h.xpath('//article[contains(@class,"gift_type-digital")]'):
        name=clean(' '.join(a.xpath('.//h2//text()')))
        maps=a.xpath('.//a[contains(@href,"google.com/maps/search/")]/@href')
        address=clean(unquote(maps[0].split('/search/')[1])) if maps else ''
        if address.endswith(name): address=address[:-len(name)].strip()
        else: address=''
        category=clean(' '.join(a.xpath('./div[1]//li/div//text()')))
        rows.append(row(name,address,category))
save('hyogo','nishiwaki','paypay-voucher',rows,'https://nishiwaki-premium-2026.com/stores/','公式一覧の「デジタル商品券」対応店のみ掲載。紙商品券のみ対応する店舗は含みません。')

rows=[]
categories=['食品・スーパー','ドラッグストア','電器・ホームセンター','ファッション','ガソリンスタンド・洗車','その他']
category=categories[0]
for table in tables('tokai'):
    for r in table:
        for col, value in enumerate(r):
            text=clean(value)
            if text in categories: category=text; continue
            if not text or text=='飲食店' or '専門店(' in text: continue
            genre=category if col==0 else '飲食店'
            # Explicitly listed branch suffixes, not inferred branches.
            if '、' in text:
                brand, branches=text.split(' ',1)
                for b in branches.split('、'):
                    rows.append(row(b if b.startswith(brand) else brand+' '+b,genre=genre))
            else: rows.append(row(text,genre=genre))
save('aichi','tokai','paypay-voucher',rows,'https://www.city.tokai.aichi.jp/_res/projects/default_project/_page_/001/010/762/shoplist4.pdf','市が紹介する主な店舗の一部です。専門店街の一括記載は省略しています。アピタ直営店・ラスパ太田川のドンキやスタバ等は対象外。最新の対象店はアプリでご確認ください。','2026-06-12')

rows=[]
for ti, table in enumerate(tables('matsukawa')):
    for r in table:
        for offset in ([0] if ti==0 else [0,6]):
            if len(r)>offset+2 and '●' in (r[offset+2] or ''):
                rows.append(row(r[offset+1]))
save('nagano','matsukawa','paypay-voucher',rows,'https://r.goope.jp/matsukawa-sci/diary/244363','商工会の利用可能店舗一覧で「デジタル」に対応マークがある店舗のみ掲載。冊子・マーくんのみ対応する店舗は含みません。','2026-08-17')

(OUT/'shop-list-sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
