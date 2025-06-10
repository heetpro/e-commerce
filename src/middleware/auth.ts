import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/config";
import { UserModel } from "../models/User";

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req:AuthRequest, res:Response, next:NextFunction): Promise<void> => {
    try { 
        const token = req.header('Authorization')?.replace('Bearer ', '')

    if(!token) {
        res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
        return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    const user =  await UserModel.findById(decoded.userId).select('-password');

    if(!user) {
        res.status(401).json({ 
            success: false, 
            message: ' Invalid token.' 
        });
        return;
    }

    req.user = user;
    next(); 

} catch (error) {
    res.status(401).json({ 
        success: false, 
        message: 'Caught Invalid token.' 
    });
}
    
}

export const authorize = (...roles: string[]) => {
    return (req:AuthRequest, res:Response, next:NextFunction): void => {
        if(!req.user) {
            res.status(401).json({
                success: false,
                message: 'Access denied. Please Authenticate yourself first.'
            });
            return;
        }

        if(!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions to access this resource.'
            });
            return;
        }
        
        next();
    }
};

