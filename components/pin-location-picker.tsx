"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Map, Marker } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

export interface LocationInfo {
    latitude: number;
    longitude: number;
    placeName?: string;
}

interface SearchResult {
    place_name: string;
    center: [number, number];
}

const PHILIPPINES_BBOX = [116.9283, 4.5869, 126.6049, 21.0701];

interface PinLocationPickerProps {
    location: LocationInfo | null;
    setLocation: Dispatch<SetStateAction<LocationInfo | null>>;
}
const PinLocationPicker: React.FC<PinLocationPickerProps> = ({
    location,
    setLocation
}) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<Map | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    // MapTiler API key
    const MAPTILER_API_KEY = "d8lUW305OaEKorlxzTek";
    // Bounding box for the Philippines: [minLng, minLat, maxLng, maxLat]

    useEffect(() => {
        if (!mapContainer.current) return;

        // Initialize MapTiler map, centered on Philippines
        map.current = new Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
            center: [121.774, 12.8797], // Center of Philippines
            zoom: 5,
        });

        // Add click event listener to place a marker
        map.current.on("click", async (e) => {
            const { lng, lat } = e.lngLat;

            // Remove existing marker if any
            const existingMarker = document.querySelector(
                ".maptiler-sdk-marker"
            );
            if (existingMarker) existingMarker.remove();

            // Add new marker
            new Marker({ color: "#FF0000" })
                .setLngLat([lng, lat])
                .addTo(map.current!);

            // Fetch place name using reverse geocoding
            try {
                const response = await fetch(
                    `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${MAPTILER_API_KEY}&bbox=${PHILIPPINES_BBOX.join(
                        ","
                    )}`
                );
                const data = await response.json();
                const placeName =
                    data.features[0]?.place_name || "Unknown location";

                setLocation({
                    latitude: lat,
                    longitude: lng,
                    placeName,
                });
            } catch (error) {
                console.error("Error fetching place name:", error);
                setLocation({
                    latitude: lat,
                    longitude: lng,
                    placeName: "Unknown location",
                });
            }
        });

        // Cleanup on unmount
        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, [setLocation]);

    // Handle search input change
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(
                    query
                )}.json?key=${MAPTILER_API_KEY}&bbox=${PHILIPPINES_BBOX.join(
                    ","
                )}`
            );
            const data = await response.json();
            setSearchResults(data.features || []);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        }
    };

    // Handle search result selection
    const handleSelectResult = (result: SearchResult) => {
        const [lng, lat] = result.center;

        // Remove existing marker if any
        const existingMarker = document.querySelector(".maptiler-sdk-marker");
        if (existingMarker) existingMarker.remove();

        // Add new marker
        new Marker({ color: "#FF0000" })
            .setLngLat([lng, lat])
            .addTo(map.current!);

        // Center map on selected location
        map.current?.setCenter([lng, lat]);
        map.current?.setZoom(12);

        // Update state
        setLocation({
            latitude: lat,
            longitude: lng,
            placeName: result.place_name,
        });

        // Clear search
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="absolute w-full h-full" />
            <div className="absolute top-5 left-5 w-80 z-[1000]">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search for a place in the Philippines"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchResults.length > 0 && (
                    <ul className="mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                            <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectResult(result)}
                            >
                                {result.place_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {location && (
                <div className="absolute bottom-5 left-5 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                    <h3 className="text-lg font-semibold">Selected Location</h3>
                    <p>Latitude: {location.latitude.toFixed(6)}</p>
                    <p>Longitude: {location.longitude.toFixed(6)}</p>
                    <p>Location: {location.placeName || "Unknown"}</p>
                </div>
            )}
        </div>
    );
};

export default PinLocationPicker;
