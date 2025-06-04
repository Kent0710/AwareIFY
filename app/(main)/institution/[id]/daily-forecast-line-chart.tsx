"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GoogleDailyForecastResponse } from "@/actions/getDailyWeatherForecast"; // Adjust path as needed
import { SchoolTabContentWrapper } from "./school-tab"; // Adjust path as needed

interface DailyForecastLineChartProps {
    forecast: GoogleDailyForecastResponse | null;
    className?: string;
    schoolTabContentWrapperClassName?: string;
}

type WeatherVariable =
    | "maxTemperature"
    | "minTemperature"
    | "feelsLikeMaxTemperature"
    | "feelsLikeMinTemperature"
    | "relativeHumidity"
    | "precipitationProbability";

interface VariableConfig {
    key: WeatherVariable;
    label: string;
    unit: string;
    formatter: (value: number) => string;
}

const variableConfigs: VariableConfig[] = [
    {
        key: "maxTemperature",
        label: "Max Temperature",
        unit: "°C",
        formatter: (value) => `${value}°C`,
    },
    {
        key: "minTemperature",
        label: "Min Temperature",
        unit: "°C",
        formatter: (value) => `${value}°C`,
    },
    {
        key: "feelsLikeMaxTemperature",
        label: "Feels Like Max",
        unit: "°C",
        formatter: (value) => `${value}°C`,
    },
    {
        key: "feelsLikeMinTemperature",
        label: "Feels Like Min",
        unit: "°C",
        formatter: (value) => `${value}°C`,
    },
    {
        key: "relativeHumidity",
        label: "Humidity (Daytime)",
        unit: "%",
        formatter: (value) => `${value}%`,
    },
    {
        key: "precipitationProbability",
        label: "Precipitation Chance (Daytime)",
        unit: "%",
        formatter: (value) => `${value}%`,
    },
];

const chartConfig = {
    weatherVariable: {
        label: "Weather Variable",
        color: "#8884d8",
    },
} satisfies ChartConfig;

export function DailyForecastLineChart({
    forecast,
    className,
    schoolTabContentWrapperClassName,
}: DailyForecastLineChartProps) {
    const [selectedVariable, setSelectedVariable] =
        useState<WeatherVariable>("maxTemperature");

    const currentConfig =
        variableConfigs.find((config) => config.key === selectedVariable) ||
        variableConfigs[0];

    // Transform forecast data for chart
    const chartData =
        forecast?.forecastDays
            ?.slice(0, 6) // Limit to first 6 days
            .map((day) => ({
                date: `${day.displayDate.month}/${day.displayDate.day}`,
                value:
                    selectedVariable === "maxTemperature"
                        ? day.maxTemperature.degrees
                        : selectedVariable === "minTemperature"
                        ? day.minTemperature.degrees
                        : selectedVariable === "feelsLikeMaxTemperature"
                        ? day.feelsLikeMaxTemperature.degrees
                        : selectedVariable === "feelsLikeMinTemperature"
                        ? day.feelsLikeMinTemperature.degrees
                        : selectedVariable === "relativeHumidity"
                        ? day.daytimeForecast.relativeHumidity
                        : selectedVariable === "precipitationProbability"
                        ? day.daytimeForecast.precipitation.probability.percent
                        : 0,
            })) || [];

    // Update chartConfig label dynamically
    chartConfig.weatherVariable.label = `${currentConfig.label} (${currentConfig.unit})`;

    // Get date for CardDescription
    const dateStr = forecast?.forecastDays?.[0]?.displayDate
        ? `${forecast.forecastDays[0].displayDate.month}/${forecast.forecastDays[0].displayDate.day}/${forecast.forecastDays[0].displayDate.year}`
        : "N/A";

    // Fallback for empty data
    if (chartData.length === 0) {
        return (
            <SchoolTabContentWrapper
                className={`col-span-2 ${
                    schoolTabContentWrapperClassName || ""
                }`}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Weather Forecast</CardTitle>
                        <CardDescription>{dateStr}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            No forecast data available
                        </p>
                    </CardContent>
                </Card>
            </SchoolTabContentWrapper>
        );
    }

    return (
        <SchoolTabContentWrapper
            className={`col-span-1 ${schoolTabContentWrapperClassName || ""}`}
        >
            <Card>
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <CardTitle>Daily Weather Forecast</CardTitle>
                        <Select
                            value={selectedVariable}
                            onValueChange={(value) =>
                                setSelectedVariable(value as WeatherVariable)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select variable" />
                            </SelectTrigger>
                            <SelectContent>
                                {variableConfigs.map((config) => (
                                    <SelectItem
                                        key={config.key}
                                        value={config.key}
                                    >
                                        {config.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <CardDescription>{dateStr}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className={className}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 12,
                                bottom: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={currentConfig.formatter}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="value"
                                type="monotone"
                                stroke={chartConfig.weatherVariable.color}
                                strokeWidth={2}
                                dot={{
                                    fill: chartConfig.weatherVariable.color,
                                    r: 4,
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 leading-none font-medium">
                        Weather forecast overview{" "}
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground leading-none">
                        Showing {currentConfig.label.toLowerCase()} forecast for
                        the next 6 days
                    </div>
                </CardFooter>
            </Card>
        </SchoolTabContentWrapper>
    );
}
