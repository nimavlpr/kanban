import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BoardData, Column, Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_DATA: BoardData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Create Kanban', comments: [] },
        'task-2': { id: 'task-2', content: 'Review Drag & Drop', comments: [] },
        'task-3': { id: 'task-3', content: 'Set up Next.js project', comments: [] },
    },
    columns: {
        'col-1': { id: 'col-1', title: 'Todo', taskIds: ['task-1', 'task-2'] },
        'col-2': { id: 'col-2', title: 'In Progress', taskIds: ['task-3'] },
        'col-3': { id: 'col-3', title: 'Done', taskIds: [] },
    },
    columnOrder: ['col-1', 'col-2', 'col-3'],
    boardTitle: 'Demo Board'
};

interface BoardState {
    board: BoardData;
    setBoard: (board: BoardData) => void;
    moveColumn: (sourceIndex: number, destIndex: number) => void;
    moveTask: (sourceColId: string, destColId: string, sourceIndex: number, destIndex: number) => void;
    updateBoardTitle: (title: string) => void;
    addList: (title: string) => void;
    updateListTitle: (listId: string, title: string) => void;
    deleteList: (listId: string) => void;
    clearList: (listId: string) => void;
    addTask: (listId: string, content: string) => void;
    updateTaskTitle: (taskId: string, content: string) => void;
    activeTaskId: string | null;
    setActiveTask: (id: string | null) => void;
    addComment: (taskId: string, text: string) => void;
}

export const useBoardStore = create<BoardState>()(
    persist(
        (set) => ({
            board: INITIAL_DATA,

            setBoard: (newBoard) => set({ board: newBoard }),

            moveColumn: (sourceIndex, destIndex) =>
                set((state) => {
                    const newColumnOrder = Array.from(state.board.columnOrder);
                    const [removed] = newColumnOrder.splice(sourceIndex, 1);
                    newColumnOrder.splice(destIndex, 0, removed);

                    return {
                        board: { ...state.board, columnOrder: newColumnOrder }
                    };
                }),

            moveTask: (sourceColId, destColId, sourceIndex, destIndex) =>
                set((state) => {
                    const sourceCol = state.board.columns[sourceColId];
                    const destCol = state.board.columns[destColId];

                    const newSourceTaskIds = Array.from(sourceCol.taskIds);
                    const newDestTaskIds = sourceCol === destCol
                        ? newSourceTaskIds
                        : Array.from(destCol.taskIds);

                    const [movedTaskId] = newSourceTaskIds.splice(sourceIndex, 1);

                    if (sourceCol === destCol) {
                        newSourceTaskIds.splice(destIndex, 0, movedTaskId);
                    } else {
                        newDestTaskIds.splice(destIndex, 0, movedTaskId);
                    }

                    return {
                        board: {
                            ...state.board,
                            columns: {
                                ...state.board.columns,
                                [sourceColId]: { ...sourceCol, taskIds: newSourceTaskIds },
                                [destColId]: { ...destCol, taskIds: newDestTaskIds },
                            },
                        },
                    };
                }),

            updateBoardTitle: (title) =>
                set((state) => ({
                    board: { ...state.board, boardTitle: title },
                })),

            addList: (title) =>
                set((state) => {
                    const newId = `col-${uuidv4()}`;
                    const newColumn: Column = { id: newId, title, taskIds: [] };
                    return {
                        board: {
                            ...state.board,
                            columns: { ...state.board.columns, [newId]: newColumn },
                            columnOrder: [...state.board.columnOrder, newId],
                        },
                    };
                }),

            updateListTitle: (listId, title) =>
                set((state) => ({
                    board: {
                        ...state.board,
                        columns: {
                            ...state.board.columns,
                            [listId]: { ...state.board.columns[listId], title },
                        },
                    },
                })),

            deleteList: (listId) =>
                set((state) => {
                    const newColumns = { ...state.board.columns };
                    delete newColumns[listId];
                    const newColumnOrder = state.board.columnOrder.filter((id) => id !== listId);
                    return {
                        board: {
                            ...state.board,
                            columns: newColumns,
                            columnOrder: newColumnOrder,
                        },
                    };
                }),

            clearList: (listId) =>
                set((state) => {
                    const column = state.board.columns[listId];
                    const newTasks = { ...state.board.tasks };
                    column.taskIds.forEach((taskId) => {
                        delete newTasks[taskId];
                    });

                    return {
                        board: {
                            ...state.board,
                            tasks: newTasks,
                            columns: {
                                ...state.board.columns,
                                [listId]: { ...column, taskIds: [] },
                            },
                        },
                    };
                }),

            addTask: (listId, content) =>
                set((state) => {
                    const newTaskId = `task-${uuidv4()}`;
                    const newTask: Task = { id: newTaskId, content, comments: [] };
                    const column = state.board.columns[listId];

                    return {
                        board: {
                            ...state.board,
                            tasks: { ...state.board.tasks, [newTaskId]: newTask },
                            columns: {
                                ...state.board.columns,
                                [listId]: { ...column, taskIds: [...column.taskIds, newTaskId] },
                            },
                        },
                    };
                }),

            updateTaskTitle: (taskId, content) =>
                set((state) => ({
                    board: {
                        ...state.board,
                        tasks: {
                            ...state.board.tasks,
                            [taskId]: { ...state.board.tasks[taskId], content }
                        }
                    }
                })),

            activeTaskId: null,

            setActiveTask: (id) => set({ activeTaskId: id }),

            addComment: (taskId, text) =>
                set((state) => {
                    const newComment = {
                        id: uuidv4(),
                        text,
                        createdAt: Date.now(),
                    };

                    const task = state.board.tasks[taskId];
                    return {
                        board: {
                            ...state.board,
                            tasks: {
                                ...state.board.tasks,
                                [taskId]: {
                                    ...task,
                                    comments: [newComment, ...task.comments],
                                },
                            },
                        },
                    };
                }),
        }),
        {
            name: 'kanban-storage',
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        }
    )
);
