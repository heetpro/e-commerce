import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "./config/config";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import productsRoutes from "./routes/products";
import ordersRoutes from "./routes/orders";

 const app = express()

 //middleware
 app.use(helmet())
 app.use(cors())

 //rate limiting

 const limiter =  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, //100 req per windowMS
    message: 'Too many requests, please try again later.'
 })
 app.use(limiter)

 //logging
 if(config.nodeEnv === 'development'){
    app.use(morgan('dev'))
 }

 app.use(express.json({limit: '10mb'}));
 app.use(express.urlencoded({extended: true}));

 //routes
 app.use('/api/auth', authRoutes)
 app.use('/api/products', productsRoutes)
 app.use('/api/orders', ordersRoutes)


 app.get('/health', (req,res) => {
    res.json({
        status: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    })
 })
//404 handler
 app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
