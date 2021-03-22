export default function DynamicTarget({ pathname, target, children }) {
    return (
        <div className="dynamicTarget"
            style={{
                display: `${target === pathname ? "block" : "none"}`
            }}>
            {children}
        </div>
    )
}