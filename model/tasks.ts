import { Schema, models, model } from "mongoose";

const tasksSchema = new Schema({
    color: String,
    description: String,
    dueDate: String,
    isArchived: Boolean,
    isFavorite: Boolean,
    repeatingDays: {
        mo: Boolean,
        tu: Boolean,
        we: Boolean,
        th: Boolean,
        fr: Boolean,
        sa: Boolean,
        su: Boolean
    }
})

const Tasks = models.task || model('task', tasksSchema)
export default Tasks