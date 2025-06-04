import PageWrapper from "@/components/page-wrapper";
import SectionWrapper from "../home/section-wrapper";
import getUserInstitutions from "@/actions/getUserInstitutions";
import InstitutionCard from "@/components/institution-card";
import JoinInstitution from "@/components/join-institution";
import CreateInstitution from "@/components/create-institution";

export default async function AdminPage() {
    const { success, error, institutions } = await getUserInstitutions();

    if (!success) {
        return (
            <div className="flex text-center items-center">
                {" "}
                {error.toString()}. Contact support.{" "}
            </div>
        );
    }

    return (
        <PageWrapper>
            <SectionWrapper title="Registerd Institutions as Admin">
                <div className="flex space-x-3 mb-3">
                    <JoinInstitution />
                    <CreateInstitution />
                </div>
                <ul className="grid grid-cols-5 gap-3">
                    {institutions.length > 0 && success ? (
                        institutions.map((institution) => (
                            <li
                                key={institution.institution.id}
                                className="px-8 py-4 rounded-lg border h-[8rem] hover:bg-neutral-100 hover:cursor-pointer w-full"
                            >
                                <InstitutionCard
                                    institutionName={
                                        institution.institution.institution_name
                                    }
                                    placeName={
                                        institution.institution.place_name
                                    }
                                    href={`/admin/${institution.institution.id}`}
                                    badgeText={'Admin'}
                                />
                            </li>
                        ))
                    ) : (
                        <p> No institution </p>
                    )}
                </ul>
            </SectionWrapper>
        </PageWrapper>
    );
}
