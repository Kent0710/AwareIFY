import { checkUser } from "@/actions/checkUser"
import PageWrapper from "@/components/page-wrapper";
import { redirect } from "next/navigation";
import AccountFields from "../home/account-fields";

export default async function AccountPage() {
    const { account } = await checkUser();

    if (!account) redirect('/configure')

    return (
        <PageWrapper>
            <AccountFields account={account} />
        </PageWrapper>
    )
}