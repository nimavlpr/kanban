export interface Comment {
    id: string;
    text: string;
    createdAt: number;
}

export interface Task {
    id: string;
    content: string;
    comments: Comment[];
}

export interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

export interface BoardData {
    tasks: { [key: string]: Task };
    columns: { [key: string]: Column };
    columnOrder: string[];
    boardTitle: string;
}