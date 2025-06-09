import mongoose, { Schema, model } from "mongoose";
import type { User as IUser } from '../types';
import bcrypt from "bcryptjs";

interface UserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema({
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    }
});

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address',
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is requ  ired'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    address: [addressSchema],
    ip: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// pre('save'): Tells Mongoose to run this function before calling .save() on a user.
// function(next): You’re defining a middleware (pre-save hook) using a function that takes next to move forward after processing.
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IUser & Document>("User",userSchema);
