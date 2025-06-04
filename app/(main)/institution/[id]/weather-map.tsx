"use client";

import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import "@maptiler/geocoding-control/style.css";
import * as maptilerweather from "@maptiler/weather";
import { AccountType } from "@/object-types";
import { useSelectedAccountsStore } from "@/store/useSelectedAccountsStore";

interface MapProps {
    apiKey: string;
    devMode?: boolean;
    accounts: AccountType[] | [];
}

interface LegendConfig {
    label: string;
    unit: string;
    stops: { value: number; color: string }[];
}

const legendConfigs: Record<string, LegendConfig> = {
    Precipitation: {
        label: "Precipitation",
        unit: "mm",
        stops: [
            { value: 0, color: "#00FF00" }, // Green
            { value: 5, color: "#00CC00" },
            { value: 10, color: "#009900" },
            { value: 20, color: "#006600" },
            { value: 50, color: "#990099" }, // Purple
        ],
    },
    Radar: {
        label: "Radar",
        unit: "mm",
        stops: [
            { value: 0, color: "#00FF00" },
            { value: 5, color: "#00CC00" },
            { value: 10, color: "#009900" },
            { value: 20, color: "#006600" },
            { value: 50, color: "#990099" },
        ],
    },
    Pressure: {
        label: "Pressure",
        unit: "mbar",
        stops: [
            { value: 900, color: "#440154" }, // Viridis: Purple
            { value: 950, color: "#3b528b" },
            { value: 1000, color: "#21918c" },
            { value: 1050, color: "#5ec962" },
            { value: 1100, color: "#fde725" }, // Yellow
        ],
    },
    Temperature: {
        label: "Temperature",
        unit: "°C",
        stops: [
            { value: -10, color: "#0000FF" }, // Blue
            { value: 0, color: "#00FFFF" },
            { value: 15, color: "#FFFF00" },
            { value: 30, color: "#FF0000" },
            { value: 40, color: "#8B0000" }, // Dark Red
        ],
    },
};

const WeatherLegend: React.FC<{ layer: string }> = ({ layer }) => {
    let config: LegendConfig | undefined;
    if (layer === "Default") {
        config = legendConfigs.Precipitation; // Show Precipitation legend for Default
    } else if (layer === "Wind + Radar") {
        config = legendConfigs.Radar; // Show Radar legend for Wind + Radar
    } else {
        config = legendConfigs[layer];
    }

    if (!config || layer === "Wind" || layer === "None") {
        return null;
    }

    return (
        <div className="absolute bottom-4 right-4 z-10 bg-white p-4 rounded-md shadow-md border border-gray-200">
            <h4 className="text-sm font-semibold mb-2">
                {config.label} ({config.unit})
            </h4>
            <div
                className="w-40 h-4 mb-2"
                style={{
                    background: `linear-gradient(to right, ${config.stops
                        .map((stop) => stop.color)
                        .join(", ")})`,
                }}
            />
            <div className="flex justify-between text-xs text-gray-600">
                {config.stops.map((stop) => (
                    <span key={stop.value}>{stop.value}</span>
                ))}
            </div>
        </div>
    );
};

