// ✅ /lib/FAQTemplateGenerator.ts
export function generateCityCampaignFAQ(
  prefecture: string,
  city: string,
  payLabel: string
): { questions: string[]; answers: string[] } {
  const location = `${prefecture}${city}`;
  const questions: string[] = [];
  const answers: string[] = [];

  // Q6: 居住地に関する質問（新規追加）
  questions.push(`キャンペーン対象エリア（${location}）に住んでいなくても還元を受けられますか？`);
  answers.push(getAnswerForQ6(location, payLabel));

  // Q1
  questions.push(`${payLabel}の還元は何時、何でもらえますか？`);
  answers.push(getAnswerForQ1(location, payLabel));

  // Q2
  questions.push(`家族のスマホで${payLabel}を使った場合も還元されますか？`);
  answers.push(getAnswerForQ2(location, payLabel));

  // Q3
  questions.push(`${payLabel}で支払ったのにポイントが付かないのはなぜ？`);
  answers.push(getAnswerForQ3(location, payLabel));

  // Q4
  questions.push(`${payLabel}は他のキャンペーンと併用できますか？`);
  answers.push(getAnswerForQ4(location, payLabel));

  // Q5
  questions.push(`${payLabel}で付与されたポイントはどこで使えますか？`);
  answers.push(getAnswerForQ5(location, payLabel));

  // Q7
  questions.push(`${location}の${payLabel}キャンペーンの対象店舗はどこで確認できますか？`);
  answers.push(getAnswerForQ7(location, payLabel));

  // Q8
  questions.push(`どのように対象店舗であるかを見分けられますか？`);
  answers.push(getAnswerForQ8(location, payLabel));

  return { questions, answers };
}

// Q1: ポイント付与時期
function getAnswerForQ1(location: string, payLabel: string): string {
  switch (payLabel) {
    case "PayPay":
      return `${location}のPayPayキャンペーンでは、通常は決済から30日以内にPayPayポイントとして還元されます。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    case "au PAY":
      return `${location}のau PAYキャンペーンでは、決済月の翌々月末頃にau PAY残高として還元されます。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    case "楽天ペイ":
      return `${location}の楽天ペイキャンペーンでは、決済月の翌々月末頃に楽天ポイントとして還元されます。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    case "d払い":
      return `${location}のd払いキャンペーンでは、キャンペーン終了月の翌月末以降順次dポイント（期間・用途限定）として還元されます。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    case "AEON Pay":
      return `${location}のAEON Payキャンペーンでは、2〜3か月以内にWAON POINTとして還元されます。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    default:
      return `${location}の${payLabel}キャンペーンの付与時期は決済方法により異なります。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
  }
}

// Q2: 家族のスマホ利用
function getAnswerForQ2(location: string, payLabel: string): string {
  return `${location}の${payLabel}キャンペーンでは、${payLabel}のアカウント単位で還元対象が決まります。家族のスマホを使う場合でも、対象アカウントで正しく決済されていれば基本的に対象となります。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
}

// Q3: 還元されない理由（改良版）
function getAnswerForQ3(location: string, payLabel: string): string {
  switch (payLabel) {
    case "PayPay":
      return `${location}のPayPayキャンペーンでは、キャンペーン期間外の支払い、対象外店舗での利用、タバコなど対象外の商品を含む支払い、PayPayカード等によるクレジット払い、請求書払い・あと払い（残高以外）などは還元対象外です。詳しくはPayキャンの${location}公式ページおよびPayPay公式サイトをご確認ください。`;
    case "au PAY":
      return `${location}のau PAYキャンペーンでは、対象外店舗、au PAYプリペイドカードでの支払い、タバコなど対象外の商品を含む支払い、キャンセルや返品などは還元対象外です。詳しくはPayキャンの${location}公式ページおよびau PAY公式サイトをご確認ください。`;
    case "楽天ペイ":
      return `${location}の楽天ペイキャンペーンは楽天ペイアプリによるコード・QR払い、セルフ払いをした方が対象です。対象店舗以外での利用、タバコなど対象外の商品を含む支払い、楽天ポイントや楽天キャッシュ払い、読み取り式の支払いなどは還元対象外です。詳しくはPayキャンの${location}公式ページおよび楽天ペイ公式サイトをご確認ください。`;
    case "d払い":
      return `${location}のd払いキャンペーンでは対象店舗以外、dカード以外での支払い、あと払い、決済取消、タバコなど対象外の商品を含む支払いは還元対象外です。詳しくはPayキャンの${location}公式ページおよびd払いキャンペーン詳細ページをご確認ください。`;
    case "AEON Pay":
      return `${location}のAEON Payキャンペーンでは、AEON Pay以外の支払い、対象外店舗、キャンセル・返品、タバコなど対象外の商品を含む支払いは還元対象外です。詳しくはPayキャンの${location}公式ページおよびイオン公式ページをご確認ください。`;
    default:
      return `${location}の${payLabel}キャンペーンでも、キャンペーン期間外や対象外の支払い方法、参加登録漏れなどの場合は還元対象外になることがあります。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
  }
}

