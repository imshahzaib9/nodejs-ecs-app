const express = require('express');
const router = express.Router();
 
// In-memory data store (for demo purposes)
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString() },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', createdAt: new Date().toISOString() }
];
let nextId = 4;
 
// API Info
router.get('/', (req, res) => {
    res.json({
        name: 'Node.js ECS API',
        version: process.env.APP_VERSION || '1.0.0',
        description: 'REST API deployed on Amazon ECS via CodePipeline',
        endpoints: {
            'GET /api/info': 'Get server information',
            'GET /api/users': 'Get all users',
            'GET /api/users/:id': 'Get user by ID',
            'POST /api/users': 'Create new user',
            'PUT /api/users/:id': 'Update user',
            'DELETE /api/users/:id': 'Delete user'
        }
    });
});
 
// Server Info
router.get('/info', (req, res) => {
    res.json({
        hostname: process.env.HOSTNAME || 'unknown',
        platform: process.platform,
        nodeVersion: process.version,
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        },
        uptime: Math.round(process.uptime()) + ' seconds',
        timestamp: new Date().toISOString()
    });
});
 
// GET all users
router.get('/users', (req, res) => {
    res.json({
        success: true,
        count: users.length,
        data: users
    });
});
 
// GET user by ID
router.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    res.json({
        success: true,
        data: user
    });
});
 
// POST create user
router.post('/users', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            error: 'Name and email are required'
        });
    }
    
    // Check for duplicate email
    if (users.find(u => u.email === email)) {
        return res.status(409).json({
            success: false,
            error: 'Email already exists'
        });
    }
    
    const newUser = {
        id: nextId++,
        name,
        email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
    });
});
 
// PUT update user
router.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    users[userIndex] = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        updatedAt: new Date().toISOString()
    };
    
    res.json({
        success: true,
        message: 'User updated successfully',
        data: users[userIndex]
    });
});
 
// DELETE user
router.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser
    });
});
 
module.exports = router;

