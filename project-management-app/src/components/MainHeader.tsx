import {Bell, BellDot} from "lucide-react";

export const MainHeader = ({minMaxSidebar}: { minMaxSidebar: () => void }) => {


    const handleClick = () => {
        minMaxSidebar()
    }

    return (
        <div className={'main-header'}>

            <div className={"burger sidebar-burger"} onClick={() => handleClick()}>
                <div/>
                <div/>
                <div/>
            </div>


            <div className={"header-notifications"}>
                <Bell/>
                <BellDot style={{display: "none"}}/>
            </div>

        </div>
    )
}