const WeatherMap: React.FC<MapProps> = ({
    apiKey,
    devMode = false,
    accounts,
}) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maptilersdk.Map | null>(null);
    const popup = useRef<maptilersdk.Popup | null>(null);
    const weatherLayers = useRef<{
        wind: maptilerweather.WindLayer | null;
        precipitation:
            | maptilerweather.PrecipitationLayer
            | maptilerweather.RadarLayer
            | maptilerweather.PressureLayer
            | maptilerweather.TemperatureLayer
            | null;
    }>({ wind: null, precipitation: null });
    const [selectedLayer, setSelectedLayer] = useState<string>("Default");

    const { selectedAccounts, addSelectedAccount } = useSelectedAccountsStore();

    useEffect(() => {
        // Early return if in dev mode or missing requirements
        if (devMode) {
            console.log("Map initialization skipped - Development mode active");
            return;
        }

        if (!apiKey || !mapContainer.current) return;

        maptilersdk.config.apiKey = apiKey;
        const bbox: [number, number, number, number] = [
            116.0, 5.0, 127.0, 21.0,
        ];

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.OPENSTREETMAP,
            zoom: 5,
            center: [121.5, 13.0] as [number, number],
        });

        console.log("map initialized");

        const gc = new GeocodingControl({ bbox });
        map.current.addControl(gc);

        popup.current = new maptilersdk.Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: "bottom",
        });

        map.current.on("load", () => {
            if (!map.current) return;

            map.current.setPaintProperty(
                "Water",
                "fill-color",
                "rgba(0, 0, 0, 0.4)"
            );

            // Add search results source and layer
            map.current.addSource("search-results", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [],
                },
            });

            map.current.addLayer({
                id: "point-result",
                type: "circle",
                source: "search-results",
                paint: {
                    "circle-radius": 8,
                    "circle-color": "#B42222",
                    "circle-opacity": 0.5,
                },
                filter: ["==", "$type", "Point"],
            });

            // Add accounts source and layer
            map.current.addSource("places", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: accounts.map((account) => ({
                        type: "Feature",
                        properties: {
                            title: account.username,
                            description: `<div class="popup-content">
                <h4>${account.username}</h4>
                <p>${account.place_name}</p>
              </div>`,
                            id: account.id,
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [
                                account.primary_location_longitude,
                                account.primary_location_latitude,
                            ],
                        },
                    })),
                },
            });

            map.current.addLayer({
                id: "places",
                type: "circle",
                source: "places",
                paint: {
                    "circle-radius": 8,
                    "circle-color": "#4264fb",
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                },
            });

            // Add hover events for account markers
            map.current.on(
                "mouseenter",
                "places",
                (e: maptilersdk.MapLayerMouseEvent) => {
                    if (
                        e.features &&
                        e.features.length > 0 &&
                        map.current &&
                        popup.current
                    ) {
                        map.current.getCanvas().style.cursor = "pointer";
                        let coordinates: [number, number] | null = null;
                        const geometry = e.features[0].geometry;
                        if (
                            geometry.type === "Point" &&
                            Array.isArray((geometry as GeoJSON.Point).coordinates)
                        ) {
                            const coords = (geometry as GeoJSON.Point).coordinates;
                            if (Array.isArray(coords) && coords.length >= 2) {
                                coordinates = [Number(coords[0]), Number(coords[1])] as [number, number];
                            }
                        }
                        if (!coordinates) return;
                        const description =
                            e.features[0].properties.description;

                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] +=
                                e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        popup.current
                            .setLngLat(coordinates)
                            .setHTML(description)
                            .addTo(map.current);
                    }
                }
            );

            map.current.on("mouseleave", "places", () => {
                if (map.current && popup.current) {
                    map.current.getCanvas().style.cursor = "";
                    popup.current.remove();
                }
            });

            // Add click event to store selected account
            map.current.on(
                "click",
                "places",
                (e: maptilersdk.MapLayerMouseEvent) => {
                    if (e.features && e.features.length > 0 && map.current) {
                        const feature = e.features[0];
                        const accountId = feature.properties.id as string;
                        const account = accounts.find(
                            (acc) => acc.id === accountId
                        );
                        if (
                            account &&
                            !selectedAccounts.some(
                                (acc) => acc.id === accountId
                            )
                        ) {
                            addSelectedAccount(account);
                        }
                    }
                }
            );

            // Initialize default layers: Wind and Precipitation
            weatherLayers.current.wind = new maptilerweather.WindLayer();
            map.current.addLayer(weatherLayers.current.wind, "Water");
            weatherLayers.current.precipitation =
                new maptilerweather.PrecipitationLayer();
            map.current.addLayer(weatherLayers.current.precipitation, "Water");
            weatherLayers.current.precipitation.animateByFactor(3600);
        });

        return () => {
            popup.current?.remove();
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const localWeatherLayers = weatherLayers.current;
            if (
                localWeatherLayers.wind &&
                map.current?.getLayer(localWeatherLayers.wind.id)
            ) {
                map.current.removeLayer(localWeatherLayers.wind.id);
            }
            if (
                localWeatherLayers.precipitation &&
                map.current?.getLayer(localWeatherLayers.precipitation.id)
            ) {
                map.current.removeLayer(localWeatherLayers.precipitation.id);
            }
            map.current?.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey, devMode, accounts]);

    const handleLayerChange = (layerName: string) => {
        if (devMode || !map.current || !map.current.isStyleLoaded()) return;

        // Remove existing weather layers
        if (
            weatherLayers.current.wind &&
            map.current.getLayer(weatherLayers.current.wind.id)
        ) {
            map.current.removeLayer(weatherLayers.current.wind.id);
            weatherLayers.current.wind = null;
        }
        if (
            weatherLayers.current.precipitation &&
            map.current.getLayer(weatherLayers.current.precipitation.id)
        ) {
            map.current.removeLayer(weatherLayers.current.precipitation.id);
            weatherLayers.current.precipitation = null;
        }

        // Add new weather layer(s)
        switch (layerName) {
            case "Default":
                weatherLayers.current.wind = new maptilerweather.WindLayer();
                map.current.addLayer(weatherLayers.current.wind, "Water");
                weatherLayers.current.precipitation =
                    new maptilerweather.PrecipitationLayer();
                map.current.addLayer(
                    weatherLayers.current.precipitation,
                    "Water"
                );
                weatherLayers.current.precipitation.animateByFactor(3600);
                break;
            case "Wind + Radar":
                weatherLayers.current.wind = new maptilerweather.WindLayer();
                map.current.addLayer(weatherLayers.current.wind, "Water");
                weatherLayers.current.precipitation =
                    new maptilerweather.RadarLayer();
                map.current.addLayer(
                    weatherLayers.current.precipitation,
                    "Water"
                );
                weatherLayers.current.precipitation.animateByFactor(3600);
                break;
            case "Wind":
                weatherLayers.current.wind = new maptilerweather.WindLayer();
                map.current.addLayer(weatherLayers.current.wind, "Water");
                break;
            case "Precipitation":
                weatherLayers.current.precipitation =
                    new maptilerweather.PrecipitationLayer();
                map.current.addLayer(
                    weatherLayers.current.precipitation,
                    "Water"
                );
                weatherLayers.current.precipitation.animateByFactor(3600);
                break;
            case "Radar":
                weatherLayers.current.precipitation =
                    new maptilerweather.RadarLayer();
                map.current.addLayer(
                    weatherLayers.current.precipitation,
                    "Water"
                );
                weatherLayers.current.precipitation.animateByFactor(3600);
                break;
            case "Pressure":
                weatherLayers.current.precipitation =
                    new maptilerweather.PressureLayer();
                map.current.addLayer(
                    weatherLayers.current.precipitation,
                    "Water"
                );
                weatherLayers.current.precipitation.animateByFactor(3600);
                break;
            case "Temperature":
                weatherLayers.current.precipitation =
                    new maptilerweather.TemperatureLayer();
                map.current.addLayer(
                    weatherLayers.current.precipitation,
                    "Water"
                );
                weatherLayers.current.precipitation.animateByFactor(3600);
                break;
            default:
                // "None" case: no layer is added
                break;
        }

        setSelectedLayer(layerName);
    };

    // Render a placeholder when in dev mode
    if (devMode) {
        return (
            <div className="w-full h-full bg-gray-100">
                <div className="text-center p-4">
                    <h2 className="text-xl font-semibold mb-2">
                        Map Development Mode
                    </h2>
                    <p className="text-gray-600">
                        Map initialization is disabled to prevent API calls
                    </p>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-700">
                            Set{" "}
                            <code className="bg-yellow-100 px-1 rounded">
                                devMode=false
                            </code>{" "}
                            to enable the map
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-4 left-4 z-10">
                <select
                    value={selectedLayer}
                    onChange={(e) => handleLayerChange(e.target.value)}
                    className="p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Default">Wind + Precipitation</option>
                    <option value="Wind + Radar">Wind + Radar</option>
                    <option value="None">No Weather Layer</option>
                    <option value="Wind">Wind</option>
                    <option value="Precipitation">Precipitation</option>
                    <option value="Radar">Radar</option>
                    <option value="Pressure">Pressure</option>
                    <option value="Temperature">Temperature</option>
                </select>
            </div>
            <WeatherLegend layer={selectedLayer} />
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
};

export default WeatherMap;
