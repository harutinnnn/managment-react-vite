// components/KanbanBoard.tsx
import React, {useEffect, useState} from 'react';
import {DragDropContext, Droppable, type DropResult} from '@hello-pangea/dnd';
import {AddColumn} from './AddColumn';
import {AddTaskModal} from './AddTaskModal';
import './KanbanBoard.css';
import {KanbanData} from "@/types/KanbanData";
import {Task} from "@/types/Task";
import {Column} from "@/types/Column";
import {KanbanColumn} from "@/components/board/KanbanColumn";
import {EditTaskModal} from "@/components/board/EditTaskModal";
import {addBoardColumn, addTask, getBoardData, sortColumns} from "@/api/board.api";
import {PageInnerLoader} from "@/components/PageInnerLoder";


interface KanbanBoardProps {
    projectId: number;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({projectId}) => {

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

                console.log('boardData', boardData)
                setData(boardData)
                console.log(boardData);
                setLoading(false);


            } catch (err) {
                console.log(err);

            }
        })()

        // localStorage.setItem('kanban-data-v2', JSON.stringify(data));
    }, [setData]);


    if (loading) {
        return <PageInnerLoader/>;
    }


    const onDragEnd = (result: DropResult) => {

        const {destination, source, draggableId: draggableIdString, type} = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === 'column') {
            const newColumns = Array.from(data.columns);

            const [removedColumn] = newColumns.splice(source.index, 1);

            newColumns.splice(destination.index, 0, removedColumn);

            console.log('newColumns', newColumns.map(col => col.id));

            sortColumns({
                projectId: projectId,
                columns: newColumns.map(col => col.id)
            });

            setData({
                ...data,
                columns: newColumns
            });
            return;
        }

        const sourceDroppableId = parseInt(source.droppableId.replace('column-', ''), 10);
        const destinationDroppableId = parseInt(destination.droppableId.replace('column-', ''), 10);
        const draggableTaskId = parseInt(draggableIdString.replace('task-', ''), 10);

        const startColumnIndex = data.columns.findIndex(col => col.id === sourceDroppableId);
        const finishColumnIndex = data.columns.findIndex(col => col.id === destinationDroppableId);

        if (startColumnIndex === -1 || finishColumnIndex === -1) return;

        const startColumn = data.columns[startColumnIndex];
        const finishColumn = data.columns[finishColumnIndex];

        if (startColumn.id === finishColumn.id) {
            const newTaskIds = Array.from(startColumn.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableTaskId);

            const newColumn = {
                ...startColumn,
                taskIds: newTaskIds
            };

            const newColumns = Array.from(data.columns);
            newColumns[startColumnIndex] = newColumn;

            setData({
                ...data,
                columns: newColumns
            });
        } else {
            const startTaskIds = Array.from(startColumn.taskIds);
            startTaskIds.splice(source.index, 1);
            const newStartColumn = {
                ...startColumn,
                taskIds: startTaskIds
            };

            const finishTaskIds = Array.from(finishColumn.taskIds);
            finishTaskIds.splice(destination.index, 0, draggableTaskId);
            const newFinishColumn = {
                ...finishColumn,
                taskIds: finishTaskIds
            };

            const newColumns = Array.from(data.columns);
            newColumns[startColumnIndex] = newStartColumn;
            newColumns[finishColumnIndex] = newFinishColumn;

            setData({
                ...data,
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
                    taskIds: []
                };


                console.log(boardColumnResponse);

                setData({
                    ...data,
                    columns: [...data.columns, newColumn]
                });
                setShowAddColumn(false);
            }

        } catch (err) {

            console.error(err);
        }

    };

    const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        if (!selectedColumn) return;

        const newTaskId = Date.now();
        const newTask: Task = {
            ...taskData,
            id: newTaskId,
            createdAt: new Date()
        };

        //TODO add task in column
        const taskResponse = await addTask(
            {
                projectId: taskData.projectId,
                columnId: taskData.columnId,
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                // assignee: taskData.assignee,
                // dueDate: taskData.dueDate,
                tags: taskData.tags,
            }
        );

        console.log(taskResponse)

        const columnIndex = data.columns.findIndex(col => col.id === selectedColumn);
        if (columnIndex === -1) return;

        const column = data.columns[columnIndex];
        const updatedColumn = {
            ...column,
            taskIds: [...column.taskIds, newTaskId]
        };

        const newColumns = Array.from(data.columns);
        newColumns[columnIndex] = updatedColumn;

        setData({
            ...data,
            tasks: [...data.tasks, newTask],
            columns: newColumns
        });
        setShowAddTask(false);
        setSelectedColumn(null);
    };

    const handleEditTask = (taskId: number, columnId: number) => {
        const task = data.tasks.find(t => t.id === taskId);
        if (task) {
            setEditingTask({task, columnId});
            setShowEditTask(true);
        }
    };

    const handleUpdateTask = (updatedTask: Task) => {
        if (!editingTask) return;

        setData({
            ...data,
            tasks: data.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        });

        setShowEditTask(false);
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId: number, columnId: number) => {
        const columnIndex = data.columns.findIndex(col => col.id === columnId);
        if (columnIndex === -1) return;

        const column = data.columns[columnIndex];
        const updatedTaskIds = column.taskIds.filter(id => id !== taskId);

        const updatedColumn = {
            ...column,
            taskIds: updatedTaskIds
        };

        const updatedTasks = data.tasks.filter(t => t.id !== taskId);

        const newColumns = Array.from(data.columns);
        newColumns[columnIndex] = updatedColumn;

        setData({
            ...data,
            tasks: updatedTasks,
            columns: newColumns
        });
    };

    const handleDeleteColumn = (columnId: number) => {
        const column = data.columns.find(col => col.id === columnId);
        if (!column) return;

        const updatedTasks = data.tasks.filter(t => !column.taskIds.includes(t.id));
        const updatedColumns = data.columns.filter(col => col.id !== columnId);

        setData({
            ...data,
            tasks: updatedTasks,
            columns: updatedColumns
        });
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
                            {data.columns.sort((a, b) => a.pos - b.pos).map((column, index) => {
                                const tasks = column.taskIds.map(taskId => data.tasks.find(t => t.id === taskId)!).filter(Boolean);

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
                                        onDeleteTask={(taskId) => handleDeleteTask(taskId, column.id)}
                                        onDeleteColumn={() => handleDeleteColumn(column.id)}
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
                />
            )}
        </div>
    );
};