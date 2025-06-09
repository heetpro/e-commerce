import mongoose, { Schema, Document } from "mongoose";
import type { Product as IProduct } from "../types";


const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const productSchema = new Schema<IProduct & Document>({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Product description cannot be more than 500 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price must be greater than 0'],
    },
    category: { 
        type: String, 
        required: [true, 'Product category is required'],
        trim: true
    },
    brand: { 
        type: String, 
        required: [true, 'Product brand is required'],
        trim: true
    },
    stock: { 
        type: Number, 
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    images: [{ 
        type: String,
        validate: {
            validator: function(v: string[]) {
                return v.length > 0;
            },
            message: 'At least one image is required'
        }
    }],
    ratings: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0, min: 0 }
    },
    reviews: [ReviewSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});