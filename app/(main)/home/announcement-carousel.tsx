"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { AnnouncementType } from "@/object-types";

interface AnnouncementCarouselProps {
    announcements?: AnnouncementType[];
}

export function AnnouncementCarousel({
    announcements,
}: AnnouncementCarouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    // Default slides to show if no announcements are provided
    const defaultSlides = [
        {
            title: "Welcome to AwareIFY",
            description:
                "A School Weather App for School Monitoring during Weather Disturbances.",
        },
        {
            title: "Our Goal",
            description:
                "To provide schools with student-specific data for monitoring students during weather disturbances. We are targeting their community—the students.",
        },
        {
            title: "Why It Matters",
            description:
                "We are hoping that this student-specific data can help schools in decision-making during weather disturbances to make data-driven informed decisions.",
        },
    ];

    // Use announcements if provided and not empty, otherwise use default slides
    const slides =
        announcements && announcements.length > 0
            ? announcements.map((announcement) => ({
                  title: announcement.main_text,
                  description:
                      announcement.description || "No description provided",
              }))
            : defaultSlides;

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {slides.map((slide, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="h-full w-full py-12 space-y-6">
                                    <section className="flex items-center justify-center flex-col">
                                        <h2 className="text-3xl font-bold mb-4">
                                            {slide.title}
                                        </h2>
                                        <p className="text-lg">
                                            {slide.description}
                                        </p>
                                    </section>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
