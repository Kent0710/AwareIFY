import Image from "next/image";
import AwareIFYLogo from '@/public/awareify-logo.jpg'
import { Button } from "./ui/button";

const Header = () => {
    return (
        <header className="py-6 flex items-center justify-between px-[6rem]">

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

            <section className="space-x-3">
                <Button variant={'special'}> Access research </Button>
                <Button> Get started </Button>
            </section>

        </header>
    )
};

export default Header;