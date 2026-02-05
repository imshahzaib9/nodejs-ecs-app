const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Health check endpoint - CRITICAL for ECS health checks
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});
 
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Node.js ECS Application!',
        version: process.env.APP_VERSION || '1.0.0',
        deployedAt: process.env.DEPLOY_TIME || 'unknown',
        endpoints: {
            health: '/health',
            api: '/api',
            users: '/api/users',
            info: '/api/info'
        }
    });
});
 
// API routes
app.use('/api', routes);
 
// Error handling middleware
app.use(errorHandler);
 
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`,
        timestamp: new Date().toISOString()
    });
});
 
// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log('========================================');
        console.log(`  🚀 Server started successfully!`);
        console.log(`  📍 Port: ${PORT}`);
        console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`  📦 Version: ${process.env.APP_VERSION || '1.0.0'}`);
        console.log(`  🔗 Health: http://localhost:${PORT}/health`);
        console.log('========================================');
    });
}
 
module.exports = app;

