
import {useState} from "react";
import {DeleteConfirmation} from "@/components/DeleteConfirmation";

const Messages = () => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);



    return (
        <>
            <div className={"page-header mb-20"}>
                <h1>Messages</h1>
            </div>

            <div
                style={{
                    maxWidth: "520px",
                    backgroundColor: "var(--white)",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 0 3px rgba(195, 195, 195, 0.75)",
                }}
            >


                <div style={{position: "relative", display: "inline-block"}}>
                    <button
                        className={"btn sm danger rounded bordered"}
                        onClick={() => {
                            setIsConfirmOpen(true);
                        }}
                        aria-expanded={isConfirmOpen}
                        aria-haspopup="dialog"
                    >
                        Delete conversation
                    </button>

                    {isConfirmOpen && (
                        <DeleteConfirmation
                            message={"Are you sure"}
                            onCancel={() => setIsConfirmOpen(false)}
                            onConfirm={() => setIsConfirmOpen(false)}
                        />
                    )}
                </div>


            </div>
        </>
    );
};

export default Messages;
