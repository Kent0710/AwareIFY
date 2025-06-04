import SectionWrapper from "./section-wrapper";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountType } from "@/object-types";

interface AccountFieldProps {
    account : AccountType;
}
const AccountFields : React.FC<AccountFieldProps> = async ({
    account
}) => {
    return (
        <SectionWrapper title="Your Account">
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <Label htmlFor="longitude"> Longitude </Label>
                    <Input
                        name="longitude"
                        disabled
                        placeholder={account.primary_location_longitude.toString()}
                    />
                </div>
                <div>
                    <Label htmlFor="latitude">Latitude </Label>
                    <Input
                        name="latitude"
                        disabled
                        placeholder={account.primary_location_latitude.toString()}
                    />
                </div>
                <div>
                    <Label htmlFor="placeName"> Primary Location </Label>
                    <Input
                        name="placeName"
                        disabled
                        placeholder={account.place_name}
                    />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AccountFields;
