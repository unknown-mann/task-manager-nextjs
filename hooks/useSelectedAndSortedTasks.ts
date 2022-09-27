import { useMemo } from "react";
import { sortTaskUp, sortTaskDown, isTaskExpired, isTaskExpiringToday, isTaskActiveToday, isTaskRepeating } from "../utils";
import { TaskType } from "../types";

const useSortedTasks = (tasks: TaskType[], sortType: string) => {

    const sortedTasks = useMemo(() => {
        if (tasks) {
            switch (sortType) {
                case 'up':
                    return [...tasks].sort(sortTaskUp)
                case 'down':
                    return [...tasks].sort(sortTaskDown)
                default:
                    return tasks
            }
        }
        return tasks
    }, [tasks, sortType])

    return sortedTasks
};

const selectTasks = (tasks: TaskType[], selectedTasksType: string) => {

    switch (selectedTasksType) {
        case 'all':
            return [...tasks].filter(task => task && !task.isArchived)
        case 'overdue':
            return [...tasks].filter(task => isTaskExpired(task.dueDate) && !task.isArchived)
        case 'today':
            return [...tasks].filter(task => (isTaskExpiringToday(task.dueDate) || isTaskActiveToday(task.repeatingDays).length) && !task.isArchived)
        case 'favorites':
            return [...tasks].filter(task => task.isFavorite && !task.isArchived)
        case 'repeating':
            return [...tasks].filter(task => isTaskRepeating(task.repeatingDays) && !task.isArchived)
        case 'archive':
            return [...tasks].filter(task => task.isArchived)
        default:
            return tasks
    }
};

const useSelectedAndSortedTasks = (tasks: TaskType[], selectedTasksType: string, sortType: string) => {

    const sortedTasks = useSortedTasks(tasks, sortType)

    const selectedAndSortedTasks = useMemo(() => {
        return selectTasks(sortedTasks, selectedTasksType)
    }, [sortedTasks, selectedTasksType])

    return selectedAndSortedTasks
};

export default useSelectedAndSortedTasks;