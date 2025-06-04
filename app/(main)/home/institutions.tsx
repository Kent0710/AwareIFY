import getUserInstitutions from "@/actions/getUserInstitutions";
import HomeSectionWrapper from "./section-wrapper";

import CreateInstitution from "@/components/create-institution";
import InstitutionCard from "@/components/institution-card";
import JoinInstitution from "@/components/join-institution";

const Institutions = async () => {
    const { success, institutions } = await getUserInstitutions();

    return (
        <HomeSectionWrapper title="Your Institution">
            <div className="space-x-3 mb-3">
                <JoinInstitution />
                <CreateInstitution />
            </div>

            <ul className="grid grid-cols-5 gap-3 ">
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
                                placeName={institution.institution.place_name}
                                href={`/institution/${institution.institution.id}`}
                            />
                        </li>
                    ))
                ) : (
                    <p> No institution </p>
                )}
            </ul>
        </HomeSectionWrapper>
    );
};

export default Institutions;


