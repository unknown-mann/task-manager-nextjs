import dayjs from "dayjs";

type RepeatingDays = {
    [key: string]: boolean
};

type DueDate = string | null

type SortType = {
    dueDate: DueDate
};

export const isTaskExpired = (dueDate: DueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

export const isTaskExpiringToday = (dueDate: DueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D');

export const formatTaskDueDate = (dueDate: DueDate) => dueDate ? dayjs(dueDate).format('D MMMM') : '';

export const isTaskRepeating = (repeatingDays: RepeatingDays) => Object.values(repeatingDays).some(Boolean);

export const isTaskActiveToday = (repeatingDays: RepeatingDays) => Object.entries(repeatingDays).filter(day => day[1] && (day[0] === dayjs().format('dd').toLowerCase()));

export const taskRepeatingDays = (repeatingDays: RepeatingDays) => Object.entries(repeatingDays).filter(day => day[1])

const getWeightForNullDate = (dateA: DueDate, dateB: DueDate) => {
    if (dateA === null && dateB === null) {
        return 0;
    }

    if (dateA === null) {
        return 1;
    }

    if (dateB === null) {
        return -1;
    }

    return null;
};

export const sortTaskUp = (taskA: SortType, taskB: SortType) => {
    const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

    return weight ?? dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
};

export const sortTaskDown = (taskA: SortType, taskB: SortType) => {
    const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

    return weight ?? dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
};
