"use client";

import { GoHome } from "react-icons/go";
import { IconType } from "react-icons/lib";
import { PiStorefrontLight } from "react-icons/pi";
import { PiShoppingCartSimple } from "react-icons/pi";
import {  useMemo, useState } from "react";
import { CgMenuRight } from "react-icons/cg";
import Link from "next/link";
import { useIsMobileStore } from "@/store/useIsMobileStore";
import { Loader2, Lock, LogOut, ShieldQuestion, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Bookmark, Heart, TicketCheck } from "lucide-react";
import { Info, FileText, Shield, Mail } from "lucide-react";

const BottomBar = () => {
    const isMobile = useIsMobileStore();
    const [loadingItem, setLoadingItem] = useState<string | null>(null);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const path = usePathname();

    const navs = useMemo(
        () => [
            {
                icon: GoHome,
                text: "Home",
                href: "/home",
            },
            {
                icon: ShieldQuestion,
                text: "Status",
                href: "/status",
            },
            {
                icon: Lock,
                text: "Admin",
                href: "/admin",
            },
            {
                icon: PiStorefrontLight,
                text: "Shops",
                href: "/shop",
            },
        ],
        []
    );

    const handleNavigation = (href: string, text: string) => {
        setLoadingItem(text);
        startTransition(() => {
            router.push(href);
        });
    };

    if (!isMobile) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full rounded-t-3xl bg-gradient-to-b from-fuchsia-500 to-cyan-500 text-white mt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-neutral-300 z-50 h-[4rem]">
            <nav className="h-full flex items-center">
                <ul className="flex justify-around mx-6 w-full items-center ">
                    {navs.map((nav) => (
                        <li key={nav.text}>
                            <button
                                onClick={() =>
                                    handleNavigation(nav.href, nav.text)
                                }
                                className={`flex flex-col items-center justify-center ${
                                    path === nav.href
                                        ? "bg-white text-blue-500 rounded-xl w-17 shadow-md p-1"
                                        : ""
                                }`}
                            >
                                {loadingItem === nav.text && isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <BottomBarIcon icon={nav.icon} />
                                )}
                                <small className="text-xs">{nav.text}</small>
                            </button>
                        </li>
                    ))}
                    <li>
                        <Menu />
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default BottomBar;

interface BottomBarIconProps {
    icon: IconType;
}
const BottomBarIcon: React.FC<BottomBarIconProps> = ({ icon: Icon }) => {
    return <Icon size={25} />;
};

const Menu = () => {
    const [open, setOpen] = useState(false);

    const infoRoutes = [
        { label: "About", icon: <Info className="w-5 h-5" />, href: "/about" },
        {
            label: "Terms",
            icon: <FileText className="w-5 h-5" />,
            href: "/terms",
        },
        {
            label: "Privacy",
            icon: <Shield className="w-5 h-5" />,
            href: "/privacy",
        },
        {
            label: "Contact",
            icon: <Mail className="w-5 h-5" />,
            href: "/contact",
        },
    ];

    const mainRoutes = [
        {
            label: "Orders",
            icon: <TicketCheck className="w-5 h-5" />,
            href: "/checkouts",
        },
        {
            label: "Liked products",
            icon: <Heart className="w-5 h-5" />,
            href: "/likes",
        },
        {
            label: "Bookmarked shops",
            icon: <Bookmark className="w-5 h-5" />,
            href: "/bookmarks",
        },
    ];

    const username = '';

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <div className="flex flex-col items-center justify-center">
                    <CgMenuRight className="w-6 h-6" />
                    <small className="text-xs">Menu</small>
                </div>
            </SheetTrigger>

            <SheetContent className="rounded-l-3xl p-1 text-sm">
                <SheetHeader>
                    <SheetTitle className="font-extrabold bg-gradient-to-tl from-blue-500 to-yellow-500 bg-clip-text text-transparent text-xl">
                        AllInOneMarket
                    </SheetTitle>
                </SheetHeader>

                <main className="px-[2rem] space-y-6 text-neutral-600">
                    <section className="border-y-1">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="flex items-center data-[state=open]:text-blue-500">
                                    <div className="flex items-center gap-3">
                                        <User
                                            className="rounded-xl bg-neutral-100 p-2"
                                            size={40}
                                        />
                                        <h2 className="font-semibold w-[7rem] truncate">
                                            {username}
                                        </h2>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <nav>
                                        <ul className="pl-[3.2rem] space-y-3">
                                            <li>
                                                <Link
                                                    href={"/account"}
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                >
                                                    My account
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={"/admin"}
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                >
                                                    Admin Shop
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    <section className="border-b-1 pb-6">
                        <nav>
                            <ul className="space-y-6">
                                {mainRoutes.map(({ label, icon, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="flex items-center gap-3"
                                            onClick={() => setOpen(false)}
                                        >
                                            {icon}
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </section>

                    <section className="border-b-1 pb-6">
                        <nav>
                            <ul className="space-y-6">
                                {infoRoutes.map(({ label, icon, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="flex items-center gap-3"
                                            onClick={() => setOpen(false)}
                                        >
                                            {icon}
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </section>

                    <section className="flex items-center gap-3 text-red-500">
                        <LogOut />
                        Log out
                    </section>
                </main>
            </SheetContent>
        </Sheet>
    );
};
