import axios from "axios"
import { BASE_URL } from "../utils/const"
import { GenericResponse, TaskType } from "../types"

export const getTasks = async () => {
    const response = await axios.get<TaskType[]>(`${BASE_URL}/api/tasks`)
    return response.data
}

export const addTask = async (data: TaskType) => {
    const response = await axios.post<TaskType>(`${BASE_URL}/api/tasks`, data)
    return response.data
}

export const deleteTask = async (taskId: string) => {
    const response = await axios.delete<GenericResponse>(`${BASE_URL}/api/tasks/?taskId=${taskId}`)
    return response.data
}

export const updateTask = async ({ taskId, data }: { taskId: string, data: any }) => {
    const response = await axios.patch<TaskType>(`${BASE_URL}/api/tasks/?taskId=${taskId}`, data)
    return response.data
}