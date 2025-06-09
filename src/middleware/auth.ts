import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/config";
import { UserModel } from "../models/User";

interface AuthRequest extends Request {
    // for now
    user?: any;
}

export const authenticate = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try { 
        const token = req.header('Authorization')?.replace('Bearer ', '')

    if(!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    const user =  await UserModel.findById(decoded.userId).select('-password');

    if(!user) {
        return res.status(401).json({ 
            success: false, 
            message: ' Invalid token.' 
        });
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
    return (req:AuthRequest, res:Response, next:NextFunction) => {
        if(!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Please Authenticate yourself first.'
            })
        }

        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions to access this resource.'
            })
        }
        

        next();
    }
};

