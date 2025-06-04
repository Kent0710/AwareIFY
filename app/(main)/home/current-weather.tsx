import { AccountType } from "@/object-types";
import SectionWrapper from "./section-wrapper";
import { getCurrentWeather } from "@/actions/getCurrentWeather";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatTo12HourTime } from "@/lib/utils";
import { Info } from "lucide-react";
import { getHourlyWeatherForecast } from "@/actions/getHourlyWeatherForecast";
import { getDailyWeatherForecast } from "@/actions/getDailyWeatherForecast";
import { ForecastLineChart } from "../institution/[id]/hourly-forecast-line-chart";
import { DailyForecastLineChart } from "../institution/[id]/daily-forecast-line-chart";
import Image from "next/image";

interface CurrentWeatherProps {
    account: AccountType;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = async ({ account }) => {
    const {
        primary_location_latitude: latitude,
        primary_location_longitude: longitude,
    } = account;

    const accountCurrentWeather = await getCurrentWeather(longitude, latitude);
    const googleHourlyWeather = await getHourlyWeatherForecast(
        longitude,
        latitude
    );
    const googleDailyWeather = await getDailyWeatherForecast(
        longitude,
        latitude
    );

    if (!accountCurrentWeather || !googleHourlyWeather || !googleDailyWeather) {
        return (
            <SectionWrapper title="Your Weather Status">
                <div className="flex justify-center items-center">
                    <p>Unable to load weather data. Please try again later.</p>
                </div>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper title="Your Weather Status">
            <div className="grid grid-cols-3 gap-3">
                {/* Current Weather */}
                <div className="col-span-1 rounded-xl border bg-card text-card-foreground shadow px-6 py-4">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Current Weather</p>
                        <small className="text-neutral-500 font-semibold">
                            {formatTo12HourTime(
                                accountCurrentWeather.currentTime
                            )}
                        </small>
                    </div>

                    <p>
                        {
                            accountCurrentWeather.weatherCondition.description
                                .text
                        }
                    </p>

                    <section className="flex items-center space-x-3">
                        <Image
                            src={
                                accountCurrentWeather.weatherCondition
                                    .iconBaseUri
                            }
                            alt="Weather icon"
                            width={100}
                            height={100}
                            className="w-20 h-auto object-contain"
                        />
                        <div>
                            <h4 className="font-semibold text-lg">
                                {accountCurrentWeather.temperature.degrees} °C
                            </h4>
                            <small className="text-neutral-500">
                                Feels like:{" "}
                                {
                                    accountCurrentWeather.feelsLikeTemperature
                                        .degrees
                                }{" "}
                                °C
                            </small>
                        </div>
                    </section>

                    <Alert>
                        <Info />
                        <AlertTitle>Friendly alert</AlertTitle>
                        <AlertDescription>
                            Sleepy roads and heavy winds! Be careful.
                        </AlertDescription>
                    </Alert>
                </div>
                <ForecastLineChart forecast={googleHourlyWeather} />
                <DailyForecastLineChart forecast={googleDailyWeather} />
            </div>
        </SectionWrapper>
    );
};

export default CurrentWeather;
