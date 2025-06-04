"use server";

const GOOGLE_WEATHER_API_URL =
    "https://weather.googleapis.com/v1/forecast/days:lookup";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export interface GoogleDailyForecastResponse {
    forecastDays: {
        interval: {
            startTime: string;
            endTime: string;
        };
        displayDate: {
            year: number;
            month: number;
            day: number;
        };
        daytimeForecast: {
            interval: {
                startTime: string;
                endTime: string;
            };
            weatherCondition: {
                iconBaseUri?: string;
                description?: {
                    text: string;
                    languageCode: string;
                };
                type: string;
            };
            relativeHumidity: number;
            uvIndex: number;
            precipitation: {
                probability: {
                    percent: number;
                    type: string;
                };
                qpf: {
                    quantity: number;
                    unit: string;
                };
            };
            thunderstormProbability: number;
            wind: {
                direction: {
                    degrees: number;
                    cardinal: string;
                };
                speed: {
                    value: number;
                    unit: string;
                };
                gust: {
                    value: number;
                    unit: string;
                };
            };
            cloudCover: number;
        };
        nighttimeForecast: {
            interval: {
                startTime: string;
                endTime: string;
            };
            weatherCondition: {
                iconBaseUri?: string;
                description?: {
                    text: string;
                    languageCode: string;
                };
                type: string;
            };
            relativeHumidity: number;
            uvIndex: number;
            precipitation: {
                probability: {
                    percent: number;
                    type: string;
                };
                qpf: {
                    quantity: number;
                    unit: string;
                };
            };
            thunderstormProbability: number;
            wind: {
                direction: {
                    degrees: number;
                    cardinal: string;
                };
                speed: {
                    value: number;
                    unit: string;
                };
                gust: {
                    value: number;
                    unit: string;
                };
            };
            cloudCover: number;
        };
        maxTemperature: {
            degrees: number;
            unit: string;
        };
        minTemperature: {
            degrees: number;
            unit: string;
        };
        feelsLikeMaxTemperature: {
            degrees: number;
            unit: string;
        };
        feelsLikeMinTemperature: {
            degrees: number;
            unit: string;
        };
        sunEvents: {
            sunriseTime: string;
            sunsetTime: string;
        };
        moonEvents: {
            moonPhase: string;
            moonriseTimes: string[];
            moonsetTimes: string[];
        };
        maxHeatIndex: {
            degrees: number;
            unit: string;
        };
        iceThickness: {
            thickness: number;
            unit: string;
        };
    }[];
    timeZone: {
        id: string;
    };
}

export async function getDailyWeatherForecast(
    longitude: number,
    latitude: number
): Promise<GoogleDailyForecastResponse | null> {
    if (!GOOGLE_API_KEY) {
        throw new Error("Google API key is not set in environment variables");
    }

    if (
        typeof longitude !== "number" ||
        typeof latitude !== "number" ||
        isNaN(longitude) ||
        isNaN(latitude)
    ) {
        throw new Error(
            "Invalid coordinates: longitude and latitude must be valid numbers"
        );
    }

    const url = `${GOOGLE_WEATHER_API_URL}?key=${GOOGLE_API_KEY}&location.latitude=${latitude}&location.longitude=${longitude}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store", // Ensure fresh data
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch daily weather forecast: ${response.status} ${response.statusText}`
            );
        }

        const data: GoogleDailyForecastResponse = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching daily weather forecast:", error);
        return null;
    }
}
