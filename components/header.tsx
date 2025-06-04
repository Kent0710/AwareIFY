"use client";

import Image from "next/image";
import AwareIFYLogo from "@/public/awareify-logo.jpg";
import { Button } from "./ui/button";
import { useIsMobileStore } from "@/store/useIsMobileStore";

const Header = () => {
    const isMobile = useIsMobileStore();

    return isMobile ? <MobileHeader /> : <DesktopHeader />;
};

export default Header;

const MobileHeader = () => {
    return (
        <header className="flex items-center justify-between px-[1rem] py-6">
            <span className="flex items-center space-x-3">
                <Image
                    src={AwareIFYLogo}
                    alt="awareify-logo"
                    className="w-10 h-auto object-contain"
                />
                <h1> AwareIFY </h1>
            </span>
            <Button variant={"special"}>Access research</Button>
        </header>
    );
};

const DesktopHeader = () => {
    return (
        <header className="py-6 flex items-center justify-between px-[1rem] lg:px-[6rem]">
            <section className="flex items-center space-x-12">
                <span className="flex items-center space-x-3">
                    <Image
                        src={AwareIFYLogo}
                        alt="awareify-logo"
                        className="w-10 h-auto object-contain"
                    />
                    <h1> AwareIFY </h1>
                </span>

                <ul className="space-x-3 flex">
                    <li> Features </li>
                    <li> About </li>
                    <li> Contact </li>
                    <li> Privacy </li>
                    <li> Terms </li>
                </ul>
            </section>

            <Button variant={"special"}> Access research </Button>
        </header>
    );
};
