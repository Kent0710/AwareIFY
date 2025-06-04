interface SectionWrapperProps {
    children : React.ReactNode;
    title : string;
    className? : string;
};

const SectionWrapper : React.FC<SectionWrapperProps> = ({
    children,
    title,
    className
}) => {
    return (
        <section className={className}>
            <p className="text-xl font-semibold mb-3"> {title} </p>
            {children}
        </section>
    )
};

export default SectionWrapper;