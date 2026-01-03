import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Column, Task } from '@/types';
import { Card } from './Card';
import { useBoardStore } from '@/store/useBoardStore';
import { InlineEdit } from './InlineEdit';
import { ListMenu } from './ListMenu';

interface ListProps {
    column: Column;
    tasks: Task[];
    index: number;
}

export const List: React.FC<ListProps> = ({ column, tasks, index }) => {
    const [isAddingCard, setIsAddingCard] = useState(false);

    const updateListTitle = useBoardStore((state) => state.updateListTitle);
    const deleteList = useBoardStore((state) => state.deleteList);
    const addTask = useBoardStore((state) => state.addTask);

    const handleAddCard = (text: string) => {
        addTask(column.id, text);
        setIsAddingCard(true);
    };

    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided) => (
                <div
                    className="list-wrapper"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                >
                    <div className="list">
                        <div className="list-header" style={{ cursor: 'grab' }} {...provided.dragHandleProps}>
                            <div style={{ flexGrow: 1, marginRight: 5 }}>
                                <InlineEdit
                                    text={column.title}
                                    onSave={(newTitle) => updateListTitle(column.id, newTitle)}
                                    autoSave={true}
                                    className="list-title-edit"
                                />
                            </div>

                            <ListMenu listId={column.id} />
                        </div>

                        <Droppable droppableId={column.id} type="task">
                            {(provided, snapshot) => (
                                <div
                                    className="list-cards"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        backgroundColor: snapshot.isDraggingOver ? '#e2e4e9' : 'inherit',
                                        minHeight: 10
                                    }}
                                >
                                    {tasks.map((task, index) => (
                                        <Card key={task.id} task={task} index={index} />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        <div className="list-footer">
                            {isAddingCard ? (
                                <InlineEdit
                                    text=""
                                    onSave={handleAddCard}
                                    editing={true}
                                    setEditing={setIsAddingCard}
                                    isTextArea={true}
                                    placeholder="Enter a title for this card..."
                                    buttonText="Add Card"
                                />
                            ) : (
                                <div onClick={() => setIsAddingCard(true)} style={{ width: '100%' }}>
                                    + Add another card
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};