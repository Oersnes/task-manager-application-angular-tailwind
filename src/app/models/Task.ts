export type TaskId = string;

export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export type Task = {
    id: TaskId;
    name: string;
    description?: string;
    status: TaskStatus;
    readonly creationDate: Date;
};

export type NewTask = Pick<Task, 'name' | 'description'>;

export type UpdatedTask = Partial<Omit<Task, 'id' | 'creationDate'>>;
