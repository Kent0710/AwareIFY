import { checkUser } from "@/actions/checkUser";
import ConfigureForm from "./configure-form";
import { redirect } from "next/navigation";

export default async function ConfigurePage() {
    const { isConfigured } = await checkUser();
    if (isConfigured) redirect("/home");

    return (
        <>  
            <ConfigureForm />
        </>
    );
}
