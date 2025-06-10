import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { ProductModel } from "../models/Product";
import { OrderModel } from "../models/Order";



export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = (req as any).user._id;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await ProductModel.findById(item.product);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        if (product.stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock for product: ${product.name}`
            });
        }

        const orderItem = {
            product: product._id,
            name: product.name,
            quantity: item.quantity,
            price: product.price,
            // status: 'processing'
        };
        orderItems.push(orderItem);

        totalAmount += product.price * item.quantity;
    }


    const order = await OrderModel.create({
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentMethod,
        orderDate: new Date(),
        // status: 'ready to ship'
    });

    for (const item of items) {
        await ProductModel.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } }
        );
    }


    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order }
    });
});


export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const orders = await OrderModel.find({ user: userId })
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { orders }
    });
})

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name images');


    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }
    const user = (req as any).user;

    if (order.user.toString() !== user._id.toString() && user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }
      
    res.json({
        success: true,
        data: { order }
    });
    
    
})


const updateOrderStatus = asyncHandler(async (req: Request, res:Response) => {
    const { status, trackingUrl } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
        req.params.id,
        {
            status,
            trackingUrl : trackingUrl || '',
            updatedAt: new Date()
        },
        { new: true }
    )

    if(!order) {
        return res.status(404).json({
            success: false,
            message: 'Order not found'
        });
    }

    res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order }
    })
});



export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;


    const orders = await OrderModel.find()
    .populate('user', 'name email')
    .populate('items.product', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await OrderModel.countDocuments();

    res.json({
        success: true,
        data: {
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});


