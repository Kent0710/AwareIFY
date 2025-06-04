import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function WelcomePage() {
    return (
        <div className="h-[100dvh] flex justify-center items-center">
            <Link href={'/home'}>
                <Button variant={'special'}>
                    Test prototype
                </Button>
            </Link>
        </div>
    )
}