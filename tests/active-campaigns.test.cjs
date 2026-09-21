const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, mocks = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { exports, require: name => mocks[name] });
  return exports;
}
const utils = load('src/lib/campaignUtils.ts', { '@/lib/prefectures': { prefectures: [] } });
const { getCurrentCampaigns, getCurrentRecommendations } = load('src/lib/activeCampaigns.ts', { '@/lib/campaignUtils': utils });
const sample = (citySlug, extra = {}) => ({ prefectureSlug: 'aichi', citySlug, paytype: 'paypay', startDate: '2026-09-01', endDate: '2026-09-30', ...extra });
const now = new Date('2026-09-20T12:00:00+09:00');
test('status changes at Japanese midnight and includes the full final second', () => {
  assert.equal(utils.getCampaignStatus('2026-09-01', '2026-09-30', new Date('2026-08-31T14:59:59.999Z')), 'scheduled');
  assert.equal(utils.getCampaignStatus('2026-09-01', '2026-09-30', new Date('2026-08-31T15:00:00Z')), 'active');
  assert.equal(utils.getCampaignStatus('2026-09-01', '2026-09-30', new Date('2026-09-30T14:59:59.999Z')), 'active');
  assert.equal(utils.getCampaignStatus('2026-09-01', '2026-09-30', new Date('2026-09-30T15:00:00Z')), 'ended');
  assert.equal(utils.getCampaignStatus('invalid', 'invalid', now), 'ended');
});
test('active links exclude ended, scheduled, duplicates and routes that now show a future campaign', () => {
  const list = [sample('active'), sample('active'), sample('ended', { endDate: '2026-09-07' }), sample('future', { startDate: '2026-10-01', endDate: '2026-10-31' }), sample('repeated'), sample('repeated', { startDate: '2026-11-01', endDate: '2026-11-30' })];
  assert.equal(getCurrentCampaigns(list, now).map(c => c.citySlug).join(','), 'active');
  assert.equal(getCurrentCampaigns([], now).length, 0);
});
test('recommendations prioritize same city then same prefecture and exclude current page', () => {
  const list = [sample('remote', { prefectureSlug: 'tokyo' }), sample('other-city'), sample('current'), sample('current', { paytype: 'aupay' })];
  const result = getCurrentRecommendations(list, { prefectureSlug: 'aichi', citySlug: 'current', currentPaytype: 'paypay' }, now);
  assert.equal(result.map(c => `${c.citySlug}/${c.paytype}`).join(','), 'current/aupay,other-city/paypay,remote/paypay');
  assert.equal(list[0].citySlug, 'remote');
});
