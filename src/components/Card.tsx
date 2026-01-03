import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '@/types';
import { useBoardStore } from '@/store/useBoardStore';

interface CardProps {
    task: Task;
    index: number;
}

export const Card: React.FC<CardProps> = ({ task, index }) => {
    const setActiveTask = useBoardStore((state) => state.setActiveTask);

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className="card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                    }}
                >
                    <div className="card-content">
                        {task.content}
                    </div>

                    <div
                         className="card-comments"
                         title="Comments"
                    >
                        <div
                            onClick={() => setActiveTask(task.id)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            <span className="">Comments</span>
                            <span>({task.comments.length})</span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};