import React, {useEffect, useState} from 'react';
import {DragDropContext, Droppable, type DropResult} from '@hello-pangea/dnd';
import {AddColumn} from './AddColumn';
import {AddTaskModal} from './AddTaskModal';
import './KanbanBoard.css';
import {KanbanData} from "@/types/KanbanData";
import {Task, TaskAdd} from "@/types/Task";
import {Column} from "@/types/Column";
import {KanbanColumn} from "@/components/board/KanbanColumn";
import {EditTaskModal} from "@/components/board/EditTaskModal";
import {
    addBoardColumn,
    addTask,
    deleteColumn,
    deleteTask,
    editTask,
    getBoardData,
    sortColumns, SortTablePayloadItem,
    sortTasks
} from "@/api/board.api";
import {PageInnerLoader} from "@/components/PageInnerLoder";
import {AxiosError} from "axios";
import {ConfirmPopup} from "@/context/ConfirmPopup";
import {getMembers} from "@/api/members.api";
import {MemberJoinSkillType} from "@/types/MemberType";


interface KanbanBoardProps {
    projectId: number;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({projectId}) => {

    const [members, setMembers] = useState<MemberJoinSkillType[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<KanbanData>();

    const [showAddColumn, setShowAddColumn] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showEditTask, setShowEditTask] = useState(false);
    const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
    const [editingTask, setEditingTask] = useState<{ task: Task; columnId: number } | null>(null);

    useEffect(() => {

        (async () => {
            try {
                const boardData: KanbanData = await getBoardData(projectId)

                boardData.tasks.map(task => {
                    task.createdAt = task.createdAt as Date;
                })

                setData(boardData)

                const members: MemberJoinSkillType[] = await getMembers()
                setMembers(members)


                setLoading(false);


            } catch (err) {
                console.log(err);
            }
        })()

    }, [setData, projectId]);

    const [showPopup, setShowPopup] = useState(false);
    const [deleteColumnId, setDeleteColumnId] = useState<number>(0)
    const cancelDeleteColumnCancelDelete = () => {
        setShowPopup(false)
        setDeleteColumnId(0)
    }


    if (loading) {
        return <PageInnerLoader/>;
    }


    const onDragEnd = async (result: DropResult) => {

        const {destination, source, draggableId: draggableIdString, type} = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === 'column' && data?.columns) {

            const newColumns = Array.from(data.columns);

            const [removedColumn] = newColumns.splice(source.index, 1);

            newColumns.splice(destination.index, 0, removedColumn);


            const columnsResponse = await sortColumns({
                projectId: projectId,
                columns: newColumns.map(col => col.id)
            });

            if ("columns" in columnsResponse) {
                setData({
                    ...data,
                    columns: columnsResponse.columns as Column[]
                });
            }
            return;
        }

        const sourceDroppableId = parseInt(source.droppableId.replace('column-', ''), 10);
        const destinationDroppableId = parseInt(destination.droppableId.replace('column-', ''), 10);
        const draggableTaskId = parseInt(draggableIdString.replace('task-', ''), 10);

        const startColumnIndex = data?.columns.findIndex(col => col.id === sourceDroppableId);
        const finishColumnIndex = data?.columns.findIndex(col => col.id === destinationDroppableId);

        if (typeof startColumnIndex === 'undefined' || startColumnIndex === -1 || typeof finishColumnIndex === 'undefined' || finishColumnIndex === -1) return;


        const startColumn = data?.columns[startColumnIndex];
        const finishColumn = data?.columns[finishColumnIndex];

        if (startColumn?.id === finishColumn?.id && startColumn?.taskIds) {

            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableTaskId);

            const newColumn = {
                ...startColumn,
                taskIds: newTaskIds
            };

            const newColumns = Array.from(data?.columns || []);
            newColumns[startColumnIndex] = newColumn;


            const closTaskIds: SortTablePayloadItem[] = newColumns.map((col: Column) => {
                return {
                    columnId: col.id,
                    taskIds: col.taskIds
                }
            })
            console.log('closTaskIds', closTaskIds)

            await sortTasks({
                projectId: projectId,
                columns: closTaskIds
            });

            setData({
                tasks: data?.tasks || [],
                columns: newColumns
            });
        } else {
            const startTaskIds = Array.from(startColumn?.taskIds || []);
            startTaskIds.splice(source.index, 1);
            const newStartColumn = {
                ...startColumn,
                taskIds: startTaskIds
            };

            const finishTaskIds = Array.from(finishColumn?.taskIds || []);

            finishTaskIds.splice(destination.index, 0, draggableTaskId);
            const newFinishColumn = {
                ...finishColumn,
                taskIds: finishTaskIds
            };

            const newColumns = Array.from(data?.columns || []);

            newColumns[startColumnIndex] = newStartColumn;
            newColumns[finishColumnIndex] = newFinishColumn;

            const closTaskIds: SortTablePayloadItem[] = newColumns.map((col: Column) => {
                return {
                    columnId: col.id,
                    taskIds: col.taskIds
                }
            })
            console.log('closTaskIds', closTaskIds)

            const {draggableId} = result;

            const taskId = draggableId.split('task-')[1];

            await sortTasks({
                draggedTaskId: Number(taskId),
                projectId: projectId,
                columns: closTaskIds
            });


            setData({
                tasks: data?.tasks || [],
                columns: newColumns
            });
        }
    };

    const handleAddColumn = async (title: string) => {

        try {

            const boardColumnResponse = await addBoardColumn(
                {
                    title,
                    projectId
                }
            )
            if ("id" in boardColumnResponse) {

                const newColumnId = boardColumnResponse.id;

                const newColumn: Column = {
                    id: newColumnId,
                    title,
                    pos: boardColumnResponse.pos,
                    taskIds: [],
                };

                setData({
                    tasks: data?.tasks || [],
                    columns: [...data?.columns || [], newColumn]
                });
                setShowAddColumn(false);
            }

        } catch (err) {

            console.error(err);
        }

    };

    const handleAddTask = async (taskData: TaskAdd) => {
        if (!selectedColumn) return;


        //TODO add task in column
        const taskResponse = await addTask(
            {
                projectId: taskData.projectId,
                columnId: taskData.columnId,
                title: taskData.title,
            }
        );

        if ('id' in taskResponse) {
            const newTaskId = taskResponse.id;


            const newTask: TaskAdd = {
                ...taskData,
                id: newTaskId,
            };
            const columnIndex = data?.columns.findIndex(col => col.id === selectedColumn);

            if (typeof columnIndex === 'undefined' || columnIndex === -1) return;

            const column = data?.columns[columnIndex];
            const updatedColumn = {
                ...column,
                taskIds: [...column?.taskIds || [], newTaskId]
            };

            const newColumns = Array.from(data?.columns || []);


            newColumns[columnIndex] = updatedColumn;


            setData({
                ...data,
                // tasks: [...data?.tasks || [], newTask],
                // TODO problem on new task because type structure another newTask
                tasks: [...data?.tasks || []],
                columns: newColumns
            });
            setShowAddTask(false);
            setSelectedColumn(null);
        }
    };

    const handleEditTask = (taskId: number, columnId: number) => {
        const task = data?.tasks.find(t => t.id === taskId);
        if (task) {
            setEditingTask({task, columnId});
            setShowEditTask(true);
        }
    };

    const handleUpdateTask = async (updatedTask: Task) => {

        try {

            await editTask(updatedTask)

            if (!editingTask) return;

            if (data?.tasks) {

                setData({
                    ...data,
                    tasks: data?.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
                });
            }

            setShowEditTask(false);
            setEditingTask(null);

        } catch (err) {

            if (err instanceof AxiosError) {
                console.error(err.response?.data?.message);
            } else if (err instanceof Error) {
                console.error(err.message);
            }
        }
    };

    const handleDeleteTask = async (taskId: number, columnId: number) => {

        try {


            await deleteTask(taskId, columnId);

            const columnIndex = data?.columns.findIndex(col => col.id === columnId);

            if (typeof columnIndex === 'undefined' || columnIndex === -1) return;

            const column = data?.columns[columnIndex];
            const updatedTaskIds = column?.taskIds.filter(id => id !== taskId);

            const updatedColumn = {
                ...column,
                taskIds: updatedTaskIds
            };

            const updatedTasks = data?.tasks.filter(t => t.id !== taskId);

            const newColumns = Array.from(data?.columns || []);
            newColumns[columnIndex] = updatedColumn;

            if (updatedTasks && newColumns) {

                setData({
                    ...data,
                    tasks: updatedTasks,
                    columns: newColumns
                });
            }
            setShowEditTask(false);

        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response?.data?.message);
            } else if (err instanceof Error) {
                console.error(err.message);
            }
        }
    };

    const confirmDeleteColumn = async (columnId: number) => {
        setDeleteColumnId(columnId);
        setShowPopup(true);
    }
    const handleDeleteColumn = async (columnId: number) => {


        try {

            await deleteColumn(columnId, projectId)

            const column = data?.columns.find(col => col.id === columnId);
            if (!column) return;

            const updatedTasks = data?.tasks.filter(t => !column.taskIds.includes(t.id));
            const updatedColumns = data?.columns.filter(col => col.id !== columnId);

            if (updatedTasks && updatedColumns) {

                setData({
                    ...data,
                    tasks: updatedTasks,
                    columns: updatedColumns
                });
            }

            setDeleteColumnId(0);
            setShowPopup(false);

        } catch (err) {
            if (err instanceof AxiosError) {
                console.error(err.response?.data?.message);
            } else if (err instanceof Error) {
                console.error(err.message);
            }
        }
    };

    return (
        <div className="kanban-board">
            <header className="kanban-header">
                <h1>Kanban Board</h1>
                <button
                    className="add-column-btn"
                    onClick={() => setShowAddColumn(true)}
                >
                    + Add Column
                </button>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                    droppableId="all-columns"
                    direction="horizontal"
                    type="column"
                >
                    {(provided) => (
                        <div
                            className="kanban-container"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {data?.columns.sort((a, b) => a.pos - b.pos).map((column, index) => {
                                const tasks: Task[] = column.taskIds.map(taskId => data.tasks.find(t => t.id === taskId)!).filter(Boolean);

                                return (
                                    <KanbanColumn
                                        key={`column-${column.id}`}
                                        column={column}
                                        tasks={tasks}
                                        index={index}
                                        onAddTask={() => {
                                            setSelectedColumn(column.id);
                                            setShowAddTask(true);
                                        }}
                                        onEditTask={handleEditTask}
                                        onDeleteColumn={() => confirmDeleteColumn(column.id)}
                                    />
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {showAddColumn && (
                <AddColumn
                    onClose={() => setShowAddColumn(false)}
                    onAdd={handleAddColumn}
                    projectId={Number(projectId)}
                />
            )}

            {showAddTask && selectedColumn && (
                <AddTaskModal
                    onClose={() => {
                        setShowAddTask(false);
                        setSelectedColumn(null);
                    }}
                    onAdd={handleAddTask}
                    projectId={Number(projectId)}
                    columnId={selectedColumn}
                    members={members}

                />
            )}

            {showEditTask && editingTask && (
                <EditTaskModal
                    task={editingTask.task}
                    onClose={() => {
                        setShowEditTask(false);
                        setEditingTask(null);
                    }}
                    onUpdate={handleUpdateTask}
                    members={members}
                    onDeleteTask={(taskId, columnId) => handleDeleteTask(taskId, columnId)}
                />
            )}

            {showPopup && (
                <ConfirmPopup
                    message="Are you sure you want to delete this item?"
                    onConfirm={async () => {
                        await handleDeleteColumn(deleteColumnId)
                    }}
                    onCancel={cancelDeleteColumnCancelDelete}
                />
            )}
        </div>
    );
};