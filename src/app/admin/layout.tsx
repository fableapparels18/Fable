import { AdminSidebar } from '@/components/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <AdminSidebar />
            <div className="flex flex-col flex-1">
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
