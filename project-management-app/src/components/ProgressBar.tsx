export const ProgressBar = ({percent, label}: { percent: number, label: string }) => {

    const getProgressColor = (percent: number): string => {

        let color: string = 'red'
        if (percent <= 20) {
            color = 'red'
        } else if (percent > 20 && percent <= 40) {
            color = 'orange'
        } else if (percent > 40 && percent <= 60) {
            color = 'yellow'
        } else if (percent > 60) {
            color = 'green'
        }
        return color
    }

    return (
        <div className="progress-container">
            <h5>{label}<span>({percent}%)</span></h5>
            <div className={"progress " + getProgressColor(percent)}>
                <div className="progress-bar" style={{width: `${percent}%`}}/>
            </div>
        </div>
    )
}