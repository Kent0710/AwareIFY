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
import { AccountType } from "@/object-types";

const dummyAccounts: AccountType[] = [
    {
        id: "acc_0001",
        isConfigured: true,
        auth_user_id: "auth_0001",
        username: "skywatcher01",
        primary_location_longitude: 121.039,
        primary_location_latitude: 13.933,
        place_name: "Mataasnakahoy, Batangas",
    },
    {
        id: "acc_0002",
        isConfigured: false,
        auth_user_id: "auth_0002",
        username: "rainy_dayz",
        primary_location_longitude: 120.985,
        primary_location_latitude: 14.5995,
        place_name: "Manila, Philippines",
    },
    {
        id: "acc_0003",
        isConfigured: true,
        auth_user_id: "auth_0003",
        username: "sunseeker",
        primary_location_longitude: 123.8854,
        primary_location_latitude: 10.3157,
        place_name: "Cebu City, Philippines",
    },
    {
        id: "acc_0004",
        isConfigured: true,
        auth_user_id: "auth_0004",
        username: "cloudy_skies",
        primary_location_longitude: 121.774,
        primary_location_latitude: 12.8797,
        place_name: "Philippines",
    },
    {
        id: "acc_0005",
        isConfigured: false,
        auth_user_id: "auth_0005",
        username: "typhoon_tracker",
        primary_location_longitude: 125.5138,
        primary_location_latitude: 8.4542,
        place_name: "Butuan City",
    },
    {
        id: "acc_0006",
        isConfigured: true,
        auth_user_id: "auth_0006",
        username: "stormalert",
        primary_location_longitude: 122.9319,
        primary_location_latitude: 11.0046,
        place_name: "Roxas City",
    },
    {
        id: "acc_0007",
        isConfigured: true,
        auth_user_id: "auth_0007",
        username: "weatherguru",
        primary_location_longitude: 124.6096,
        primary_location_latitude: 11.247,
        place_name: "Tacloban City",
    },
    {
        id: "acc_0008",
        isConfigured: false,
        auth_user_id: "auth_0008",
        username: "lightningbolt",
        primary_location_longitude: 125.0003,
        primary_location_latitude: 6.9214,
        place_name: "Davao City",
    },
    {
        id: "acc_0009",
        isConfigured: true,
        auth_user_id: "auth_0009",
        username: "rainwatcher",
        primary_location_longitude: 120.9842,
        primary_location_latitude: 14.5566,
        place_name: "Makati City",
    },
    {
        id: "acc_0010",
        isConfigured: true,
        auth_user_id: "auth_0010",
        username: "sunnyvibes",
        primary_location_longitude: 123.8854,
        primary_location_latitude: 10.3157,
        place_name: "Cebu City",
    },
    {
        id: "acc_0011",
        isConfigured: false,
        auth_user_id: "auth_0011",
        username: "humidzone",
        primary_location_longitude: 120.9737,
        primary_location_latitude: 14.4258,
        place_name: "Parañaque City",
    },
    {
        id: "acc_0012",
        isConfigured: true,
        auth_user_id: "auth_0012",
        username: "tempestuser",
        primary_location_longitude: 120.9822,
        primary_location_latitude: 14.6042,
        place_name: "Quezon City",
    },
    {
        id: "acc_0013",
        isConfigured: true,
        auth_user_id: "auth_0013",
        username: "cyclonereport",
        primary_location_longitude: 121.0652,
        primary_location_latitude: 14.676,
        place_name: "Marikina City",
    },
    {
        id: "acc_0014",
        isConfigured: false,
        auth_user_id: "auth_0014",
        username: "calmstorm",
        primary_location_longitude: 120.5976,
        primary_location_latitude: 15.4812,
        place_name: "Tarlac City",
    },
    {
        id: "acc_0015",
        isConfigured: true,
        auth_user_id: "auth_0015",
        username: "breezy_beach",
        primary_location_longitude: 120.3126,
        primary_location_latitude: 16.4023,
        place_name: "San Fernando, La Union",
    },
    {
        id: "acc_0016",
        isConfigured: true,
        auth_user_id: "auth_0016",
        username: "hailstormman",
        primary_location_longitude: 123.3065,
        primary_location_latitude: 13.6218,
        place_name: "Legazpi City",
    },
    {
        id: "acc_0017",
        isConfigured: false,
        auth_user_id: "auth_0017",
        username: "climatewatch",
        primary_location_longitude: 122.7531,
        primary_location_latitude: 11.5694,
        place_name: "Kalibo, Aklan",
    },
    {
        id: "acc_0018",
        isConfigured: true,
        auth_user_id: "auth_0018",
        username: "atmos_tracker",
        primary_location_longitude: 120.6669,
        primary_location_latitude: 16.4023,
        place_name: "Baguio City",
    },
    {
        id: "acc_0019",
        isConfigured: false,
        auth_user_id: "auth_0019",
        username: "tempalert",
        primary_location_longitude: 123.8854,
        primary_location_latitude: 10.3157,
        place_name: "Cebu City",
    },
    {
        id: "acc_0020",
        isConfigured: true,
        auth_user_id: "auth_0020",
        username: "windwatch",
        primary_location_longitude: 121.0336,
        primary_location_latitude: 14.5515,
        place_name: "Pasig City",
    },
    // 20 more entries
    {
        id: "acc_0021",
        isConfigured: true,
        auth_user_id: "auth_0021",
        username: "foggyeyes",
        primary_location_longitude: 122.5635,
        primary_location_latitude: 11.589,
        place_name: "Iloilo City",
    },
    {
        id: "acc_0022",
        isConfigured: false,
        auth_user_id: "auth_0022",
        username: "misty_mountains",
        primary_location_longitude: 120.9842,
        primary_location_latitude: 14.676,
        place_name: "Quezon City",
    },
    {
        id: "acc_0023",
        isConfigured: true,
        auth_user_id: "auth_0023",
        username: "dewpoint",
        primary_location_longitude: 121.0447,
        primary_location_latitude: 14.676,
        place_name: "Taguig City",
    },
    {
        id: "acc_0024",
        isConfigured: false,
        auth_user_id: "auth_0024",
        username: "stormsurfer",
        primary_location_longitude: 124.2464,
        primary_location_latitude: 9.7848,
        place_name: "Surigao City",
    },
    {
        id: "acc_0025",
        isConfigured: true,
        auth_user_id: "auth_0025",
        username: "sunbeam",
        primary_location_longitude: 125.5636,
        primary_location_latitude: 8.225,
        place_name: "Bayugan City",
    },
    {
        id: "acc_0026",
        isConfigured: false,
        auth_user_id: "auth_0026",
        username: "windyroad",
        primary_location_longitude: 120.9417,
        primary_location_latitude: 14.6155,
        place_name: "Caloocan City",
    },
    {
        id: "acc_0027",
        isConfigured: true,
        auth_user_id: "auth_0027",
        username: "heatindex",
        primary_location_longitude: 121.551,
        primary_location_latitude: 13.4125,
        place_name: "Lucena City",
    },
    {
        id: "acc_0028",
        isConfigured: true,
        auth_user_id: "auth_0028",
        username: "moonstorm",
        primary_location_longitude: 123.3125,
        primary_location_latitude: 13.1466,
        place_name: "Sorsogon City",
    },
    {
        id: "acc_0029",
        isConfigured: false,
        auth_user_id: "auth_0029",
        username: "weatherhub",
        primary_location_longitude: 125.4995,
        primary_location_latitude: 8.2456,
        place_name: "Agusan del Sur",
    },
    {
        id: "acc_0030",
        isConfigured: true,
        auth_user_id: "auth_0030",
        username: "seastorm",
        primary_location_longitude: 124.6364,
        primary_location_latitude: 8.4781,
        place_name: "Butuan City",
    },
    {
        id: "acc_0031",
        isConfigured: true,
        auth_user_id: "auth_0031",
        username: "earlycloud",
        primary_location_longitude: 120.989,
        primary_location_latitude: 14.604,
        place_name: "Quezon City",
    },
    {
        id: "acc_0032",
        isConfigured: false,
        auth_user_id: "auth_0032",
        username: "earthwinds",
        primary_location_longitude: 121.076,
        primary_location_latitude: 14.576,
        place_name: "San Juan City",
    },
    {
        id: "acc_0033",
        isConfigured: true,
        auth_user_id: "auth_0033",
        username: "tempwatcher",
        primary_location_longitude: 121.0223,
        primary_location_latitude: 14.634,
        place_name: "Mandaluyong City",
    },
    {
        id: "acc_0034",
        isConfigured: true,
        auth_user_id: "auth_0034",
        username: "auroraview",
        primary_location_longitude: 121.5454,
        primary_location_latitude: 15.7159,
        place_name: "Baler, Aurora",
    },
    {
        id: "acc_0035",
        isConfigured: false,
        auth_user_id: "auth_0035",
        username: "rainfeel",
        primary_location_longitude: 123.7646,
        primary_location_latitude: 13.409,
        place_name: "Masbate City",
    },
    {
        id: "acc_0036",
        isConfigured: true,
        auth_user_id: "auth_0036",
        username: "stormcloudz",
        primary_location_longitude: 122.9506,
        primary_location_latitude: 11.4188,
        place_name: "Capiz",
    },
    {
        id: "acc_0037",
        isConfigured: false,
        auth_user_id: "auth_0037",
        username: "sunburst",
        primary_location_longitude: 121.0019,
        primary_location_latitude: 14.5785,
        place_name: "Manila",
    },
    {
        id: "acc_0038",
        isConfigured: true,
        auth_user_id: "auth_0038",
        username: "skyfall",
        primary_location_longitude: 121.0583,
        primary_location_latitude: 14.676,
        place_name: "Pasig City",
    },
    {
        id: "acc_0039",
        isConfigured: true,
        auth_user_id: "auth_0039",
        username: "tropiczone",
        primary_location_longitude: 124.6206,
        primary_location_latitude: 8.4772,
        place_name: "Butuan City",
    },
    {
        id: "acc_0040",
        isConfigured: false,
        auth_user_id: "auth_0040",
        username: "suncloud",
        primary_location_longitude: 121.0726,
        primary_location_latitude: 14.5772,
        place_name: "San Juan",
    },
];

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
                <p>
                    {error?.toString() ||
                        "Invalid institution or location data."}
                </p>
            </div>
        );
    }

    // Fetch weather data sequentially to avoid rate limits
    let institutionCurrentWeather: GoogleApiResponse | null = null;
    let institutionHourlyForecast: GoogleHourlyForecastResponse | null = null;
    let institutionDailyForecast: GoogleDailyForecastResponse | null = null;

    try {
        institutionCurrentWeather = await getCurrentWeather(
            longitude,
            latitude
        );
        institutionHourlyForecast = await getHourlyWeatherForecast(
            longitude,
            latitude
        );
        institutionDailyForecast = await getDailyWeatherForecast(
            longitude,
            latitude
        );
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
                    {awaitedParams.id ===
                    "3b788745-0dd8-491d-8e84-ad22a421129e" ? (
                        <WeatherMap
                            apiKey={"d8lUW305OaEKorlxzTek"}
                            accounts={dummyAccounts}
                        />
                    ) : (
                        <WeatherMap
                            apiKey={"d8lUW305OaEKorlxzTek"}
                            accounts={accounts}
                        />
                    )}
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
