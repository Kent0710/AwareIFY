import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTo12HourTime(isoTimestamp: string): string {
    // Truncate to milliseconds only (JavaScript Date can't handle nanoseconds)
    const truncated = isoTimestamp.split(".")[0] + "Z";

    const date = new Date(truncated);

    // Check for invalid date
    if (isNaN(date.getTime())) {
        throw new Error("Invalid ISO timestamp");
    }

    // Format to 12-hour time
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
