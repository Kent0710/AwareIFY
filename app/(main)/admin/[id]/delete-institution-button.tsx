"use client";

import deleteInstitution from "@/actions/delete-institution";
import { Button } from "@/components/ui/button";
import { Delete, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface DeleteInstitutionButtonProps {
    institutionId: string;
}
const DeleteInstitutionButton: React.FC<DeleteInstitutionButtonProps> = ({
    institutionId,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleInstitutionDelete = async () => {
        setIsDeleting(true);

        const res = await deleteInstitution(institutionId);

        if (!res.success) {
            toast("Failed to delete institution. Try again.");
        }

        toast.success("Institution deleted successfully!");
        setIsDeleting(false);
        redirect("/admin");
    };

    return (
        <Button
            variant={"destructive"}
            onClick={handleInstitutionDelete}
            disabled={isDeleting}
        >
            {isDeleting ? (
                <>
                    <Loader2 className="animate-spin" />
                    Deleting institution...
                </>
            ) : (
                <>
                    <Delete /> Delete Institution
                </>
            )}
        </Button>
    );
};

export default DeleteInstitutionButton;
