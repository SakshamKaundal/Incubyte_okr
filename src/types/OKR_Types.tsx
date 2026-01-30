export type KeyResult = {
    id: number;
    description: string;
    progress: string;
};

export type OkrTypes = {
    id: number;
    objective: string;
    isCompleted: boolean;
    keyResults: KeyResult[];
};
