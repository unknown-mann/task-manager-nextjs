export type TaskType = {
    _id?: string,
    color: string,
    description: string,
    dueDate: string | null,
    isArchived?: boolean,
    isFavorite?: boolean,
    repeatingDays: {
        [key: string]: boolean
    }
};

export interface GenericResponse {
    status: string;
    message: string;
}