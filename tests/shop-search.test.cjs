const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/shopSearch.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: exportsObject });
const { filterShopGroups, sortShops } = exportsObject;
const shops = {
  飲食店: [
    { name: 'カフェＡＢＣ', address: '駅前2丁目', shopid: 'a', voucherTypes: ['common', 'local'], benefit: { type: 'cashback', rate: 20 } },
    { name: 'カフェABC支店', address: '中央10丁目', shopid: 'b', voucherTypes: ['common'], benefit: { type: 'cashback', rate: 10 } },
  ],
  小売店: [{ name: '駅前ストア', address: '駅前1丁目', shopid: 'c' }],
};
const defaults = { query: '', genre: 'all', voucher: 'all', benefit: 'all' };
const names = result => JSON.stringify(Object.values(result).flat().map(s => s.name));
test('normalizes Japanese width/kana and requires every keyword', () => {
  assert.equal(names(filterShopGroups(shops, { ...defaults, query: 'かふぇabc　駅前' })), '["カフェＡＢＣ"]');
  assert.equal(names(filterShopGroups(shops, { ...defaults, query: '飲食店 中央' })), '["カフェABC支店"]');
});
test('combines genre, voucher, rate and search; reset restores all records', () => {
  assert.equal(names(filterShopGroups(shops, { query: 'カフェ', genre: '飲食店', voucher: 'local', benefit: 'cashback:20' })), '["カフェＡＢＣ"]');
  assert.equal(names(filterShopGroups(shops, { ...defaults, voucher: 'local', benefit: 'cashback:10' })), '[]');
  assert.equal(Object.values(filterShopGroups(shops, defaults)).flat().length, 3);
  assert.equal(names(filterShopGroups(shops, { ...defaults, query: '存在しない店舗' })), '[]');
});
test('sorting keeps input immutable, uses numeric address ordering, puts missing address last', () => {
  const input = [{ name: 'B', address: '' }, { name: 'A', address: '駅前10丁目' }, { name: 'C', address: '駅前2丁目' }];
  assert.equal(sortShops(input, 'address', {}).map(s => s.name).join(','), 'C,A,B');
  assert.equal(sortShops(input, 'name', {}).map(s => s.name).join(','), 'A,B,C');
  assert.equal(input.map(s => s.name).join(','), 'B,A,C');
  assert.equal(sortShops(shops.飲食店, 'likes', { a: 1, b: 9 })[0].shopid, 'b');
  assert.equal(sortShops(shops.飲食店, 'default', { b: 9 })[0].shopid, 'a');
});
