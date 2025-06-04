"use client";

import { TabsContent } from "@/components/ui/tabs";
import { formatTo12HourTime } from "@/lib/utils";
import { AccountType } from "@/object-types";
import { Loader2, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    getCurrentWeather,
    GoogleApiResponse,
} from "@/actions/getCurrentWeather";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getHourlyWeatherForecast,
    GoogleHourlyForecastResponse,
} from "@/actions/getHourlyWeatherForecast";
import {
    getDailyWeatherForecast,
    GoogleDailyForecastResponse,
} from "@/actions/getDailyWeatherForecast";
import { ForecastLineChart } from "./hourly-forecast-line-chart";
import { DailyForecastLineChart } from "./daily-forecast-line-chart";
import Image from "next/image";

interface AccountTabProps {
    account: AccountType;
}

const AccountTab: React.FC<AccountTabProps> = ({ account }) => {
    const [accountCurrentWeather, setAccountCurrentWeather] =
        useState<GoogleApiResponse | null>(null);
    const [accountHourlyForecast, setAccountHourlyForecast] =
        useState<GoogleHourlyForecastResponse | null>(null);
    const [accountDailyForecast, setAccountDailyForecast] =
        useState<GoogleDailyForecastResponse | null>(null);

    useEffect(() => {
        async function getAccountCurrentWeatherHandler() {
            const {
                primary_location_longitude: longitude,
                primary_location_latitude: latitude,
            } = account;

            const googleCurrentWeather = await getCurrentWeather(
                longitude,
                latitude
            );

            const googleHourlyForecast = await getHourlyWeatherForecast(
                longitude,
                latitude
            );

            const googleDailyForecast = await getDailyWeatherForecast(
                longitude,
                latitude
            );

            setAccountCurrentWeather(googleCurrentWeather);
            setAccountHourlyForecast(googleHourlyForecast);
            setAccountDailyForecast(googleDailyForecast);
        }

        getAccountCurrentWeatherHandler();
    }, [account]);

    if (
        !accountCurrentWeather ||
        !accountHourlyForecast ||
        !accountDailyForecast
    ) {
        return (
            <TabsContent
                value={account.id}
                className="flex items-center justify-center gap-3 text-neutral-500"
            >
                <Loader2 className="animate-spin" />
                <p>Loading weather data...</p>
            </TabsContent>
        );
    }

    return (
        <TabsContent
            value={account.id}
            className="grid grid-cols-4 gap-6 max-h-[calc(100vh-12rem)]"
        >
            <div className="col-span-4 grid grid-cols-1 grid-rows-3 gap-6 lg:grid-cols-4 lg:grid-rows-1">
                <AccountTabContentWrapper className="col-span-4 row-span-1 lg:col-span-1">
                    <p className="font-semibold"> Student </p>
                    <section className="flex items-center space-x-3">
                        <User />

                        <div>
                            <h4 className="font-semibold text-lg">
                                {" "}
                                {account.username}{" "}
                            </h4>
                            <small className="text-neutral-500">
                                {account.place_name}
                            </small>
                        </div>
                    </section>
                </AccountTabContentWrapper>

                <AccountTabContentWrapper className="col-span-4 row-span-1 lg:col-span-1">
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
                            alt="weather-icon"
                            width={100}
                            height={100}
                            className="w-20 h-auto object-contain"
                        />
                        <div>
                            <h4 className="font-semibold text-lg">
                                {" "}
                                {
                                    accountCurrentWeather.temperature.degrees
                                } °C{" "}
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
                </AccountTabContentWrapper>

                <AccountTabContentWrapper className="col-span-4 row-span-1 lg:col-span-2">
                    <p className="font-semibold"> AI Status Summary </p>

                    <section className="grid grid-cols-3">
                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <h4 className="text-lg font-semibold">
                                {" "}
                                Evacuated!{" "}
                            </h4>
                            <small className="text-neutral-500">
                                Need more support!{" "}
                            </small>
                            <Button> Open chat </Button>
                        </div>
                        <div className="col-span-2">
                            <p>
                                {" "}
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Laborum atque ut modi quasi
                                similique nostrum, nulla alias quaerat
                                repudiandae necessitatibus dolorum soluta
                                deleniti eum ipsa ratione corrupti. Quos, unde
                                aliquid.{" "}
                            </p>
                        </div>
                    </section>
                </AccountTabContentWrapper>
            </div>

            <div className="col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                <ForecastLineChart
                    forecast={accountHourlyForecast}
                    className="w-full h-[15rem]"
                />
                <DailyForecastLineChart
                    forecast={accountDailyForecast}
                    className="w-full h-[15rem]"
                />
            </div>
        </TabsContent>
    );
};

export default AccountTab;

interface AccountTabContentWrapperProps {
    children: React.ReactNode;
    className?: string;
}
const AccountTabContentWrapper: React.FC<AccountTabContentWrapperProps> = ({
    children,
    className,
}) => {
    return (
        <div className={`border rounded-lg p-5 ${className}`}>{children}</div>
    );
};
