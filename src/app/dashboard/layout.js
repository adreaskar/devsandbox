import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - Hidden on mobile, shown as drawer */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-muted flex flex-col">
        <div className="flex-1 flex flex-col h-full overflow-hidden container py-0 md:py-8 mt-16 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
