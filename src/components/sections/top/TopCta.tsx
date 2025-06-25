import { Button } from "@/components/ui/button";

export default function Cta() {
  return (
    <section className="text-center py-12 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">もっと詳しく知りたい方はこちら</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild>
          <a href="https://paypay.ne.jp/" target="_blank" rel="noopener noreferrer">
            PayPay公式サイトへ
          </a>
        </Button>
        <Button asChild>
          <a href="https://aupay.auone.jp/index.html" target="_blank" rel="noopener noreferrer">
            au PAY公式サイトへ
          </a>
        </Button>
        <Button asChild>
          <a href="https://pay.rakuten.co.jp/" target="_blank" rel="noopener noreferrer">
            楽天ペイ公式サイトへ
          </a>
        </Button>
        <Button asChild>
          <a
            href="https://service.smt.docomo.ne.jp/keitai_payment/"
            target="_blank"
            rel="noopener noreferrer"
          >
            d払い公式サイトへ
          </a>
        </Button>
        <Button asChild>
          <a
            href="https://www.aeon.co.jp/service/lp/aeonpay/"
            target="_blank"
            rel="noopener noreferrer"
          >
            AEON Pay公式サイトへ
          </a>
        </Button>
      </div>
    </section>
  );
}
