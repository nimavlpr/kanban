'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useBoardStore } from '@/store/useBoardStore';
import { List } from './List';
import { InlineEdit } from './InlineEdit';
import { TaskModal } from './TaskModal';

export const Board: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);

    const boardData = useBoardStore((state) => state.board);

    const moveColumn = useBoardStore((state) => state.moveColumn);
    const moveTask = useBoardStore((state) => state.moveTask);
    const updateBoardTitle = useBoardStore((state) => state.updateBoardTitle);
    const addList = useBoardStore((state) => state.addList);

    const [isAddingList, setIsAddingList] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !boardData) {
        return <div style={{ color: 'white', padding: 20 }}>Loading Kanban Board...</div>;
    }

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === 'column') {
            moveColumn(source.index, destination.index);
            return;
        }

        moveTask(source.droppableId, destination.droppableId, source.index, destination.index);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="board-container">
                <div className="board-header">
                    <div>
                        <InlineEdit
                            text={boardData.boardTitle}
                            onSave={updateBoardTitle}
                            autoSave={true}
                            className="board-title-input"
                        />
                    </div>
                </div>

                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {(provided) => (
                        <div
                            className="board-canvas"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {boardData.columnOrder.map((columnId, index) => {
                                const column = boardData.columns[columnId];
                                if (!column) return null;

                                const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

                                return <List key={column.id} column={column} tasks={tasks} index={index} />;
                            })}
                            {provided.placeholder}

                            <div className="list-wrapper">
                                {isAddingList ? (
                                    <div className="adding-list">
                                        <InlineEdit
                                            text=""
                                            onSave={(title) => {
                                                addList(title);
                                                setIsAddingList(false);
                                            }}
                                            editing={true}
                                            setEditing={setIsAddingList}
                                            placeholder="Enter list title..."
                                            buttonText="Add List"
                                        />
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAddingList(true)}
                                        className="add-list"
                                    >
                                        + Add another list
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
            <TaskModal />
        </DragDropContext>
    );
};