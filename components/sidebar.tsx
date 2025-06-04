"use client";

import { Home, Settings, LogOut, ShieldQuestion, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import AwareIFYLogo from "@/public/awareify-logo.jpg";
import Image from "next/image";
import { signout } from "@/actions/login";
import { toast } from "sonner";
import { useIsMobileStore } from "@/store/useIsMobileStore";

const Sidebar = () => {
    const pathname = usePathname();

    const navs = useMemo(
        () => [
            {
                icon: Home,
                label: "Home",
                active: pathname === "/home",
                href: "/home",
            },
            {
                icon : ShieldQuestion,
                label : "Status",
                active : pathname === '/status',
                href : '/status',
            },
            {
                icon : Lock,
                label : 'Admin',
                active : pathname.includes('/admin'),
                href : '/admin',
            },
            {
                icon: Settings,
                label: "Settings",
                active: pathname === "/settings",
                href: "/settings",
            },
        ],
        [pathname]
    );

    const isMobile = useIsMobileStore();
    if (isMobile) return;

    return (
        <div className="w-[5rem] border-r h-screen flex flex-col items-center py-3 bg-secondary text-neutral-600">
            <Image
                src={AwareIFYLogo}
                alt="awareify-logo"
                className="w-10 h-auto object-contain pb-3 border-b-2 mb-3"
            />

            <ul className="space-y-3 ">
                {navs.map((nav) => (
                    <li key={nav.label}>
                        <Link
                            href={nav.href}
                            className={`flex flex-col items-center ${
                                nav.active && "text-blue-500"
                            }`}
                        >
                            <nav.icon className="size-6" />
                            <small>{nav.label}</small>
                        </Link>
                    </li>
                ))}
            </ul>

            <button className="flex flex-col items-center mt-6" onClick={async ()=> {
                toast.loading('Signing out...', {duration : 2000})
                await signout();
            }}>
                <LogOut size={20} />
                <small>Logout</small>
            </button>
        </div>
    );
};

export default Sidebar;
