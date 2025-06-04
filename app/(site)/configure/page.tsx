import { checkUser } from "@/actions/checkUser";
import ConfigureForm from "./configure-form";
import { redirect } from "next/navigation";
import Header from "@/components/header";

export default async function ConfigurePage() {
    const { isConfigured } = await checkUser();
    if (isConfigured) redirect("/home");

    return (
        <>  
        <Header />
            <ConfigureForm />
        </>
    );
}
