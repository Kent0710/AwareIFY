"use client";

import Image from "next/image";
import NULogo from "@/public/nulogo.webp";
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getCurrentWeather } from "@/actions/getCurrentWeather";
import { getHourlyWeatherForecast } from "@/actions/getHourlyWeatherForecast";
import { getDailyWeatherForecast } from "@/actions/getDailyWeatherForecast";
import { CloudRain, Cloudy, Droplet,  Loader2, Wind } from "lucide-react";
import React, { useState, useEffect } from "react";
import { GoogleApiResponse } from "@/actions/getCurrentWeather";
import { formatTo12HourTime } from "@/lib/utils";
import { GoogleHourlyForecastResponse } from "@/actions/getHourlyWeatherForecast";
import { ForecastLineChart } from "./hourly-forecast-line-chart";
import { DailyForecastLineChart } from "./daily-forecast-line-chart";
import { GoogleDailyForecastResponse } from "@/actions/getDailyWeatherForecast";
import { AnnouncementCarousel } from "../../home/announcement-carousel";
import { AnnouncementType } from "@/object-types";
import { getInstitutionStatusSummary } from "@/actions/getInstitutionSummary";
import getInstitutionById from "@/actions/getInstitutionById";
import { generateAIStatusSummary } from "@/actions/generateAIStatusSummary";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SchoolTabProps {
    institution: {
        id: string;
        institution_name: string;
        place_name: string;
        longitude: number;
        latitude: number;
    };
    announcements: AnnouncementType[] | [];
}

interface AIStatusSummary {
    headline: string;
    supportMessage: string;
    description: string;
}

