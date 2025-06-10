import app from "./app";
import { config } from "./config/config";
import { connectDB } from "./config/db"


const startServer = async () => {
    try {
        await connectDB();

        // start over
        app.listen(config.port, ()=> {
            console.log(`Server running on port ${config.port}`);
            console.log(`Environment: ${config.nodeEnv}`);
            console.log(`Health check: http://localhost:${config.port}/health`);
        })
    }
    catch(error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();