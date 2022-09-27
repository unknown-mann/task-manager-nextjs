import { NextApiRequest, NextApiResponse } from "next"
import Tasks from "../model/tasks"

export async function getTasks(req: NextApiRequest, res: NextApiResponse) {
    try {
        const tasks = await Tasks.find({})

        if (!tasks) {
            res.status(404).json({ error: 'Data not found' })
        }
        res.status(200).json(tasks)
    } catch (error) {
        res.status(404).json({ error: 'Error while fetching data' })
    }
}

export async function postTask(req: NextApiRequest, res: NextApiResponse) {
    try {
        const formData = req.body
        if (!formData) {
            res.status(404).json({ error: 'Form data not provided' })
        }
        Tasks.create(formData, function (err: any, data: any) {
            res.status(200).json(data)
        })
    } catch (error) {
        res.status(404).json({ error: 'Error while creating the task' })
    }
}

export async function updateTask(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { taskId } = req.query
        const formData = req.body

        if (taskId && formData) {
            const task = await Tasks.findByIdAndUpdate(taskId, formData)
            res.status(200).json(task)
        }
        res.status(404).json({ error: 'Task not selected' })
    } catch (error) {
        res.status(404).json({ error: 'Error while updating the task' })
    }
}

export async function deleteTask(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { taskId } = req.query

        if (taskId) {
            const task = await Tasks.findByIdAndDelete(taskId)
            res.status(200).json({ deleted: task })
        }
        res.status(404).json({ error: 'Task not selected' })
    } catch (error) {
        res.status(404).json({ error: 'Error while deleting the task' })
    }
}