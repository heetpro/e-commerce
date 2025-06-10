// optional to integrate at med level its not necessary for use.
// add validation in controller routes
import type { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Add multer type definitions
interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}

// Extend Request type
interface FileRequest extends Request {
    file?: MulterFile;
    files?: MulterFile[] | Record<string, MulterFile[]>;
}

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Auth validations
export const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    handleValidationErrors
];

export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Product validations
export const validateProduct = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be 2-100 characters'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Product description must be 10-2000 characters'),
    body('price')
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    body('category')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be 2-50 characters'),
    body('brand')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Brand must be 2-50 characters'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('images')
        .isArray({ min: 1 })
        .withMessage('At least one image is required')
        .custom((images) => {
            if (!Array.isArray(images)) return false;
            return images.every(img => typeof img === 'string' && img.trim().length > 0);
        })
        .withMessage('All images must be valid non-empty strings'),
    handleValidationErrors
];

export const validateProductUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be 2-100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Product description must be 10-2000 characters'),
    body('price')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be 2-50 characters'),
    body('brand')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Brand must be 2-50 characters'),
    body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    body('images')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one image is required')
        .custom((images) => {
            if (!Array.isArray(images)) return false;
            return images.every(img => typeof img === 'string' && img.trim().length > 0);
        })
        .withMessage('All images must be valid non-empty strings'),
    handleValidationErrors
];

// Review validation
export const validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage('Comment must be 5-500 characters'),
    handleValidationErrors
];

// Order validations
export const validateOrder = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    body('items.*.product')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('shippingAddress.street')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Street address must be 5-100 characters'),
    body('shippingAddress.city')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('City must be 2-50 characters'),
    body('shippingAddress.state')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('State must be 2-50 characters'),
    body('shippingAddress.zipCode')
        .trim()
        .matches(/^[0-9]{5,10}$/)
        .withMessage('ZIP code must be 5-10 digits'),
    body('shippingAddress.country')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Country must be 2-50 characters'),
    body('paymentMethod')
        .isIn(['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'])
        .withMessage('Invalid payment method'),
    handleValidationErrors
];

export const validateOrderStatus = [
    body('status')
        .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status'),
    body('trackingUrl')
        .optional()
        .isURL()
        .withMessage('Tracking URL must be a valid URL'),
    handleValidationErrors
];

// Address validation
export const validateAddress = [
    body('street')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Street address must be 5-100 characters'),
    body('city')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('City must be 2-50 characters'),
    body('state')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('State must be 2-50 characters'),
    body('zipCode')
        .trim()
        .matches(/^[0-9]{5,10}$/)
        .withMessage('ZIP code must be 5-10 digits'),
    body('country')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Country must be 2-50 characters'),
    handleValidationErrors
];

// MongoDB ObjectId validation
export const validateMongoId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    handleValidationErrors
];

// Query parameter validations
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

export const validateProductQuery = [
    query('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be 1-50 characters'),
    query('brand')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Brand must be 1-50 characters'),
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search term must be 1-100 characters'),
    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be non-negative'),
    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be non-negative'),
    query('sort')
        .optional()
        .isIn(['price', '-price', 'name', '-name', 'createdAt', '-createdAt', 'ratings.average', '-ratings.average'])
        .withMessage('Invalid sort parameter'),
    handleValidationErrors
];

// User profile update validation
export const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be 2-50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    handleValidationErrors
];

// Password change validation
export const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match new password');
            }
            return true;
        }),
    handleValidationErrors
];

// File upload validation helper
export const validateFileUpload = (req: FileRequest, res: Response, next: NextFunction) => {
    if (!req.file && !req.files) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    let files: MulterFile[] = [];
    
    if (req.file) {
        files = [req.file];
    } else if (req.files) {
        files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    }
    
    for (const file of files) {
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type. Only JPEG, JPG, PNG, and WebP are allowed'
            });
        }
        
        if (file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB'
            });
        }
    }
    
    next();
};