// Q4: 他キャンペーンとの併用可否
function getAnswerForQ4(location: string, payLabel: string): string {
  return `${location}の${payLabel}キャンペーンは、他のキャンペーンと併用できる場合がありますが、上限や適用条件にご注意ください。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
}

// Q5: ポイントの使い道
function getAnswerForQ5(location: string, payLabel: string): string {
  switch (payLabel) {
    case "PayPay":
      return `付与されたPayPayポイントは、${location}を含む全国のPayPay対応店舗で利用できます。`;
    case "au PAY":
      return `au PAY残高として付与されたポイントは、${location}だけでなく全国のau PAY加盟店で利用可能です。`;
    case "楽天ペイ":
      return `還元された楽天ポイントは、${location}内の楽天ペイ対応店舗や楽天市場などで利用できます。楽天ポイントはキャンペーンにより有効期限がある場合があります。詳しくは楽天ポイントクラブで確認できます。`;
    case "d払い":
      return `付与されたdポイントは、${location}のd払い加盟店やドコモの各種サービス、ネットストア等で利用可能です。還元されたdポイントには、利用用途が限定され、進呈時にそれぞれ固有の有効期間が設定されています。`;
    case "AEON Pay":
      return `WAON POINTとして付与されるため、${location}のイオン系列店舗をはじめ、WAON POINT加盟店で利用できます。なお、WAON POINTには有効期限があります。有効期限についてはイオンウォレットで確認できます。`;
    default:
      return `${location}で付与された${payLabel}のポイントは、各サービスの加盟店でご利用いただけます。詳細はPayキャンの${location}公式ページのリンクよりご確認ください。`;
  }
}

// Q6: 対象エリア外の居住者も還元対象か
function getAnswerForQ6(location: string, payLabel: string): string {
  return `はい、${location}の${payLabel}キャンペーンでは、${location}にお住まいでなくても対象店舗での対象決済であれば還元の対象になります。観光や出張、帰省などで訪れた際にも利用できます。詳細条件はPayキャンの${location}公式ページをご確認ください。`;
}

// Q7: 対象店舗の確認方法
function getAnswerForQ7(location: string, payLabel: string): string {
  const disclaimer = "ご利用前に、店頭ポスターのご確認や店舗スタッフへお問い合わせいただきますようお願いいたします。";
  switch (payLabel) {
    case "PayPay":
      return `PayPayアプリの「近くのおトク」から対象キャンペーンを選択すると確認できます。Payキャンの掲載情報もご確認ください。${disclaimer}`;
    case "au PAY":
      return `au PAYアプリ内の「キャンペーン」ページから対象店舗を検索できます。Payキャンの掲載情報もご確認ください。${disclaimer}`;
    case "楽天ペイ":
      return `楽天ペイアプリのキャンペーン情報欄や対象店舗ページで確認可能です。Payキャンにも情報を掲載しています。${disclaimer}`;
    case "d払い":
      return `d払いアプリのキャンペーンページで対象店舗を一覧表示できます。また、Payキャンでも対象店舗を確認できます。${disclaimer}`;
    case "AEON Pay":
      return `iAEONアプリやイオンウォレットアプリのキャンペーン一覧から対象店舗を確認できます。公式サイトやPayキャンの情報もあわせてご覧ください。${disclaimer}`;
    default:
      return `決済サービスのアプリやキャンペーンページ、Payキャン対象地域ページで対象店舗を確認できます。${disclaimer}`;
  }
}

// Q8: 対象店舗の見分け方
function getAnswerForQ8(location: string, payLabel: string): string {
  const disclaimer = "ご利用前に、店頭ポスターのご確認や店舗スタッフへお問い合わせいただきますようお願いいたします。";
  switch (payLabel) {
    case "PayPay":
      return `対象店舗では「最大◯◯％戻ってくる！」などのPayPayキャンペーンポスターが掲示されています。アプリの地図でも「キャンペーン対象」のバッジが表示されます。${disclaimer}`;
    case "au PAY":
      return `店頭に「au PAYキャンペーン実施中」などのPOPが掲示されていることが多く、アプリ内でも対象表示されます。${disclaimer}`;
    case "楽天ペイ":
      return `対象店舗には「楽天ペイキャンペーン対象店舗」などの掲示があることがあり、アプリ内でも対象と表示されます。${disclaimer}`;
    case "d払い":
      return `「d払いキャンペーン対象」ステッカーやポスターが目印です。アプリ内でも確認が出来ます。${disclaimer}`;
    case "AEON Pay":
      return `「AEON Pay対象」や「WAON POINT還元」などのポスターが掲示されていることがあります。アプリ内でもご確認いただけます。${disclaimer}`;
    default:
      return `対象店舗ではキャンペーン告知のポスターが掲示されていることが多く、アプリの地図や店舗情報からも対象か確認可能です。${disclaimer}`;
  }
}