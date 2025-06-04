"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo, Dispatch, SetStateAction, JSX } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Waves } from "lucide-react";
import { StatusType } from "@/object-types";

interface FloodHeightVisualizerProps {
    status: StatusType | null;
    setStatus: Dispatch<SetStateAction<StatusType | null>>;
}

interface FloodCondition {
    label: string;
    level: string;
    color: string;
    bgColor: string;
    textColor: string;
    description: string;
    waterColor: string;
}

const FloodHeightVisualizer: React.FC<FloodHeightVisualizerProps> = ({ status, setStatus }) => {
    // Parse current flood height from status, default to 0
    const currentFloodHeight = useMemo(() => {
        if (!status?.floodHeight) return 0;
        const parsed = parseFloat(status.floodHeight);
        return isNaN(parsed) ? 0 : Math.max(0, Math.min(10, parsed));
    }, [status?.floodHeight]);

    const [sliderValue, setSliderValue] = useState<number>(currentFloodHeight);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Flood condition interpreter with proper typing
    const getFloodCondition = useCallback((height: number): FloodCondition => {
        if (height < 0.5) {
            return {
                label: "No Flood",
                level: "SAFE",
                color: "text-green-600",
                bgColor: "bg-green-50",
                textColor: "text-green-800",
                description: "Normal water levels",
                waterColor: "from-blue-200 to-blue-300"
            };
        }
        if (height < 1.5) {
            return {
                label: "Minor Flooding",
                level: "LOW",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                textColor: "text-yellow-800",
                description: "Slight water accumulation",
                waterColor: "from-blue-300 to-blue-400"
            };
        }
        if (height < 3) {
            return {
                label: "Moderate Flooding",
                level: "MODERATE",
                color: "text-orange-600",
                bgColor: "bg-orange-50",
                textColor: "text-orange-800",
                description: "Significant water levels",
                waterColor: "from-blue-400 to-blue-500"
            };
        }
        if (height < 5) {
            return {
                label: "Severe Flooding",
                level: "HIGH",
                color: "text-red-600",
                bgColor: "bg-red-50",
                textColor: "text-red-800",
                description: "Dangerous water levels",
                waterColor: "from-blue-500 to-blue-600"
            };
        }
        if (height < 7) {
            return {
                label: "Major Flooding",
                level: "SEVERE",
                color: "text-red-700",
                bgColor: "bg-red-100",
                textColor: "text-red-900",
                description: "Life-threatening conditions",
                waterColor: "from-blue-600 to-blue-700"
            };
        }
        return {
            label: "Catastrophic Flooding",
            level: "EXTREME",
            color: "text-purple-700",
            bgColor: "bg-purple-100",
            textColor: "text-purple-900",
            description: "Emergency evacuation needed",
            waterColor: "from-blue-700 to-blue-900"
        };
    }, []);

    const floodCondition = useMemo(() => getFloodCondition(currentFloodHeight), [currentFloodHeight, getFloodCondition]);

    // Debounced update function with proper cleanup
    const updateFloodHeight = useCallback((value: number) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(() => {
            setStatus(prevStatus => ({
                floodHeight: value.toString(),
                rainIntensity: prevStatus?.rainIntensity || "0",
                windSpeed: prevStatus?.windSpeed || "0"
            }));
        }, 150);
    }, [setStatus]);

    // Sync slider with external status changes
    useEffect(() => {
        setSliderValue(currentFloodHeight);
    }, [currentFloodHeight]);

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

    // Generate animated water waves
    const waterWaves = useMemo(() => {
        if (currentFloodHeight < 0.1) return [];
        
        const waves: JSX.Element[] = [];
        const waveCount = 3;
        
        for (let i = 0; i < waveCount; i++) {
            const delay = i * 0.5;
            const speed = 2 + (currentFloodHeight * 0.3);
            
            waves.push(
                <div
                    key={i}
                    className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-r from-blue-400/60 to-cyan-400/60 rounded-full"
                    style={{
                        animation: `wave ${speed}s ease-in-out infinite`,
                        animationDelay: `${delay}s`,
                        transform: `translateY(${-i * 2}px)`,
                        opacity: 0.7 - (i * 0.2),
                    }}
                />
            );
        }
        return waves;
    }, [currentFloodHeight]);

    // Generate water particles/droplets
    const waterParticles = useMemo(() => {
        if (currentFloodHeight < 1) return [];
        
        const particleCount = Math.min(Math.floor(currentFloodHeight * 8), 30);
        const particles: JSX.Element[] = [];
        
        for (let i = 0; i < particleCount; i++) {
            const randomLeft = Math.random() * 90 + 5;
            const randomBottom = Math.random() * 20 + 10;
            const randomDelay = Math.random() * 3;
            const size = Math.random() * 3 + 2;
            
            particles.push(
                <div
                    key={`particle-${i}`}
                    className="absolute rounded-full bg-white/40 animate-pulse"
                    style={{
                        left: `${randomLeft}%`,
                        bottom: `${randomBottom}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        animation: `float 3s ease-in-out infinite`,
                        animationDelay: `${randomDelay}s`,
                    }}
                />
            );
        }
        return particles;
    }, [currentFloodHeight]);

    const handleSliderChange = useCallback((value: number[]) => {
        const newValue = value[0];
        setSliderValue(newValue);
        updateFloodHeight(newValue);
    }, [updateFloodHeight]);

    // Calculate water height percentage for visual display
    const waterHeightPercentage = useMemo(() => {
        return Math.min((currentFloodHeight / 10) * 100, 100);
    }, [currentFloodHeight]);

    return (
        <>
            {/* CSS Animation Keyframes */}
            <style jsx>{`
                @keyframes wave {
                    0%, 100% {
                        transform: translateX(-50%) scaleX(1);
                    }
                    50% {
                        transform: translateX(-50%) scaleX(1.1);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-10px) rotate(180deg);
                    }
                }
                
                @keyframes ripple {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                        <Waves className="h-6 w-6 text-blue-400" />
                        Flood Height Visualizer
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    {/* Flood Height Control */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-300">Flood Height</span>
                            <span className="font-mono text-blue-400">{sliderValue.toFixed(1)}m</span>
                        </div>
                        
                        <Slider
                            value={[sliderValue]}
                            max={10}
                            min={0}
                            step={0.1}
                            onValueChange={handleSliderChange}
                            className="w-full"
                        />
                        
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>0m</span>
                            <span>10m</span>
                        </div>
                    </div>

                    {/* Flood Visualization Container */}
                    <div className="relative h-32 w-full bg-gradient-to-b from-sky-100 to-slate-200 rounded-lg overflow-hidden border-2 ">
                        {/* Background buildings/structures */}
                        <div className="absolute bottom-0 left-4 w-8 h-16 bg-gray-400 rounded-t-sm opacity-70"></div>
                        <div className="absolute bottom-0 left-16 w-6 h-12 bg-gray-500 rounded-t-sm opacity-70"></div>
                        <div className="absolute bottom-0 right-8 w-10 h-20 bg-gray-400 rounded-t-sm opacity-70"></div>
                        <div className="absolute bottom-0 right-20 w-8 h-14 bg-gray-500 rounded-t-sm opacity-70"></div>
                        
                        {/* Ground level */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 to-yellow-600"></div>
                        
                        {/* Water level */}
                        {currentFloodHeight > 0 && (
                            <div
                                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${floodCondition.waterColor} transition-all duration-700 ease-out`}
                                style={{
                                    height: `${waterHeightPercentage}%`,
                                    opacity: 0.8,
                                }}
                            >
                                {/* Water surface waves */}
                                {waterWaves}
                                
                                {/* Water particles */}
                                {waterParticles}
                            </div>
                        )}
                        
                        {/* Height indicator overlay */}
                        <div className="absolute bottom-2 right-2 text-xs font-mono text-slate-700 bg-white/50 px-2 py-1 rounded">
                            {currentFloodHeight.toFixed(1)}m
                        </div>
                    </div>

                    {/* Flood Condition Alert */}
                    <Alert className={`${floodCondition.bgColor} border-2 ${floodCondition.color.replace('text-', 'border-')}`}>
                        <Waves className={`h-4 w-4 ${floodCondition.color}`} />
                        <AlertDescription className={floodCondition.textColor}>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Status:</span>
                                    <span className="font-bold">{floodCondition.label}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Level:</span>
                                    <span className={`font-bold px-2 py-1 rounded text-xs ${floodCondition.level === 'SAFE' ? 'bg-green-200 text-green-800' : 
                                        floodCondition.level === 'LOW' ? 'bg-yellow-200 text-yellow-800' :
                                        floodCondition.level === 'MODERATE' ? 'bg-orange-200 text-orange-800' :
                                        floodCondition.level === 'HIGH' ? 'bg-red-200 text-red-800' :
                                        floodCondition.level === 'SEVERE' ? 'bg-red-300 text-red-900' :
                                        'bg-purple-200 text-purple-800'}`}>
                                        {floodCondition.level}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Height:</span>
                                    <span className="font-mono">{currentFloodHeight.toFixed(1)}m</span>
                                </div>
                                <div className="text-sm opacity-80 mt-2">
                                    {floodCondition.description}
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </>
    );
};

export default FloodHeightVisualizer;