"use client";

import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
    Dispatch,
    SetStateAction,
    JSX,
} from "react";
import { Slider } from "../../../components/ui/slider";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { CloudRain } from "lucide-react";
import { StatusType } from "../../../object-types";

import { Alert, AlertDescription } from "../../../components/ui/alert";

interface RainVisualizerProps {
    status: StatusType | null;
    setStatus: Dispatch<SetStateAction<StatusType | null>>;
}

interface RainCondition {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
    description: string;
}

const RainVisualizer: React.FC<RainVisualizerProps> = ({
    status,
    setStatus,
}) => {
    // Parse current rain intensity from status, default to 0
    const currentRainIntensity = useMemo(() => {
        if (!status?.rainIntensity) return 0;
        const parsed = parseInt(status.rainIntensity, 10);
        return isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
    }, [status?.rainIntensity]);

    const [sliderValue, setSliderValue] =
        useState<number>(currentRainIntensity);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Rain condition interpreter with proper typing
    const getRainCondition = useCallback((intensity: number): RainCondition => {
        if (intensity === 0) {
            return {
                label: "No Rain",
                color: "text-gray-600",
                bgColor: "bg-gray-50",
                textColor: "text-gray-700",
                description: "Clear skies",
            };
        }
        if (intensity < 20) {
            return {
                label: "Light Drizzle",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                textColor: "text-blue-800",
                description: "Gentle moisture",
            };
        }
        if (intensity < 40) {
            return {
                label: "Light Rain",
                color: "text-cyan-600",
                bgColor: "bg-cyan-50",
                textColor: "text-cyan-800",
                description: "Steady droplets",
            };
        }
        if (intensity < 60) {
            return {
                label: "Moderate Rain",
                color: "text-blue-700",
                bgColor: "bg-blue-100",
                textColor: "text-blue-900",
                description: "Regular downpour",
            };
        }
        if (intensity < 80) {
            return {
                label: "Heavy Rain",
                color: "text-indigo-700",
                bgColor: "bg-indigo-100",
                textColor: "text-indigo-900",
                description: "Intense precipitation",
            };
        }
        return {
            label: "Torrential Rain",
            color: "text-purple-700",
            bgColor: "bg-purple-100",
            textColor: "text-purple-900",
            description: "Extreme downpour",
        };
    }, []);

    const rainCondition = useMemo(
        () => getRainCondition(currentRainIntensity),
        [currentRainIntensity, getRainCondition]
    );

    // Debounced update function with proper cleanup
    const updateRainIntensity = useCallback(
        (value: number) => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(() => {
                setStatus((prevStatus) => ({
                    floodHeight: prevStatus?.floodHeight || "0",
                    rainIntensity: value.toString(),
                    windSpeed: prevStatus?.windSpeed || "0",
                }));
            }, 150);
        },
        [setStatus]
    );

    // Sync slider with external status changes
    useEffect(() => {
        setSliderValue(currentRainIntensity);
    }, [currentRainIntensity]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            if (animationFrameRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Optimized raindrop generation with memoization
    const rainDrops = useMemo(() => {
        if (currentRainIntensity === 0) return [];

        const dropCount = Math.min(Math.floor(currentRainIntensity * 1.2), 60);
        const drops: JSX.Element[] = [];

        for (let i = 0; i < dropCount; i++) {
            const randomLeft = Math.random() * 100;
            const randomDelay = Math.random() * 2;
            const randomOpacity = Math.random() * 0.6 + 0.3;
            const randomHeight = Math.random() * 8 + 8;
            const animationSpeed = Math.max(
                0.3,
                1.5 - currentRainIntensity / 100
            );
            const randomWidth = Math.random() * 2 + 1;

            drops.push(
                <div
                    key={i}
                    className="absolute bg-blue-400/70 rounded-full"
                    style={{
                        left: `${randomLeft}%`,
                        top: `-10px`,
                        width: `${randomWidth}px`,
                        height: `${randomHeight}px`,
                        opacity: randomOpacity,
                        animation: `rainFall ${animationSpeed}s linear infinite`,
                        animationDelay: `${randomDelay}s`,
                        transform: `rotate(10deg)`,
                    }}
                />
            );
        }
        return drops;
    }, [currentRainIntensity]);

    // Generate puddle/splash effects for higher intensities
    const splashEffects = useMemo(() => {
        if (currentRainIntensity < 30) return [];

        const splashCount = Math.floor(currentRainIntensity / 20);
        const splashes: JSX.Element[] = [];

        for (let i = 0; i < splashCount; i++) {
            const randomLeft = Math.random() * 90 + 5;
            const randomDelay = Math.random() * 3;
            const size = Math.random() * 6 + 4;

            splashes.push(
                <div
                    key={`splash-${i}`}
                    className="absolute rounded-full bg-blue-300/40 animate-pulse"
                    style={{
                        left: `${randomLeft}%`,
                        bottom: "2px",
                        width: `${size}px`,
                        height: `${size / 2}px`,
                        animation: `splash 2s ease-in-out infinite`,
                        animationDelay: `${randomDelay}s`,
                    }}
                />
            );
        }
        return splashes;
    }, [currentRainIntensity]);

    const handleSliderChange = useCallback(
        (value: number[]) => {
            const newValue = value[0];
            setSliderValue(newValue);
            updateRainIntensity(newValue);
        },
        [updateRainIntensity]
    );

    // Dynamic background based on rain intensity
    const backgroundGradient = useMemo(() => {
        if (currentRainIntensity === 0) return "from-sky-100 to-blue-100";
        if (currentRainIntensity < 30) return "from-sky-200 to-blue-200";
        if (currentRainIntensity < 60) return "from-sky-300 to-blue-300";
        return "from-gray-400 to-slate-500";
    }, [currentRainIntensity]);

    return (
        <>
            {/* CSS Animation Keyframes */}
            <style jsx>{`
                @keyframes rainFall {
                    0% {
                        transform: translateY(-10px) rotate(10deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(150px) rotate(10deg);
                        opacity: 0;
                    }
                }

                @keyframes splash {
                    0%,
                    100% {
                        transform: scale(0.5);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                }

                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `}</style>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                        <CloudRain className="h-6 w-6 text-blue-400" />
                        Rain Visualizer
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Rain Intensity Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-300">
                                Rain Intensity
                            </span>
                            <span className="font-mono text-blue-400">
                                {sliderValue}%
                            </span>
                        </div>

                        <Slider
                            value={[sliderValue]}
                            max={100}
                            min={0}
                            step={1}
                            onValueChange={handleSliderChange}
                            className="w-full"
                        />

                        <div className="flex justify-between text-xs text-slate-400">
                            <span>No Rain</span>
                            <span>Torrential</span>
                        </div>
                    </div>

                    {/* Rain Animation Container */}
                    <div
                        className={`relative h-32 w-full bg-gradient-to-b ${backgroundGradient} rounded-lg overflow-hidden border-2`}
                    >
                        {/* Cloud overlay for darker conditions */}
                        {currentRainIntensity > 50 && (
                            <div className="absolute inset-0 bg-gray-700/20"></div>
                        )}

                        {/* Rain drops */}
                        {rainDrops}

                        {/* Splash effects */}
                        {splashEffects}

                        {/* Ground level indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

                        {/* Intensity indicator overlay */}
                        <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-700 bg-white/50 px-2 py-1 rounded">
                            {currentRainIntensity}%
                        </div>
                    </div>

                    {/* Rain Condition Alert */}
                    <Alert
                        className={`${
                            rainCondition.bgColor
                        } border-2 ${rainCondition.color.replace(
                            "text-",
                            "border-"
                        )}`}
                    >
                        <CloudRain
                            className={`h-4 w-4 ${rainCondition.color}`}
                        />
                        <AlertDescription className={rainCondition.textColor}>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        Condition:
                                    </span>
                                    <span className="font-bold">
                                        {rainCondition.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        Intensity:
                                    </span>
                                    <span className="font-mono">
                                        {currentRainIntensity}%
                                    </span>
                                </div>
                                <div className="text-sm opacity-80">
                                    {rainCondition.description}
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </>
    );
};

export default RainVisualizer;
