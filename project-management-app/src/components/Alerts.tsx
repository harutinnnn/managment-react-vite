export const Alerts = ({text, type}: { text: string, type: string }) => {
    return (
        <div className={"alert " + type}>{text}</div>
    )
}