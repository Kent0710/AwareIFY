"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo, Dispatch, SetStateAction, JSX } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wind } from "lucide-react";
import { StatusType } from "@/object-types";

interface WindVisualizerProps {
    status: StatusType | null;
    setStatus: Dispatch<SetStateAction<StatusType | null>>;
}

interface WindCondition {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
}

const WindVisualizer: React.FC<WindVisualizerProps> = ({ status, setStatus }) => {
    // Parse current wind speed from status, default to 0
    const currentWindSpeed = useMemo(() => {
        if (!status?.windSpeed) return 0;
        const parsed = parseInt(status.windSpeed, 10);
        return isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
    }, [status?.windSpeed]);

    const [sliderValue, setSliderValue] = useState<number>(currentWindSpeed);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Wind condition interpreter with proper typing
    const getWindCondition = useCallback((speed: number): WindCondition => {
        if (speed < 10) {
            return {
                label: "Calm Breeze",
                color: "text-green-700",
                bgColor: "bg-green-100",
                textColor: "text-green-800"
            };
        }
        if (speed < 30) {
            return {
                label: "Gentle Wind",
                color: "text-blue-700",
                bgColor: "bg-blue-100",
                textColor: "text-blue-800"
            };
        }
        if (speed < 50) {
            return {
                label: "Strong Gust",
                color: "text-orange-700",
                bgColor: "bg-orange-100",
                textColor: "text-orange-800"
            };
        }
        if (speed < 70) {
            return {
                label: "Severe Wind",
                color: "text-red-700",
                bgColor: "bg-red-100",
                textColor: "text-red-800"
            };
        }
        return {
            label: "Stormy Conditions",
            color: "text-purple-700",
            bgColor: "bg-purple-100",
            textColor: "text-purple-800"
        };
    }, []);

    const windCondition = useMemo(() => getWindCondition(currentWindSpeed), [currentWindSpeed, getWindCondition]);

    // Debounced update function with proper cleanup
    const updateWindSpeed = useCallback((value: number) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(() => {
            setStatus(prevStatus => ({
                floodHeight: prevStatus?.floodHeight || "0",
                rainIntensity: prevStatus?.rainIntensity || "0",
                windSpeed: value.toString()
            }));
        }, 150);
    }, [setStatus]);

    // Sync slider with external status changes
    useEffect(() => {
        setSliderValue(currentWindSpeed);
    }, [currentWindSpeed]);

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

    // Optimized particle generation with memoization
    const windParticles = useMemo(() => {
        const particleCount = Math.min(Math.floor(currentWindSpeed * 0.8), 40);
        const particles: JSX.Element[] = [];
        
        for (let i = 0; i < particleCount; i++) {
            const randomTop = Math.random() * 80 + 10; // Keep particles within bounds
            const randomDelay = Math.random() * 3;
            const randomOpacity = Math.random() * 0.4 + 0.3;
            const randomSize = Math.random() * 4 + 2;
            const animationSpeed = Math.max(0.5, 3 - (currentWindSpeed / 40));
            
            particles.push(
                <div
                    key={i}
                    className="absolute rounded-full bg-white/70 animate-pulse"
                    style={{
                        top: `${randomTop}%`,
                        left: `-${10 + Math.random() * 10}%`,
                        width: `${randomSize}px`,
                        height: `${randomSize}px`,
                        opacity: randomOpacity,
                        animation: `windMove ${animationSpeed}s linear infinite`,
                        animationDelay: `${randomDelay}s`,
                        transform: `translateY(${Math.sin(i) * 10}px)`,
                    }}
                />
            );
        }
        return particles;
    }, [currentWindSpeed]);

    const handleSliderChange = useCallback((value: number[]) => {
        const newValue = value[0];
        setSliderValue(newValue);
        updateWindSpeed(newValue);
    }, [updateWindSpeed]);

    return (
        <>
            {/* CSS Animation Keyframes */}
            <style jsx>{`
                @keyframes windMove {
                    0% {
                        transform: translateX(-20px) translateY(0px);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(400px) translateY(-10px);
                        opacity: 0;
                    }
                }
            `}</style>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                        <Wind className="h-6 w-6 text-cyan-400" />
                        Wind Visualizer
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    {/* Wind Speed Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-300">Wind Speed</span>
                            <span className="font-mono text-cyan-400">{sliderValue} km/h</span>
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
                            <span>0 km/h</span>
                            <span>100 km/h</span>
                        </div>
                    </div>

                    {/* Wind Animation Container */}
                    <div className="relative h-32 w-full bg-gradient-to-r from-sky-200 to-blue-300 rounded-lg overflow-hidden border-2 ">
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        
                        {/* Wind particles */}
                        {windParticles}
                        
                        {/* Speed indicator overlay */}
                        <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-700 bg-white/50 px-2 py-1 rounded">
                            {currentWindSpeed} km/h
                        </div>
                    </div>

                    {/* Wind Condition Alert */}
                    <Alert className={`${windCondition.bgColor} border-2 ${windCondition.color.replace('text-', 'border-')}`}>
                        <Wind className={`h-4 w-4 ${windCondition.color}`} />
                        <AlertDescription className={windCondition.textColor}>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Condition:</span>
                                    <span className="font-bold">{windCondition.label}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Speed:</span>
                                    <span className="font-mono">{currentWindSpeed} km/h</span>
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </>
    );
};

export default WindVisualizer;