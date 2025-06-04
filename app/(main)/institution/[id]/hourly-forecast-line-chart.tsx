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
import { GoogleHourlyForecastResponse } from "@/actions/getHourlyWeatherForecast";
import { SchoolTabContentWrapper } from "./school-tab";

interface HourlyTemperatureChartProps {
    forecast: GoogleHourlyForecastResponse | null;
    className?: string;
    schoolTabContentWrapperClassName?: string;
}

type WeatherVariable =
    | "temperature"
    | "feelsLikeTemperature"
    | "relativeHumidity"
    | "windSpeed"
    | "precipitationProbability"
    | "airPressure";

interface VariableConfig {
    key: WeatherVariable;
    label: string;
    unit: string;
    formatter: (value: number) => string;
}

const variableConfigs: VariableConfig[] = [
    {
        key: "temperature",
        label: "Temperature",
        unit: "°C",
        formatter: (value) => `${value}°C`,
    },
    {
        key: "feelsLikeTemperature",
        label: "Feels Like",
        unit: "°C",
        formatter: (value) => `${value}°C`,
    },
    {
        key: "relativeHumidity",
        label: "Humidity",
        unit: "%",
        formatter: (value) => `${value}%`,
    },
    {
        key: "windSpeed",
        label: "Wind Speed",
        unit: "km/h",
        formatter: (value) => `${value} km/h`,
    },
    {
        key: "precipitationProbability",
        label: "Precipitation Chance",
        unit: "%",
        formatter: (value) => `${value}%`,
    },
    {
        key: "airPressure",
        label: "Air Pressure",
        unit: "mbar",
        formatter: (value) => `${value} mbar`,
    },
];

const chartConfig = {
    weatherVariable: {
        label: "Weather Variable",
        color: "#8884d8",
    },
} satisfies ChartConfig;

export function ForecastLineChart({
    forecast,
    className,
    schoolTabContentWrapperClassName,
}: HourlyTemperatureChartProps) {
    const [selectedVariable, setSelectedVariable] =
        useState<WeatherVariable>("temperature");

    const currentConfig =
        variableConfigs.find((config) => config.key === selectedVariable) ||
        variableConfigs[0];

    // Transform forecast data for chart
    const chartData =
        forecast?.forecastHours
            ?.slice(0, 6) // Limit to first 6 hours
            .map((hour) => ({
                hour: `${hour.displayDateTime.hours}:00`,
                value:
                    selectedVariable === "temperature"
                        ? hour.temperature.degrees
                        : selectedVariable === "feelsLikeTemperature"
                        ? hour.feelsLikeTemperature ?? 0
                        : selectedVariable === "relativeHumidity"
                        ? hour.relativeHumidity
                        : selectedVariable === "windSpeed"
                        ? hour.wind.speed.value
                        : selectedVariable === "precipitationProbability"
                        ? hour.precipitation.probability.percent
                        : selectedVariable === "airPressure"
                        ? hour.airPressure.meanSeaLevelMillibars
                        : 0,
            })) || [];

    // Update chartConfig label dynamically
    chartConfig.weatherVariable.label = `${currentConfig.label} (${currentConfig.unit})`;

    // Get date for CardDescription
    const dateStr = forecast?.forecastHours?.[0]?.displayDateTime
        ? `${forecast.forecastHours[0].displayDateTime.month}/${forecast.forecastHours[0].displayDateTime.day}/${forecast.forecastHours[0].displayDateTime.year}`
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
                        <CardTitle>Hourly Weather Forecast</CardTitle>
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
                        <CardTitle>Hourly Weather Forecast</CardTitle>
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
                                dataKey="hour"
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
                    <div className="flex gap-2 items-center leading-none font-medium">
                        Weather forecast overview{" "}
                        <TrendingUp className="h-4 w-auto" />
                    </div>
                    <div className="text-muted-foreground leading-none">
                        Showing {currentConfig.label.toLowerCase()} forecast for
                        the next 6 hours
                    </div>
                </CardFooter>
            </Card>
        </SchoolTabContentWrapper>
    );
}
