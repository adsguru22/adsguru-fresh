// src/app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}