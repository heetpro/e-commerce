import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config } from "./config/config";
import morgan from "morgan";

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
