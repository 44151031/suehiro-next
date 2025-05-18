import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">ページが見つかりません</h1>
      <p className="mb-4">
        お探しのキャンペーンは存在しないか、URLが間違っている可能性があります。
      </p>
      <Link href="/" className="text-blue-500 underline">
        トップページへ戻る
      </Link>
    </div>
  );
}