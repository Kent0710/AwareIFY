"use client";

import PageWrapper from "@/components/page-wrapper";
import SectionWrapper from "../home/section-wrapper";
import FloodHeightVisualizer from "./flood-height-visualizer";
import WindVisualizer from "./wind-visualizer";
import RainVisualizer from "./rain-visualizer";
import PersonalizedStatusCard from "./personalized-status-card";
import { useEffect, useState } from "react";
import { StatusTableType, StatusType, UpdateStatusType } from "@/object-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import updateStatus from "@/actions/updateStatus";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import getStatuses from "@/actions/getStatuses";
import StatusTable from "./status-table";

export default function StatusPage() {
    const [statuses, setStatuses] = useState<StatusTableType[] | []>([]);

    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const [status, setStatus] = useState<StatusType | null>(null);
    const [modality, setModality] = useState<string | null>(null);
    const [transportation, setTransportation] = useState<string | null>(null);
    const [safety, setSafety] = useState<string | null>(null);
    const [evacuation, setEvacuation] = useState<string | null>(null);
    const [readiness, setReadiness] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStatuses() {
            const res = await getStatuses();

            if (!res.success && res.error) {
                setError(res.error.toString());
                return;
            }

            setStatuses(res.statuses);
        }

        fetchStatuses();
    }, []);

    const updateStatusHandler = async () => {
        const floodHeight = status?.floodHeight || null;
        const rainIntensity = status?.rainIntensity || null;
        const windSpeed = status?.windSpeed || null;

        const values: UpdateStatusType = {
            floodHeight,
            rainIntensity,
            windSpeed,
            modality,
            transportation,
            safety,
            evacuation,
            readiness,
        };

        if (
            Object.values(values).some(
                (value) => value === null || value === undefined
            )
        ) {
            alert("Please fill in all fields before updating the status.");
            return;
        }

        setIsUpdating(true);

        const res = await updateStatus(values);

        if (!res.success && res.error) {
            setError(res.error.toString());
        }

        setIsUpdating(false);
        toast.success("Status updated successfully.");
    };

    return (
        <PageWrapper>
            <SectionWrapper title="Status History" className="mb-6">
                <StatusTable data={statuses} />
            </SectionWrapper>

            <SectionWrapper title="Self Weather Status" className="mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Status Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <p className="font-semibold">Flood Height</p>
                                <p className="text-neutral-500">
                                    {status?.floodHeight || "Not available"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Rain Intensity</p>
                                <p className="text-neutral-500">
                                    {status?.rainIntensity || "Not available"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Wind Speed</p>
                                <p className="text-neutral-500">
                                    {status?.windSpeed || "Not available"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Modality</p>
                                <p className="text-neutral-500">
                                    {modality
                                        ? modality === "online"
                                            ? "Online Classes"
                                            : "Onsite Classes"
                                        : "Not selected"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Transportation</p>
                                <p className="text-neutral-500">
                                    {transportation
                                        ? transportation === "commute"
                                            ? "Commute"
                                            : "Own Car"
                                        : "Not selected"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Safety</p>
                                <p className="text-neutral-500">
                                    {safety
                                        ? safety === "safe"
                                            ? "Safe"
                                            : "Unsafe"
                                        : "Not selected"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Evacuation</p>
                                <p className="text-neutral-500">
                                    {evacuation
                                        ? evacuation === "evacuated"
                                            ? "Evacuated"
                                            : "Not Evacuated"
                                        : "Not selected"}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Readiness</p>
                                <p className="text-neutral-500">
                                    {readiness
                                        ? readiness === "ready"
                                            ? "Ready"
                                            : "Not Ready"
                                        : "Not selected"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="mt-3 space-x-3">
                    <Button
                        onClick={updateStatusHandler}
                        className="w-[11rem]"
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <div className="flex gap-3 items-center">
                                {" "}
                                <Loader2 className="animate-spin" /> Updating
                                status...{" "}
                            </div>
                        ) : (
                            <>Update status</>
                        )}
                    </Button>
                    <Button
                        variant={"secondary"}
                        onClick={() => {
                            setError("");
                            setStatus(null);
                            setModality(null);
                            setTransportation(null);
                            setSafety(null);
                            setEvacuation(null);
                            setReadiness(null);
                        }}
                    >
                        Clear button
                    </Button>
                </div>
                <p> {error} </p>
            </SectionWrapper>

            <SectionWrapper title="Visualizers" className="mb-6">
                <div className="grid grid-cols-3 gap-6">
                    <WindVisualizer status={status} setStatus={setStatus} />
                    <FloodHeightVisualizer
                        status={status}
                        setStatus={setStatus}
                    />
                    <RainVisualizer status={status} setStatus={setStatus} />
                </div>
            </SectionWrapper>
            <SectionWrapper title="Personalized">
                <div className="grid grid-cols-3 grid-rows-2 gap-6">
                    <PersonalizedStatusCard
                        title="Modality"
                        firstOption={{
                            mainText: "Online Classes",
                            description: "Attending classes from home.",
                            value: "online",
                        }}
                        secondOption={{
                            mainText: "Onsite Classes",
                            description: "Attending classes in person.",
                            value: "onsite",
                        }}
                        state={modality}
                        setState={setModality}
                    />
                    <PersonalizedStatusCard
                        title="Transportation"
                        firstOption={{
                            mainText: "Commute",
                            description: "Using public transport.",
                            value: "commute",
                        }}
                        secondOption={{
                            mainText: "Own Car",
                            description: "Drive own for transport.",
                            value: "own-car",
                        }}
                        state={transportation}
                        setState={setTransportation}
                    />
                    <PersonalizedStatusCard
                        title="Safety"
                        firstOption={{
                            mainText: "Safe",
                            description: "Safe and well condition.",
                            value: "safe",
                        }}
                        secondOption={{
                            mainText: "Unsafe",
                            description: "You are not safe and well.",
                            value: "unsafe",
                        }}
                        state={safety}
                        setState={setSafety}
                    />
                    <PersonalizedStatusCard
                        title="Evacuation"
                        firstOption={{
                            mainText: "Evacuated",
                            description: "In a safe place.",
                            value: "evacuated",
                        }}
                        secondOption={{
                            mainText: "Not Evacuated",
                            description: "Not in a safe place.",
                            value: "not-evacuated",
                        }}
                        state={evacuation}
                        setState={setEvacuation}
                    />
                    <PersonalizedStatusCard
                        title="Readiness"
                        firstOption={{
                            mainText: "Ready",
                            description: "Ready to attend classes.",
                            value: "ready",
                        }}
                        secondOption={{
                            mainText: "Not Ready",
                            description: "Not ready to attend classes.",
                            value: "not-ready",
                        }}
                        state={readiness}
                        setState={setReadiness}
                    />
                </div>
            </SectionWrapper>
        </PageWrapper>
    );
}