const SchoolTab: React.FC<SchoolTabProps> = ({
    institution,
    announcements,
}) => {
    const {
        id: institutionId,
        longitude,
        latitude,
        institution_name,
        place_name,
    } = institution;
    const [institutionCurrentWeather, setInstitutionCurrentWeather] =
        useState<GoogleApiResponse | null>(null);
    const [institutionHourlyForecast, setInstitutionHourlyForecast] =
        useState<GoogleHourlyForecastResponse | null>(null);
    const [institutionDailyForecast, setInstitutionDailyForecast] =
        useState<GoogleDailyForecastResponse | null>(null);
    const [statusSummary, setStatusSummary] = useState<{
        safe: number;
        unsafe: number;
        pending: number;
        evacuated: number;
        ready: number;
        modality: string | null;
        transportation: string | null;
    } | null>(null);
    const [totalStakeholders, setTotalStakeholders] = useState<number>(0);
    const [aiStatusSummary, setAIStatusSummary] =
        useState<AIStatusSummary | null>(null);

    useEffect(() => {
        // Fetch all data
        const fetchData = async () => {
            // Fetch institution data and accounts
            const fetchInstitutionData = async () => {
                const result = await getInstitutionById(institutionId);
                if (result.success && result.accounts) {
                    setTotalStakeholders(result.accounts.length);
                }
            };

            // Fetch status summary
            const fetchStatusSummary = async () => {
                const result = await getInstitutionStatusSummary(institutionId);
                if (result.success && result.statusCounts) {
                    setStatusSummary({
                        ...result.statusCounts,
                        modality: result.modality,
                        transportation: result.transportation,
                    });
                }
            };

            // Fetch weather data and AI summary
            const fetchWeatherData = async () => {
                if (
                    !latitude ||
                    !longitude ||
                    isNaN(latitude) ||
                    isNaN(longitude)
                ) {
                    return;
                }

                try {
                    const [currentWeather, hourlyForecast, dailyForecast] =
                        await Promise.all([
                            getCurrentWeather(longitude, latitude),
                            getHourlyWeatherForecast(longitude, latitude),
                            getDailyWeatherForecast(longitude, latitude),
                        ]);

                    // Set weather states
                    setInstitutionCurrentWeather(currentWeather);
                    setInstitutionHourlyForecast(hourlyForecast);
                    setInstitutionDailyForecast(dailyForecast);

                    // Fetch AI summary with fresh weather data
                    const aiSummary = await generateAIStatusSummary(
                        currentWeather,
                        hourlyForecast,
                        dailyForecast
                    );
                    setAIStatusSummary(aiSummary);
                } catch (error) {
                    console.error(
                        "Error fetching weather data or AI summary:",
                        error
                    );
                }
            };

            // Run all fetches concurrently
            await Promise.all([
                fetchInstitutionData(),
                fetchStatusSummary(),
                fetchWeatherData(),
            ]);
        };

        fetchData();
    }, [institutionId, latitude, longitude]); // Only depend on props

    // Calculate derived metrics
    const unsafeProportion =
        totalStakeholders > 0
            ? (statusSummary?.unsafe || 0) / totalStakeholders
            : 0;
    const evacuatedProportion =
        totalStakeholders > 0
            ? (statusSummary?.evacuated || 0) / totalStakeholders
            : 0;

    const alertLevel =
        (institutionCurrentWeather?.precipitation.probability.percent || 0) >
            80 ||
        (institutionCurrentWeather?.wind.speed.value || 0) > 60 ||
        (institutionCurrentWeather?.thunderstormProbability || 0) > 60
            ? "High"
            : (institutionCurrentWeather?.precipitation.probability.percent ||
                  0) > 50 ||
              (institutionCurrentWeather?.wind.speed.value || 0) > 40 ||
              (institutionCurrentWeather?.thunderstormProbability || 0) > 40
            ? "Moderate"
            : "Low";

    const isHighVulnerability =
        unsafeProportion > 0.4 || evacuatedProportion > 0.3;

    if (
        !institutionCurrentWeather &&
        !institutionHourlyForecast &&
        !aiStatusSummary
    ) {
        return (
            <TabsContent
                value="school"
                className="flex items-center justify-center"
            >
                <div className="flex gap-3 items-center">
                    <Loader2 className="animate-spin" />
                    Getting weather data for institution...
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent
            value="school"
            className="grid grid-cols-4 grid-rows-fit gap-x-8 gap-y-6 pt-12 overflow-y-auto overflow-x-hidden"
        >
            <SchoolTabContentWrapper className="col-span-4 h-fit">
                <AnnouncementCarousel announcements={announcements} />
            </SchoolTabContentWrapper>

            <div className="col-span-4 grid grid-cols-1 lg:grid-rows-1 lg:grid-cols-4 gap-6 h-full ">
                <SchoolTabContentWrapper className="col-span-4 lg:col-span-1 h-full">
                    <p className="font-semibold">School</p>
                    <section className="flex items-center space-x-3">
                        <Image
                            src={NULogo}
                            alt="nulogo"
                            className="w-14 h-auto object-contain"
                        />
                        <div>
                            <h4 className="font-semibold text-lg">
                                {institution_name}
                            </h4>
                            <small className="text-neutral-500">
                                {place_name}
                            </small>
                        </div>
                    </section>
                    <Link href={`/admin/${institutionId}`}>
                        <Button className="mt-3"> View in admin panel </Button>
                    </Link>

                    <ul className="flex flex-wrap gap-3 mt-3">
                        <li>
                            <Badge>{totalStakeholders} stakeholders</Badge>
                        </li>
                        <li>
                            <Badge>Alert Level: {alertLevel}</Badge>
                        </li>
                        {isHighVulnerability && (
                            <li>
                                <Badge>High Vulnerability</Badge>
                            </li>
                        )}
                    </ul>
                </SchoolTabContentWrapper>

                <SchoolTabContentWrapper className="col-span-4 lg:col-span-1">
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
                        {institutionCurrentWeather?.weatherCondition
                            .iconBaseUri ? (
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
                                {institutionCurrentWeather?.temperature
                                    .degrees ?? "N/A"}{" "}
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
                                {institutionCurrentWeather?.cloudCover ?? "N/A"}{" "}
                                %
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
                </SchoolTabContentWrapper>

                <SchoolTabContentWrapper className="col-span-4 lg:col-span-2 h-full">
                    <p className="font-semibold">AI Status Summary</p>
                    <section className="grid grid-cols-3 mt-3">
                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <h4 className="text-lg font-semibold">
                                {aiStatusSummary?.headline || "Loading..."}
                            </h4>
                            <small className="text-neutral-500">
                                {aiStatusSummary?.supportMessage ||
                                    "Please wait"}
                            </small>
                        </div>
                        <div className="col-span-2">
                            <p>
                                {aiStatusSummary?.description ||
                                    "Awaiting AI analysis."}
                            </p>
                        </div>
                    </section>
                </SchoolTabContentWrapper>
            </div>

            <SchoolTabContentWrapper className="col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-6 h-fit">
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
