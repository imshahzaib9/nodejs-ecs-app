const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Allow inline styles for demo
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
 
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
 
// Root endpoint - Serve HTML page
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node.js ECS Application | Created By Shahzaib</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #48cc53 0%, #05ff36 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
            animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .header h1 {
            color: #333;
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header .emoji {
            font-size: 3em;
            margin-bottom: 10px;
        }

        .version-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            margin-top: 10px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .info-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .info-card .label {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .info-card .value {
            color: #333;
            font-size: 1.2em;
            font-weight: bold;
        }

        .endpoints {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
        }

        .endpoints h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.5em;
        }

        .endpoint-list {
            list-style: none;
        }

        .endpoint-item {
            background: white;
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            border-left: 4px solid #667eea;
        }

        .endpoint-item:hover {
            background: #667eea;
            color: white;
            transform: translateX(5px);
        }

        .endpoint-item:hover a {
            color: white;
        }

        .endpoint-item a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .endpoint-method {
            background: #667eea;
            color: white;
            padding: 5px 12px;
            border-radius: 5px;
            font-size: 0.85em;
            font-weight: bold;
        }

        .endpoint-item:hover .endpoint-method {
            background: white;
            color: #667eea;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 15px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            border-radius: 10px;
            margin-bottom: 20px;
        }

        .pulse {
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.5;
                transform: scale(1.2);
            }
        }

        .footer {
            text-align: center;
            color: #666;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
        }

        @media (max-width: 600px) {
            .container {
                padding: 20px;
            }

            .header h1 {
                font-size: 1.8em;
            }

            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="emoji">🚀</div>
            <h1>Node.js ECS Application | Created by Shahzaib</h1>
            <span class="version-badge">v${process.env.APP_VERSION || '1.0.0'}</span>
        </div>

        <div class="status-indicator">
            <div class="pulse"></div>
            <strong>Server is Running</strong>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <div class="label">Environment</div>
                <div class="value">${process.env.NODE_ENV || 'development'}</div>
            </div>
            <div class="info-card">
                <div class="label">Port</div>
                <div class="value">${PORT}</div>
            </div>
            <div class="info-card">
                <div class="label">Deployed At</div>
                <div class="value">${process.env.DEPLOY_TIME || 'N/A'}</div>
            </div>
        </div>

        <div class="endpoints">
            <h2>📡 Available Endpoints</h2>
            <ul class="endpoint-list">
                <li class="endpoint-item">
                    <a href="/health">/health</a>
                    <span class="endpoint-method">GET</span>
                </li>
                <li class="endpoint-item">
                    <a href="/api">/api</a>
                    <span class="endpoint-method">GET</span>
                </li>
                <li class="endpoint-item">
                    <a href="/api/users">/api/users</a>
                    <span class="endpoint-method">GET</span>
                </li>
                <li class="endpoint-item">
                    <a href="/api/info">/api/info</a>
                    <span class="endpoint-method">GET</span>
                </li>
                <li class="endpoint-item">
                    <a href="/dashboard">/dashboard</a>
                    <span class="endpoint-method">GET</span>
                </li>
            </ul>
        </div>

        <div class="footer">
            <p>Built with ❤️ using Node.js & Express</p>
            <p style="margin-top: 5px; font-size: 0.9em;">Last updated: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `);
});

// Dashboard endpoint
app.get('/dashboard', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - ECS Application</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f0f2f5;
            padding: 20px;
        }

        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .navbar h1 {
            font-size: 2em;
        }

        .navbar a {
            color: white;
            text-decoration: none;
            margin-left: 20px;
            opacity: 0.9;
            transition: opacity 0.3s;
        }

        .navbar a:hover {
            opacity: 1;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        .card-icon {
            font-size: 2em;
            margin-right: 15px;
        }

        .card-title {
            font-size: 1.2em;
            color: #333;
            font-weight: 600;
        }

        .card-value {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin: 15px 0;
        }

        .card-label {
            color: #666;
            font-size: 0.9em;
        }

        .metrics-table {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: left;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }

        tr:hover {
            background: #f8f9fa;
        }

        .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: bold;
        }

        .status-healthy {
            background: #d4edda;
            color: #155724;
        }

        .status-warning {
            background: #fff3cd;
            color: #856404;
        }

        .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1em;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            margin-top: 20px;
        }

        .refresh-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .chart-placeholder {
            height: 200px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 1.1em;
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>📊 Application Dashboard</h1>
        <a href="/">← Back to Home</a>
    </div>

    <div class="dashboard-grid">
        <div class="card">
            <div class="card-header">
                <div class="card-icon">⏱️</div>
                <div class="card-title">Uptime</div>
            </div>
            <div class="card-value" id="uptime">${Math.floor(process.uptime())}s</div>
            <div class="card-label">Server running time</div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="card-icon">💾</div>
                <div class="card-title">Memory Usage</div>
            </div>
            <div class="card-value">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB</div>
            <div class="card-label">Heap memory used</div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="card-icon">🔧</div>
                <div class="card-title">Node Version</div>
            </div>
            <div class="card-value" style="font-size: 1.8em;">${process.version}</div>
            <div class="card-label">Runtime version</div>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="card-icon">🌐</div>
                <div class="card-title">Platform</div>
            </div>
            <div class="card-value" style="font-size: 1.8em;">${process.platform}</div>
            <div class="card-label">Operating system</div>
        </div>
    </div>

    <div class="metrics-table">
        <table>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>API Health</td>
                    <td>/health endpoint</td>
                    <td><span class="status-badge status-healthy">Healthy</span></td>
                </tr>
                <tr>
                    <td>Environment</td>
                    <td>${process.env.NODE_ENV || 'development'}</td>
                    <td><span class="status-badge status-healthy">Active</span></td>
                </tr>
                <tr>
                    <td>Version</td>
                    <td>${process.env.APP_VERSION || '1.0.0'}</td>
                    <td><span class="status-badge status-healthy">Latest</span></td>
                </tr>
                <tr>
                    <td>Process ID</td>
                    <td>${process.pid}</td>
                    <td><span class="status-badge status-healthy">Running</span></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div style="text-align: center;">
        <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Dashboard</button>
    </div>

    <script>
        // Auto-update uptime every second
        setInterval(() => {
            const uptimeEl = document.getElementById('uptime');
            const currentUptime = parseInt(uptimeEl.textContent);
            uptimeEl.textContent = (currentUptime + 1) + 's';
        }, 1000);
    </script>
</body>
</html>
    `);
});
 
