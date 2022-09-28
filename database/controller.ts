import { NextApiRequest, NextApiResponse } from "next"
import Tasks from "../model/tasks"

export async function getTasks(req: NextApiRequest, res: NextApiResponse) {
    try {
        const tasks = await Tasks.find({})

        if (!tasks) {
            return res.status(404).json({ error: 'Data not found' })
        }
        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(404).json({ error: 'Error while fetching data' })
    }
}

export async function postTask(req: NextApiRequest, res: NextApiResponse) {
    try {
        const formData = req.body
        if (!formData) {
            return res.status(404).json({ error: 'Form data not provided' })
        }
        Tasks.create(formData, function (err: any, data: any) {
            return res.status(200).json(data)
        })
    } catch (error) {
        return res.status(404).json({ error: 'Error while creating the task' })
    }
}

export async function updateTask(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { taskId } = req.query
        const formData = req.body

        if (taskId && formData) {
            const task = await Tasks.findByIdAndUpdate(taskId, formData)
            return res.status(200).json(task)
        }
       return res.status(404).json({ error: 'Task not selected' })
    } catch (error) {
        return res.status(404).json({ error: 'Error while updating the task' })
    }
}

export async function deleteTask(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { taskId } = req.query

        if (taskId) {
            const task = await Tasks.findByIdAndDelete(taskId)
            return res.status(200).json({ deleted: task })
        }
        return res.status(404).json({ error: 'Task not selected' })
    } catch (error) {
        return res.status(404).json({ error: 'Error while deleting the task' })
    }
}
