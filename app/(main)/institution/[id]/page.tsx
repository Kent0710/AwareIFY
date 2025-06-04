import getInstitutionById from "@/actions/getInstitutionById";

import Drawer from "./drawer";
import WeatherMap from "./weather-map";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getCurrentWeather } from "@/actions/getCurrentWeather";
import { getHourlyWeatherForecast } from "@/actions/getHourlyWeatherForecast";
import { getDailyWeatherForecast } from "@/actions/getDailyWeatherForecast";

export default async function InstitutionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const awaitedParams = await params;

    const { success, error, institution, accounts } = await getInstitutionById(
        await awaitedParams.id
    );

    const longitude = institution?.longitude;
    const latitude = institution?.latitude;

    if (!success && error && !institution || !longitude || !latitude) {
        return (
            <div className="flex justify-center items-center">
                <p> {error.toString()} </p>
            </div>
        );
    }

    const institutionCurrentWeather = await getCurrentWeather(
        longitude,
        latitude
    );

    const institutionHourlyForecast = await getHourlyWeatherForecast(
        longitude,
        latitude
    );

    const institutionDailyForecast = await getDailyWeatherForecast(
        longitude,
        latitude
    );

    return (
        <div className="w-full h-screen">
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel>
                    <WeatherMap
                        apiKey={"d8lUW305OaEKorlxzTek"}
                        accounts={accounts}
                    />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <Drawer
                        institution={institution}
                        institutionCurrentWeather={institutionCurrentWeather}
                        institutionHourlyForecast={institutionHourlyForecast}
                        institutionDailyForecast={institutionDailyForecast}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
