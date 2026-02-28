import {useParams} from "react-router-dom";
import {KanbanBoard} from "@/components/board/KanbanBoard";

export const ProjectKanban = () => {

    const {id} = useParams<{ id: string }>();
    console.log(id);

    return (
        <>
            <KanbanBoard projectId={Number(id)}/>
        </>
    )
}