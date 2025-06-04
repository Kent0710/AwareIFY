"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedAccountsStore } from "@/store/useSelectedAccountsStore";
import SchoolTab from "./school-tab";
import AccountTab from "./account-tab";
import { X } from "lucide-react";
import { GoogleApiResponse } from "@/actions/getCurrentWeather";
import { GoogleHourlyForecastResponse } from "@/actions/getHourlyWeatherForecast";
import { GoogleDailyForecastResponse } from "@/actions/getDailyWeatherForecast";
import { useEffect, useState } from "react";
import getAnnouncement from "@/actions/getAnnouncements";
import { AnnouncementType } from "@/object-types";

interface DrawerProps {
    institution: {
        institution_name: string;
        place_name: string;
        longitude: number;
        latitude: number;
        code: string;
        safe: number;
        unsafe: number;
        pending: number;
        evacuated: number;
        ready: number;
        id: string;
    };
    institutionCurrentWeather: GoogleApiResponse | null;
    institutionHourlyForecast: GoogleHourlyForecastResponse | null;
    institutionDailyForecast: GoogleDailyForecastResponse | null;
}

const Drawer: React.FC<DrawerProps> = ({
    institution,
}) => {
    const { selectedAccounts, removeSelectedAccount } =
        useSelectedAccountsStore();

    const [announcements, setAnnouncements] = useState<AnnouncementType[] | []>(
        []
    );

    useEffect(() => {
        async function getAnnouncementsHandler() {
            const { announcements } = await getAnnouncement(institution.id);
            setAnnouncements(announcements);
        }

        getAnnouncementsHandler();
    }, [institution.id]);

    return (
        <Tabs defaultValue="school" className="h-full overflow-y-auto p-4">
            <TabsList className="fixed">
                <TabsTrigger value="school">School</TabsTrigger>
                {selectedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center">
                        <TabsTrigger value={account.id}>
                            {account.username}
                        </TabsTrigger>
                        <X
                            onClick={() => {
                                removeSelectedAccount(account.id);
                            }}
                            size={20}
                        />
                    </div>
                ))}
            </TabsList>

            <SchoolTab
                institution={institution}
                announcements={announcements}
            />

            {selectedAccounts.map((account) => (
                <AccountTab key={account.id} account={account} />
            ))}
        </Tabs>
    );
};

export default Drawer;