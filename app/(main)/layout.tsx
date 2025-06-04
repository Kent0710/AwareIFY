import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid grid-cols-[5rem_1fr]">
            <Sidebar />

            <div className="h-screen overflow-y-auto ">
                {children}
            </div>

            <Toaster />
        </div>
    );
}
