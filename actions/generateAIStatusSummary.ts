"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleApiResponse } from "@/actions/getCurrentWeather";
import { GoogleHourlyForecastResponse } from "./getHourlyWeatherForecast";
import { GoogleDailyForecastResponse } from "./getDailyWeatherForecast";

interface AIStatusSummary {
    headline: string;
    supportMessage: string;
    description: string;
}

export async function generateAIStatusSummary(
    currentWeather: GoogleApiResponse | null,
    hourlyForecast: GoogleHourlyForecastResponse | null,
    dailyForecast: GoogleDailyForecastResponse | null
): Promise<AIStatusSummary> {
    if (!currentWeather || !hourlyForecast || !dailyForecast) {
        return {
            headline: "Not available",
            supportMessage: "Check connection",
            description: "Weather AI data is not available at the moment.",
        };
    }
    // Initialize Gemini API client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Prepare weather data summary for Gemini
    const weatherSummary = `
    Current Weather:
    - Condition: ${currentWeather.weatherCondition.description.text}
    - Temperature: ${currentWeather.temperature.degrees}°C
    - Feels Like: ${currentWeather.feelsLikeTemperature.degrees}°C
    - Wind Speed: ${currentWeather.wind.speed.value} ${
        currentWeather.wind.speed.unit
    }
    - Humidity: ${currentWeather.relativeHumidity}%

    Hourly Forecast (next 6 hours):
    ${hourlyForecast.forecastHours
        .slice(0, 6)
        .map(
            (hour) => `
      - Time: ${hour.displayDateTime}
      - Temperature: ${hour.temperature.degrees}°C
      - Precipitation Chance: ${hour.precipitation.probability ?? 0}%
    `
        )
        .join("")}

    Daily Forecast (tomorrow):
    - Max Temperature: ${dailyForecast.forecastDays[1].maxTemperature.degrees}°C
    - Min Temperature: ${dailyForecast.forecastDays[1].minTemperature.degrees}°C
    - Precipitation Chance: ${
        dailyForecast.forecastDays[1].daytimeForecast.precipitation.probability
    }%
  `;

    const prompt = `
    Analyze the following weather data and generate a concise AI status summary in JSON format with three fields: 
    - "headline" (a short title, max 5 words),
    - "supportMessage" (a brief actionable note, max 5 words),
    - "description" (a one-sentence summary, max 30 words).
    The summary should be relevant to the weather conditions and their potential impact.
    Weather Data:
    ${weatherSummary}
    Return only the JSON object without any markdown formatting or code blocks.
  `;

    try {
        // Generate content using Gemini API
        const result = await model.generateContent(prompt);
        const generatedText = result.response.text();

        if (!generatedText) {
            throw new Error("No valid response from Gemini API");
        }

        // Clean the response text to extract JSON from markdown code blocks
        let cleanedText = generatedText.trim();

        // Remove markdown code blocks if present
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText
                .replace(/^```json\s*/, "")
                .replace(/\s*```$/, "");
        } else if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText
                .replace(/^```\s*/, "")
                .replace(/\s*```$/, "");
        }

        // Additional cleanup for any remaining backticks or whitespace
        cleanedText = cleanedText.replace(/^`+|`+$/g, "").trim();

        // Parse the JSON response from Gemini
        const summary: AIStatusSummary = JSON.parse(cleanedText);

        // Validate the response structure
        if (
            !summary.headline ||
            !summary.supportMessage ||
            !summary.description
        ) {
            throw new Error("Invalid summary structure from Gemini API");
        }

        return {
            headline: summary.headline,
            supportMessage: summary.supportMessage,
            description: summary.description,
        };
    } catch (error) {
        console.error("Error generating AI status summary:", error);
        // Fallback summary in case of API failure
        return {
            headline: "Weather Analysis Failed",
            supportMessage: "Check connection",
            description: "Unable to generate weather summary due to API error.",
        };
    }
}
