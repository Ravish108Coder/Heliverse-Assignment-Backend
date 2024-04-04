import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'first name is required!']
    },
    last_name: {
        type: String,
        required: [true, 'last name is required!']
    },
    email:{
        type: String, 
        unique: true,
        required: [true, 'email is required!']
    },
    gender:{
        type: String,
        required: [true, 'gender is required'],
        enum: ['Male', 'Female']
    },
    avatar: {
        type: String,
    },
    domain:{
        type: String,
        required: [true, 'domain is required!'],
        enum: ["Finance", "Marketing", "Sales", "UI Designing", "Management", "IT", "Business Development"]
    },
    available: {
        type: Boolean,
        requied: [true, 'available is required!']
    }
})

export const User = mongoose.model('users', UserSchema)