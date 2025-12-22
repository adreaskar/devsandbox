import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-muted flex flex-col">
        <div className="flex-1 flex flex-col h-full overflow-hidden container py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
