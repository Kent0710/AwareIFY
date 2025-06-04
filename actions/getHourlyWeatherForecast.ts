"use server";

const GOOGLE_WEATHER_API_URL =
    "https://weather.googleapis.com/v1/forecast/hours:lookup";
    
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export interface GoogleHourlyForecastResponse {
    forecastHours: {
        interval: {
            startTime: string;
            endTime: string;
        };
        displayDateTime: {
            year: number;
            month: number;
            day: number;
            hours: number;
            utcOffset: string;
        };
        isDaytime: boolean;
        weatherCondition: {
            iconBaseUri?: string;
            description?: string;
            language?: string;
            type: string;
        };
        temperature: {
            degrees: number;
            unit: string;
        };
        feelsLikeTemperature?: number;
        unit?: string;
        dewPoint: {
            degrees: number;
            unit: string;
        };
        heatIndex: {
            degrees: number;
            unit: string;
        };
        windChill: {
            degrees: number;
            unit: string;
        };
        wetBulbTemperature: {
            degrees: number;
            unit: string;
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
        airPressure: {
            meanSeaLevelMillibars: number;
        };
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
        visibility: {
            distance: number;
            unit: string;
        };
        cloudCover: number;
        iceThickness: {
            thickness: number;
            unit: string;
        };
    }[];
    timeZone: {
        id: string;
    };
}

export async function getHourlyWeatherForecast(
    longitude: number,
    latitude: number
): Promise<GoogleHourlyForecastResponse | null> {
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
                `Failed to fetch hourly weather forecast: ${response.status} ${response.statusText}`
            );
        }

        const data: GoogleHourlyForecastResponse = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching hourly weather forecast:", error);
        return null;
    }
}
