import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { Dispatch, SetStateAction } from "react";

interface PersonalizedStatusCardProps {
    title: string;
    firstOption: {
        mainText: string;
        description: string;
        value: string;
    };
    secondOption: {
        mainText: string;
        description: string;
        value: string;
    };
    state: string | null;
    setState: Dispatch<SetStateAction<string | null>>;
}

const PersonalizedStatusCard: React.FC<PersonalizedStatusCardProps> = ({
    title,
    firstOption,
    secondOption,
    state,
    setState,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-6">
                    <PersonalizedStatusCardOption
                        mainText={firstOption.mainText}
                        description={firstOption.description}
                        onClick={() => setState(firstOption.value)}
                        state={state}
                        value={firstOption.value}
                    />
                    <PersonalizedStatusCardOption
                        mainText={secondOption.mainText}
                        description={secondOption.description}
                        onClick={() => setState(secondOption.value)}
                        state={state}
                        value={secondOption.value}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

interface PersonalizedStatusCardOptionProps {
    mainText: string;
    description: string;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    state: string | null;
    value: string;
}

const PersonalizedStatusCardOption: React.FC<
    PersonalizedStatusCardOptionProps
> = ({ mainText, description, onClick, state, value }) => {
    return (
        <div
            className={`border p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                state === value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
            }`}
            onClick={onClick}
        >
            <p className="font-semibold">{mainText}</p>
            <small
                className={`${
                    state === value ? "text-neutral-200" : "text-neutral-500"
                }`}
            >
                {description}
            </small>
        </div>
    );
};

export default PersonalizedStatusCard;
