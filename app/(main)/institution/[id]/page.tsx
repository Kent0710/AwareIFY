import getInstitutionById from "@/actions/getInstitutionById";
import { getCurrentWeather } from "@/actions/getCurrentWeather";
import { getHourlyWeatherForecast } from "@/actions/getHourlyWeatherForecast";
import { getDailyWeatherForecast } from "@/actions/getDailyWeatherForecast";
import Drawer from "./drawer";
import WeatherMap from "./weather-map";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { GoogleApiResponse } from "@/actions/getCurrentWeather";
import { GoogleHourlyForecastResponse } from "@/actions/getHourlyWeatherForecast";
import { GoogleDailyForecastResponse } from "@/actions/getDailyWeatherForecast";

export default async function InstitutionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const awaitedParams = await params;
    const { success, error, institution, accounts } = await getInstitutionById(
        awaitedParams.id
    );

    // Validate coordinates
    const longitude = institution?.longitude;
    const latitude = institution?.latitude;

    if (
        !success ||
        error ||
        !institution ||
        !longitude ||
        !latitude ||
        isNaN(latitude) ||
        isNaN(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>{error?.toString() || "Invalid institution or location data."}</p>
            </div>
        );
    }

    // Fetch weather data sequentially to avoid rate limits
    let institutionCurrentWeather: GoogleApiResponse | null = null;
    let institutionHourlyForecast: GoogleHourlyForecastResponse | null = null;
    let institutionDailyForecast: GoogleDailyForecastResponse | null = null;

    try {
        institutionCurrentWeather = await getCurrentWeather(longitude, latitude);
        institutionHourlyForecast = await getHourlyWeatherForecast(longitude, latitude);
        institutionDailyForecast = await getDailyWeatherForecast(longitude, latitude);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Failed to fetch weather data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-screen">
            <ResizablePanelGroup direction="vertical">
                <ResizablePanel>
                    <WeatherMap
                        apiKey={"d8lUW305OaEKorlxzTek"}
                        accounts={accounts}
                    />
                </ResizablePanel>
                <ResizableHandle className="h-20 bg-neutral-200" withHandle />
                <ResizablePanel minSize={30} maxSize={70}>
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