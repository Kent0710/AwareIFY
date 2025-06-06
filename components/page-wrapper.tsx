import React from "react";

interface PageWrapperProps {
    children : React.ReactNode
}
const PageWrapper : React.FC<PageWrapperProps> = ({
    children
}) => {
    return (
        <div className="p-3 lg:p-6">
            {children}
        </div>
    )
};

export default PageWrapper;