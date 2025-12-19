import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container py-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
