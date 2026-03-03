import {TaskListItem} from "@/types/Task";
import {useEffect, useState} from "react";
import {getTasksList} from "@/api/board.api";
import './Tasks.css'
import {formatDate} from "@/helpers/date.heper";

const Tasks = () => {

    const [tasks, setTasks] = useState<TaskListItem[]>([]);


    const getTasks = async (): Promise<void> => {

        try {
            const tasks = await getTasksList()
            setTasks(tasks)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {

        (async () => {
            await getTasks()
        })()

    }, [setTasks]);




    return (<>
            <div className={"page-header mb-20"}>
                <h1>Tasks Page</h1>
            </div>

            <div className="tasks-list">

                {tasks.map((task: TaskListItem) => (
                    <div key={task.id} className="task-item">
                        <h3 className="task-title">{task.title}</h3>
                        <div className="task-project">Project: {task.projectTitle}</div>
                        <div className="task-column">Column: {task.columnTitle}</div>
                        <div className="task-members">Members: {(task?.members || "").trim().split(',').map(member => (
                            <div className={"task-member-item"} key={member}>
                                <span>{member}</span>
                            </div>
                        ))}</div>

                        <div className="task-created-at">{formatDate(task.createdAt)}</div>
                    </div>
                ))}

            </div>
        </>
    );
};

export default Tasks;