// API routes
app.use('/api', routes);
 
// Error handling middleware
app.use(errorHandler);
 
// 404 handler
app.use((req, res) => {
    res.status(404).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .error-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 60px 40px;
            text-align: center;
        }

        .error-code {
            font-size: 8em;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 20px;
        }

        h1 {
            color: #333;
            margin-bottom: 15px;
            font-size: 2em;
        }

        .error-message {
            color: #666;
            margin-bottom: 10px;
            font-size: 1.1em;
        }

        .error-path {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            color: #333;
            font-family: monospace;
            word-break: break-all;
        }

        .home-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 25px;
            text-decoration: none;
            margin-top: 20px;
            transition: transform 0.3s, box-shadow 0.3s;
            font-weight: 600;
        }

        .home-button:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .emoji {
            font-size: 4em;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="emoji">🔍</div>
        <div class="error-code">404</div>
        <h1>Page Not Found</h1>
        <p class="error-message">The page you're looking for doesn't exist.</p>
        <div class="error-path">
            Cannot ${req.method} ${req.path}
        </div>
        <p style="color: #999; margin: 20px 0;">Timestamp: ${new Date().toISOString()}</p>
        <a href="/" class="home-button">← Go Home</a>
    </div>
</body>
</html>
    `);
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
        console.log(`  🏠 Home: http://localhost:${PORT}/`);
        console.log(`  📊 Dashboard: http://localhost:${PORT}/dashboard`);
        console.log('========================================');
    });
}
 
module.exports = app;
