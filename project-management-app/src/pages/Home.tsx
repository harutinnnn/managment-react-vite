import {Badge} from "@/components/Badge";
import {Activity, Check, MessageSquare, UsersRound} from "lucide-react";
import {useEffect, useState} from "react";
import {MemberJoinSkillType} from "@/types/MemberType";
import {getMembers} from "@/api/members.api";
import {AxiosError} from "axios";
import {Alerts} from "@/components/Alerts";
import {AlertEnums} from "@/enums/AlertEnums";
import {getTasksList} from "@/api/board.api";
import {TaskListItem} from "@/types/Task";

const Home = () => {


    const [error, setError] = useState<string | null>(null);

    const [members, setMembers] = useState<MemberJoinSkillType[] | []>([]);
    const [tasks, setTasks] = useState<TaskListItem[] | []>([]);


    useEffect(() => {

        (async () => {


            try {


                const members = await getMembers()
                setMembers(members)

                const tasks = await getTasksList()
                setTasks(tasks)

            } catch (err) {

                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message || "Login failed");
                    setTimeout(() => setError(""), 5000);
                }

            }
        })()
    }, [])

    return (<>
            <div className={"page-header mb-20"}>
                <h1>Home Page</h1>
            </div>

            {error && <Alerts text={error} type={AlertEnums.warning} cb={() => {
                setError(null)
            }}/>}

            <div className="badges-list">
                <Badge title={'Team Members'} icon={<UsersRound size={24}/>} counter={members.length}
                       footerText={'2 joined this month'}/>

                <Badge title={'Active Tasks'} icon={<Check size={24}/>} counter={tasks.length}
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