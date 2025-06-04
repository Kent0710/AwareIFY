import Image from "next/image";
import NULogo from "@/public/nulogo.webp";

import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { CloudRain, Cloudy, Droplet, Info, Wind } from "lucide-react";
import React from "react";

import { GoogleApiResponse } from "@/actions/getCurrentWeather";
import { formatTo12HourTime } from "@/lib/utils";
import { GoogleHourlyForecastResponse } from "@/actions/getHourlyWeatherForecast";
import { ForecastLineChart } from "./hourly-forecast-line-chart";
import { DailyForecastLineChart } from "./daily-forecast-line-chart";
import { GoogleDailyForecastResponse } from "@/actions/getDailyWeatherForecast";
import { AnnouncementCarousel } from "../../home/announcement-carousel";
import {  AnnouncementType } from "@/object-types";

const dummyStatus = [
    { count: 0, text: "Safe" },
    { count: 0, text: "Unsafe" },
    { count: 0, text: "Pending" },
    { count: 0, text: "Ready" },
    { count: 0, text: "Evacuated" },
];

interface SchoolTabProps {
    institution: {
        institution_name : string;
        place_name : string;
    };
    institutionCurrentWeather: GoogleApiResponse | null;
    institutionHourlyForecast: GoogleHourlyForecastResponse | null;
    institutionDailyForecast: GoogleDailyForecastResponse | null;
    announcements: AnnouncementType[] | [];
}

