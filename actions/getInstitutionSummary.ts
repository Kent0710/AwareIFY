"use server";

import { createClient } from "@/lib/db/supabase/server";

export async function getInstitutionStatusSummary(institutionId: string) {
    const supabase = await createClient();

    // Fetch institution status counts
    const { data: institutionData, error: institutionError } = await supabase
        .from("institution")
        .select("safe, unsafe, pending, evacuated, ready")
        .eq("id", institutionId)
        .single();

    if (institutionError || !institutionData) {
        console.error(institutionError || "Failed to fetch institution data");
        return {
            success: false,
            error: "Failed to fetch institution status",
            statusCounts: null,
            modality: null,
            transportation: null,
        };
    }

    // Calculate total stakeholders
    const totalStakeholders =
        (institutionData.safe || 0) +
        (institutionData.unsafe || 0) +
        (institutionData.pending || 0);

    // Fetch dominant modality and transportation
    const { data: statusData, error: statusError } = await supabase
        .from("status")
        .select("modality, transportation")
        .eq(
            "account_id",
            supabase
                .from("account_institution")
                .select("account_id")
                .eq("institution_id", institutionId)
        );

    if (statusError) {
        console.error(statusError);
        return {
            success: false,
            error: "Failed to fetch status data",
            statusCounts: institutionData,
            modality: null,
            transportation: null,
        };
    }

    // Calculate dominant modality
    const modalityCounts = statusData.reduce((acc, { modality }) => {
        if (modality) acc[modality] = (acc[modality] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const dominantModality =
        Object.entries(modalityCounts).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ["", 0]
        )[0] || null;

    // Calculate dominant transportation
    const transportationCounts = statusData.reduce(
        (acc, { transportation }) => {
            if (transportation)
                acc[transportation] = (acc[transportation] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );
    const dominantTransportation =
        Object.entries(transportationCounts).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ["", 0]
        )[0] || null;

    return {
        success: true,
        error: null,
        statusCounts: institutionData,
        modality: dominantModality,
        transportation: dominantTransportation,
        totalStakeholders,
    };
}
