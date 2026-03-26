import './LightBox.css'
import {X} from "lucide-react";

export const LightBox = ({imgUrl, cb}: { imgUrl: string, cb: () => void }) => {


    return (
        <div className="lightbox-container">
            <X size={32} className="close-lightbox" onClick={() => cb()}/>
            <div className="lightbox-image-container">
                <img src={imgUrl} alt=""/>
            </div>
        </div>
    )

}