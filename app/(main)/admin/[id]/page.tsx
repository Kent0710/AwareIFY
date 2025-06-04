import getInstitutionById from "@/actions/getInstitutionById";
import PageWrapper from "@/components/page-wrapper";
import SectionWrapper from "../../home/section-wrapper";
import AccountDataTable from "./account-data-table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DeleteInstitutionButton from "./delete-institution-button";
import AnnouncementDataTable from "./announcement-data-table";
import CreateAnnouncement from "./create-announcement";
import getAnnouncement from "@/actions/getAnnouncements";

export default async function AdminInstitutionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const awaitedParams = await params;

    const { success, error, institution, accounts } = await getInstitutionById(
        awaitedParams.id
    );

    const { announcements } = await getAnnouncement(awaitedParams.id);

    if (!success || error || !institution) {
        return (
            <div className="flex justify-center items-center">
                <p>{error?.toString() || "Institution not found"}</p>
            </div>
        );
    }

    const formattedInstitutionDetails = [
        {
            mainText: institution.code,
            title: "Institution Code",
            description: "Code to be used to join this institution.",
        },
        {
            mainText: accounts.length.toString(),
            title: "Number of Students",
            description: "Number of students registered in this institution.",
        },
        {
            mainText: `${institution.safe} Safe student(s)`,
            title: "Safe Marked Students",
            description:
                "Number of students marked as safe in this institution.",
        },
        {
            mainText: `${institution.unsafe} Unsafe student(s)`,
            title: "Unsafe Marked Students",
            description:
                "Number of students marked as unsafe in this institution.",
        },
        {
            mainText: `${institution.pending} Pending student(s)`,
            title: "Pending Students",
            description: "Number of students still pending of status.",
        },
    ];

    return (
        <PageWrapper>
            <SectionWrapper title="Institution Details" className="mb-6">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    {formattedInstitutionDetails.map((detail) => (
                        <AdminInstitutionCard
                            key={detail.title}
                            mainText={detail.mainText}
                            description={detail.description}
                            title={detail.title}
                        />
                    ))}
                </div>
            </SectionWrapper>

            <SectionWrapper title="Announcements" className="mb-6">
                <div className="flex space-x-3">
                    <CreateAnnouncement institutionId={awaitedParams.id} />
                </div>
                <AnnouncementDataTable announcements={announcements} />
            </SectionWrapper>

            <SectionWrapper title="Students Registered" className="mb-6">
                <AccountDataTable accounts={accounts} />
            </SectionWrapper>

            <SectionWrapper title="Actions">
                <div className="grid grid-cols-4 gap-3">
                    <div>
                        <Label htmlFor="institutionName">
                            Institution Name
                        </Label>
                        <Input
                            name="institutionName"
                            placeholder={institution.institution_name}
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="institutionLongitude">Longitude</Label>
                        <Input
                            name="institutionLongitude"
                            placeholder={
                                institution.longitude?.toString() || ""
                            }
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="institutionLatitude">Latitude</Label>
                        <Input
                            name="institutionLatitude"
                            placeholder={institution.latitude?.toString() || ""}
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="placeName">Place Name</Label>
                        <Input
                            name="placeName"
                            placeholder={institution.place_name}
                            disabled
                        />
                    </div>
                </div>

                <div className="mt-3">
                    <DeleteInstitutionButton institutionId={institution.id} />
                </div>
            </SectionWrapper>
        </PageWrapper>
    );
}

interface AdminInstitutionCardProps {
    mainText: string;
    title: string;
    description: string;
}
const AdminInstitutionCard: React.FC<AdminInstitutionCardProps> = ({
    mainText,
    title,
    description,
}) => {
    return (
        <div className="border shadow rounded-lg px-6 py-4">
            <p>{title}</p>
            <h4 className="text-2xl font-semibold">{mainText}</h4>
            <small className="text-neutral-500">{description}</small>
        </div>
    );
};
