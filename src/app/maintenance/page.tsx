// ✅ /app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          メンテナンス中
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          現在サイトは一時的にメンテナンス中です。しばらくお待ちください。
        </p>
      </div>
    </div>
  );
}
