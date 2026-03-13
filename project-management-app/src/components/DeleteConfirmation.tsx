import React from "react";

type DeleteConfirmationProps = {
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
    message = "Are you sure you want to delete?",
    onConfirm,
    onCancel,
}) => {
    return (
        <div
            role="dialog"
            aria-label="Confirm delete"
            style={{
                position: "absolute",
                top: "110%",
                left: 0,
                zIndex: 10,
                backgroundColor: "var(--white)",
                border: "1px solid var(--light-gray)",
                borderRadius: "10px",
                padding: "12px",
                minWidth: "260px",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
            }}
        >
            <div style={{fontSize: "14px", marginBottom: "10px"}}>
                {message}
            </div>
            <div style={{display: "flex", justifyContent: "flex-end", gap: "8px"}}>
                <button className={"btn sm rounded bordered"} onClick={onCancel}>
                    Cancel
                </button>
                <button className={"btn sm danger rounded bordered"} onClick={onConfirm}>
                    Delete
                </button>
            </div>
        </div>
    );
};
