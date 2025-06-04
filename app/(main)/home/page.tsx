import PageWrapper from "@/components/page-wrapper";
import AccountFields from "./account-fields";
import Institutions from "./institutions";
import { checkUser } from "@/actions/checkUser";
import { redirect } from "next/navigation";
import CurrentWeather from "./current-weather";
import { AnnouncementCarousel } from "./announcement-carousel";
import Header from "@/components/header";

export default async function HomePage() {
    const { isConfigured, account } = await checkUser();

    if (!isConfigured) {
        redirect("/configure");
    }

    return (
        <>
            <Header />
            <PageWrapper>
                <div className="space-y-6">
                    <AnnouncementCarousel />
                    <AccountFields account={account} />
                    <Institutions />
                    <CurrentWeather account={account} />
                </div>
            </PageWrapper>
        </>
    );
}
