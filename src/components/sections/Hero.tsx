import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative text-center py-12 bg-gradient-to-r from-red-500 to-pink-500 text-white">
      <h1 className="text-4xl font-bold mb-4">全国PayPay自治体キャンペーン特集</h1>
      <p className="text-lg mb-24">あなたの街も対象かも？今すぐチェック！</p>
      <div className="fixed bottom-4 left-0 right-0 px-4">
        <Button variant="default" className="w-full max-w-md mx-auto">
          キャンペーン一覧を見る
        </Button>
      </div>
    </section>
  );
}