const SchoolTab: React.FC<SchoolTabProps> = ({
    institution,
    institutionCurrentWeather,
    institutionHourlyForecast,
    institutionDailyForecast,
    announcements,
}) => {
    if (!institutionCurrentWeather && !institutionHourlyForecast) {
        return (
            <TabsContent
                value="school"
                className="flex items-center justify-center"
            >
                <p>No weather data for this institution.</p>
            </TabsContent>
        );
    }

    return (
        <TabsContent
            value="school"
            className="grid grid-cols-4 grid-rows-fit gap-x-8 gap-y-6 pt-12 overflow-auto"
        >
            <SchoolTabContentWrapper className="col-span-4 h-fit">
                <AnnouncementCarousel announcements={announcements} />
            </SchoolTabContentWrapper>

            <SchoolTabContentWrapper className="col-span-1 h-fit">
                <p className="font-semibold">School</p>
                <section className="flex items-center space-x-3">
                    <Image
                        src={NULogo}
                        alt="nulogo"
                        className="w-14 h-auto object-contain"
                    />
                    <div>
                        <h4 className="font-semibold text-lg">
                            {institution.institution_name}
                        </h4>
                        <small className="text-neutral-500">
                            {institution.place_name}
                        </small>
                    </div>
                </section>

                <ul className="flex flex-wrap gap-3 mt-3">
                    <li>
                        <Badge>1 stakeholders</Badge>
                    </li>
                    <li>
                        <Badge>Suspension Recommended</Badge>
                    </li>
                    <li>
                        <Badge>Alert Level</Badge>
                    </li>
                    <li>
                        <Badge>High Vulnerability</Badge>
                    </li>
                </ul>
            </SchoolTabContentWrapper>

            <SchoolTabContentWrapper className="col-span-1 h-fit">
                <div className="flex justify-between items-center">
                    <p className="font-semibold">Current Weather</p>
                    <small className="text-neutral-500 font-semibold">
                        {institutionCurrentWeather?.currentTime
                            ? formatTo12HourTime(
                                  institutionCurrentWeather.currentTime
                              )
                            : "N/A"}
                    </small>
                </div>

                <p>
                    {institutionCurrentWeather?.weatherCondition.description
                        .text ?? "No weather data"}
                </p>

                <section className="flex items-center space-x-3">
                    {institutionCurrentWeather?.weatherCondition.iconBaseUri ? (
                        <Image
                            src={
                                institutionCurrentWeather.weatherCondition
                                    .iconBaseUri
                            }
                            alt="weather-icon"
                            width={100}
                            height={100}
                            className="w-20 h-auto object-contain"
                        />
                    ) : (
                        <span>No icon</span>
                    )}
                    <div>
                        <h4 className="font-semibold text-lg">
                            {institutionCurrentWeather?.temperature.degrees ??
                                "N/A"}{" "}
                            °C
                        </h4>
                        <small className="text-neutral-500">
                            Feels like:{" "}
                            {institutionCurrentWeather?.feelsLikeTemperature
                                .degrees ?? "N/A"}{" "}
                            °C
                        </small>
                    </div>
                </section>

                <ul className="flex gap-3 flex-wrap mt-3">
                    <li>
                        <Badge>
                            <Cloudy />{" "}
                            {institutionCurrentWeather?.cloudCover ?? "N/A"} %
                        </Badge>
                    </li>
                    <li>
                        <Badge>
                            <Wind />{" "}
                            {institutionCurrentWeather?.wind.direction
                                .degrees ?? "N/A"}{" "}
                            {institutionCurrentWeather?.wind.direction
                                .cardinal ?? ""}
                        </Badge>
                    </li>
                    <li>
                        <Badge>
                            <Droplet />{" "}
                            {institutionCurrentWeather?.precipitation
                                .probability.percent ?? "N/A"}{" "}
                            %
                        </Badge>
                    </li>
                    <li>
                        <Badge>
                            <CloudRain />{" "}
                            {institutionCurrentWeather?.thunderstormProbability ??
                                "N/A"}{" "}
                            %
                        </Badge>
                    </li>
                </ul>

                <Alert className="mt-3">
                    <Info />
                    <AlertTitle>Friendly alert</AlertTitle>
                    <AlertDescription>
                        {institutionCurrentWeather
                            ? "Sleepy roads and heavy winds! Be careful."
                            : "No current weather data available."}
                    </AlertDescription>
                </Alert>
            </SchoolTabContentWrapper>

            <SchoolTabContentWrapper className="col-span-2 h-fit">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">
                            {institution.institution_name} Status Summary
                        </p>
                        <small>
                            {institutionCurrentWeather?.currentTime
                                ? formatTo12HourTime(
                                      institutionCurrentWeather.currentTime
                                  )
                                : "N/A"}
                        </small>
                    </div>
                    <small className="font-semibold text-neutral-500">
                        View breakdown
                    </small>
                </div>

                <ul className="grid grid-cols-3 gap-3 grid-rows-2 mt-3">
                    {dummyStatus.map((status) => (
                        <StatusCard
                            count={status.count}
                            text={status.text}
                            key={status.text}
                        />
                    ))}
                </ul>

                <ul className="flex space-x-3 mt-3">
                    <li>
                        <Badge>Onsite modality</Badge>
                    </li>
                    <li>
                        <Badge>Most commute</Badge>
                    </li>
                </ul>
            </SchoolTabContentWrapper>

            <SchoolTabContentWrapper className="col-span-4 grid grid-cols-2 gap-6 h-fit">
                <ForecastLineChart
                    forecast={institutionHourlyForecast}
                    className="w-full h-[15rem]"
                    schoolTabContentWrapperClassName="min-h-[15rem] h-fit"
                />
                <DailyForecastLineChart
                    forecast={institutionDailyForecast}
                    className="w-full h-[15rem]"
                    schoolTabContentWrapperClassName="min-h-[15rem] h-fit"
                />
            </SchoolTabContentWrapper>
        </TabsContent>
    );
};

export default SchoolTab;

interface SchoolTabContentWrapperProps {
    children: React.ReactNode;
    className?: string;
}

export const SchoolTabContentWrapper: React.FC<
    SchoolTabContentWrapperProps
> = ({ children, className }) => {
    return (
        <div className={`border rounded-lg p-5 h-fit ${className}`}>
            {children}
        </div>
    );
};

interface StatusCardProps {
    count: number;
    text: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ count, text }) => {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow flex items-center space-x-3 p-3">
            <p className="text-lg font-semibold">{count}</p>
            <p className="font-semibold">{text}</p>
        </div>
    );
};
