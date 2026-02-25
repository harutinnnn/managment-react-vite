import React from "react";

type ConfirmPopupProps = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({message, onConfirm, onCancel}) => {
    return (
        <div
            className={"popup-frez"}
            onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains("popup-frez")) {
                    onCancel()
                }
            }}
        >
            <div className="popup-inner"
                 style={{backgroundColor: "white", padding: "20px", borderRadius: "8px", minWidth: "300px"}}>
                <p className="popup-message">{message}</p>
                <div style={{display: "flex", justifyContent: "flex-end", gap: "10px"}}>
                    <button className="btn sm danger" onClick={onCancel}>Cancel</button>
                    <button className="btn sm primary" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};