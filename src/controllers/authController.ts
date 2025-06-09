import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import type { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';

const genrateToken = (userId: string): string => {
    // @ts-ignore - Ignore type checking for jwt.sign to resolve the issue
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
        return res.status(401).json({
            success: false,
            message: 'User already exists'
        })
    };

    const user = await UserModel.create({ name, email, password, ip: req.ip });

    const token = genrateToken(user._id.toString());

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token
    })
});

const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        })
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        })
    }

    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Password is incorrect'
        })
    }

    const token = genrateToken(user._id.toString());

    res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token
    })
})

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById((req as any).user._id);

    res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: { user }
    })
});

