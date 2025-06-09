import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { ProductModel } from "../models/Product";


export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    if ((req as any).user.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'You don\'t have permission to create a product'
        })
    }

    const product = await ProductModel.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
    })
})

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;


    const query: any = {};

    if (req.query.category) {
        query.category = new RegExp(req.query.category as string, 'i');
    }

    if (req.query.brand) {
        query.brand = new RegExp(req.query.brand as string, 'i');
    }

    if (req.query.search) {
        query.$or = [
            { name: new RegExp(req.query.search as string, 'i') },
            { description: new RegExp(req.query.search as string, 'i') },
        ]
    }

    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice as string);
        if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice as string);
    }


    const products = await ProductModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await ProductModel.countDocuments(query);


    res.json({
        success: true,
        data: {
            products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)

            }
        },
    })
});



export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id).populate('reviews.userId', 'name');

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }


    res.json({
        success: true,
        data: product
    })
});


export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
    );


    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product }

    })
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {

    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    await ProductModel.findByIdAndDelete(req.params.id);

    res.json({
        success: true,
        message: 'Product deleted successfully'
    });
})


export const addReview = asyncHandler(async (req: Request, res: Response) => {

    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = (req as any).user._id;

    const product = await ProductModel.findById(productId);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    const existingReview = product.reviews.find((review: any) => review.userId.toString() === userId.toString());
    
    if (existingReview) {
        return res.status(400).json({
            success: false,
            message: 'You have already reviewed this product'
        });
    }

    product.reviews.push({
        userId,
        rating,
        comment,
        createdAt: new Date()
    } as any);

    (product as any).updateRatings();
    await product.save();

    res.json({
        success: true,
        message: 'Review added successfully',
        data: { product }
    });
})
