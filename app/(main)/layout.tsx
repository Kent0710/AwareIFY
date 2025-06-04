import ClientLayoutWrapper from "@/components/client-layout-wrapper";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ClientLayoutWrapper>{children}</ClientLayoutWrapper>;
}
