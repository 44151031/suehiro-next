import { Button } from "@/components/ui/button";

export default function Cta() {
  return (
    <section className="text-center py-12 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">もっと詳しく知りたい方はこちら</h2>
      <Button asChild>
        <a href="https://paypay.ne.jp/" target="_blank" rel="noopener noreferrer">
          PayPay公式サイトへ
        </a>
      </Button>
    </section>
  );
}