import { NextApiRequest, NextApiResponse } from "next"
import { getTasks, postTask, updateTask, deleteTask } from "../../../database/controller"
import connectMongo from "../../../database/conn"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    connectMongo().catch(() => res.status(405).json({ error: 'Error in the Connection' }))

    const { method } = req;

    switch (method) {
        case 'GET':
            getTasks(req, res)
            break;
        case 'POST':
            postTask(req, res)
            break;
        case 'PATCH':
            updateTask(req, res)
            break;
        case 'DELETE':
            deleteTask(req, res)
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
            break;
    }
}
