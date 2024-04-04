import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required!']
    },
    members: {
        type: Array,
        required: [true, 'members is required!']
    },
    description: {
        type: String,
        required: [true, 'description is required!']
    },
})

export const Team = mongoose.model('teams', TeamSchema)