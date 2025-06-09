import mongoose, { Schema, Document } from "mongoose";
import type { Address, OrderItem, Order as IOrder } from "../types";

const AddressSchema = new Schema<Address>({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
})


const OrderItemSchema = new Schema<OrderItem>({
    product: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    name: { type: String, required: true },
    quantity: { 
        type: Number, 
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: { 
        type: Number, 
        required: true,
        min: [0, 'Price cannot be negative']
    }
});


const OrderSchema = new Schema<IOrder & Document>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: { 
        type: [OrderItemSchema], 
        required: true,
        validate: {
            validator: function(v: OrderItem[]) {
                return v.length > 0;
            },
            message: 'Order must have at least one item'
        }
    },
    totalAmount: { 
        type: Number, 
        required: true,
        min: [0, 'Total amount cannot be negative']
    },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: { 
        type: AddressSchema, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
        required: true
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderDate: { type: Date, default: Date.now },
    trackingUrl: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


export const OrderModel = mongoose.model<Order & Document>("Order", OrderSchema);