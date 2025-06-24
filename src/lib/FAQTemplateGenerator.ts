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



  return { questions, answers };
}

// Q1: ポイント付与時期
function getAnswerForQ1(location: string, payLabel: string): string {
  switch (payLabel) {
    case "PayPay":
      return `${location}のPayPayキャンペーンでは、通常は決済から30日以内にPayPayポイントが付与されます。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    case "au PAY":
      return `${location}のau PAYキャンペーンでは、決済月の翌々月末までにau PAY残高として付与される予定です。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    case "楽天ペイ":
      return `${location}の楽天ペイキャンペーンでは、決済月の翌々月末頃に楽天ポイントが進呈されます。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    case "d払い":
      return `${location}のd払いキャンペーンでは、キャンペーン終了月の翌々月下旬にdポイント（期間・用途限定）が進呈されます。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    case "AEON Pay":
      return `${location}のAEON Payキャンペーンでは、2〜3か月以内にWAON POINTが付与される予定です。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
    default:
      return `${location}の${payLabel}キャンペーンの付与時期は決済方法により異なります。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
  }
}

// Q2: 家族のスマホ利用
function getAnswerForQ2(location: string, payLabel: string): string {
  return `${location}の${payLabel}キャンペーンでは、${payLabel}のアカウント単位で還元対象が決まります。家族のスマホを使う場合でも、対象アカウントで正しく決済されていれば基本的に対象となります。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
}

// Q3: 還元されない理由
function getAnswerForQ3(location: string, payLabel: string): string {
  return `${location}の${payLabel}キャンペーンでも、キャンペーン期間外や対象外の支払い方法、参加登録漏れなどの場合は還元対象外になることがあります。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
}

// Q4: 他キャンペーンとの併用可否
function getAnswerForQ4(location: string, payLabel: string): string {
  return `${location}の${payLabel}キャンペーンは、他のキャンペーンと併用できる場合がありますが、上限や適用条件にご注意ください。詳しくはPayキャンの${location}公式ページおよび決済サービスの公式ページよりご確認ください。`;
}

// Q5: ポイントの使い道
function getAnswerForQ5(location: string, payLabel: string): string {
  switch (payLabel) {
    case "PayPay":
      return `付与されたPayPayポイントは、${location}を含む全国のPayPay対応店舗で利用できます。一部対象外サービスがあるためPayキャンの${location}公式ページのリンクよりご確認ください。`;
    case "au PAY":
      return `au PAY残高として付与されたポイントは、${location}だけでなく全国のau PAY加盟店で利用可能です。利用期限にご注意ください。`;
    case "楽天ペイ":
      return `還元された楽天ポイントは、${location}内の楽天ペイ対応店舗や楽天市場などで利用できます。用途制限はPayキャンの${location}公式ページのリンクよりご確認ください。`;
    case "d払い":
      return `付与されたdポイントは、${location}のd払い加盟店やドコモの各種サービス、ネットストア等で利用可能です（用途限定の場合あり）。`;
    case "AEON Pay":
      return `WAON POINTとして付与されるため、${location}のイオン系列店舗をはじめ、WAON POINT加盟店で利用できます。Payキャンの${location}公式ページのリンクよりご確認ください。`;
    default:
      return `${location}で付与された${payLabel}のポイントは、各サービスの加盟店でご利用いただけます。詳細はPayキャンの${location}公式ページのリンクよりご確認ください。`;
  }
}

// Q6: 対象エリア外の居住者も還元対象か
function getAnswerForQ6(location: string, payLabel: string): string {
  return `はい、${location}の${payLabel}キャンペーンでは、${location}にお住まいでなくても対象店舗での対象決済であれば還元の対象になります。観光や出張、帰省などで訪れた際にも利用できます。詳細条件はPayキャンの${location}公式ページをご確認ください。`;
}

// ✅ 構造化データ（FAQPage）を生成する関数
export function generateCityFAQStructuredData(
  prefecture: string,
  city: string,
  payLabel: string
): Record<string, any> {
  const { questions, answers } = generateCityCampaignFAQ(prefecture, city, payLabel);

  const mainEntity = questions.map((question, index) => ({
    "@type": "Question",
    "name": question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": answers[index],
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": mainEntity,
  };
}
