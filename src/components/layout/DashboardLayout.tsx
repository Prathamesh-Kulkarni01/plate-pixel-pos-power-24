
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QuickActions } from "@/components/layout/QuickActions";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
            <div className="animate-slide-in">
              <Outlet />
            </div>
          </main>
        </div>
        
        {/* Mobile-specific components */}
        <QuickActions />
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
