import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-muted">
        <div className="container py-8 max-h-dvh overflow-y-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
