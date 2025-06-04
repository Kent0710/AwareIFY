"use client";

import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobileStore } from "@/store/useIsMobileStore";
import BottomBar from "./bottom-bar";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const isMobile = useIsMobileStore();

    if (isMobile) {
        // 📱 Mobile layout (no grid, stacked vertically)
        return (
            <div className="flex flex-col h-screen overflow-y-hidden">
                <div className="flex-1 overflow-y-auto  overflow-x-hidden pb-[4rem]">{children}</div>
                <BottomBar />
                <Toaster />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[5rem_1fr] h-screen">
            <Sidebar />

            <div className="flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
                <BottomBar />
            </div>

            <Toaster />
        </div>
    );
}
