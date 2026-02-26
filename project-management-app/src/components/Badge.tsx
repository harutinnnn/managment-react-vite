import {ReactNode} from "react";

export const Badge = (
    {
        title,
        icon,
        counter,
        footerText
    }:
    {
        title: string,
        icon: ReactNode,
        counter: number,
        footerText: string,
    }) => {


    return (
        <div className="badge-item">
            <div className="badge-header">
                <div className="badge-title">
                    {title}
                </div>
                <div className="badge-icon">
                    {icon}
                </div>
            </div>

            <div className="badge-info">

                <div className="badge-counter">
                    {counter}
                </div>

            </div>
            <div className="badge-footer">
                {footerText}
            </div>

        </div>
    )
}