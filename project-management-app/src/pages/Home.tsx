import {Badge} from "@/components/Badge";
import {Activity, Check, MessageSquare, UsersRound} from "lucide-react";

const Home = () => {
    return (<>
            <div className={"page-header mb-20"}>
                <h1>Home Page</h1>
            </div>
            <div className="badges-list">
                <Badge title={'Team Members'} icon={<UsersRound size={24}/>} counter={15}
                       footerText={'2 joined this month'}/>

                <Badge title={'Active Tasks'} icon={<Check size={24}/>} counter={24}
                       footerText={'8 due this week'}/>

                <Badge title={'Team Activity'} icon={<Activity size={24}/>} counter={15}
                       footerText={'+12% from last week'}/>

                <Badge title={'Unread Messages'} icon={<MessageSquare size={24}/>} counter={15}
                       footerText={'3 require attention'}/>
            </div>
        </>
    );
};

export default Home;