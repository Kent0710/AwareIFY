import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";

interface InstitutionCardProps {
    institutionName: string;
    placeName: string;
    badgeText? : string;
    href: string;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({
    institutionName,
    placeName,
    badgeText,
    href
}) => {
    return (
        <Link href={href}>
            {badgeText && (
                <Badge> {badgeText} </Badge>
            )}
            <div className="flex justify-between items-center">
                <h4 className="font-semibold"> {institutionName} </h4>
                <ChevronRight />
            </div>
            <p> {placeName} </p>
        </Link>
    );
};

export default InstitutionCard;