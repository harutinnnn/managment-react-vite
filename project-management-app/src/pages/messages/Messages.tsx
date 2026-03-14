import { Search } from "lucide-react";
import './Messages.css'

const Messages = () => {


    return (
        <>
            <div className={"page-header mb-20"}>
                <h1>Messages</h1>
            </div>

            <div className={"messages-container"}>

                <div className={"message-users"}>
                    <h4>Conversations</h4>

                    <div className={"message-users-search-input input-row relative"}>
                        <Search className="search-icon" size={22} />
                        <input type="text" placeholder="Search users..." />
                    </div>

                </div>

                <div className={"message-conversation"}>

                </div>

            </div>

        </>
    );
};

export default Messages;
