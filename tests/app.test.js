const request = require('supertest');
const app = require('../src/app');
 	
describe('Node.js ECS Application Tests', () => {
    
    describe('Health Check', () => {
        test('GET /health should return healthy status', async () => {
            const response = await request(app).get('/health');
            
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('healthy');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });
    
    describe('Root Endpoint', () => {
        test('GET / should return welcome message', async () => {
            const response = await request(app).get('/');
            
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toContain('Welcome');
            expect(response.body).toHaveProperty('endpoints');
        });
    });
    
    describe('API Info', () => {
        test('GET /api should return API information', async () => {
            const response = await request(app).get('/api');
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('name');
            expect(response.body).toHaveProperty('endpoints');
        });
        
        test('GET /api/info should return server info', async () => {
            const response = await request(app).get('/api/info');
            
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('nodeVersion');
            expect(response.body).toHaveProperty('uptime');
        });
    });
    
    describe('Users API', () => {
        test('GET /api/users should return all users', async () => {
            const response = await request(app).get('/api/users');
            
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
        
        test('GET /api/users/:id should return user by ID', async () => {
            const response = await request(app).get('/api/users/1');
            
            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('name');
        });
        
        test('GET /api/users/:id should return 404 for non-existent user', async () => {
            const response = await request(app).get('/api/users/9999');
            
            expect(response.statusCode).toBe(404);
            expect(response.body.success).toBe(false);
        });
        
        test('POST /api/users should create a new user', async () => {
            const newUser = {
                name: 'Test User',
                email: 'test' + Date.now() + '@example.com'
            };
            
            const response = await request(app)
                .post('/api/users')
                .send(newUser);
            
            expect(response.statusCode).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.name).toBe(newUser.name);
        });
        
        test('POST /api/users should return 400 for missing fields', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ name: 'Test' });
            
            expect(response.statusCode).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });
    
    describe('404 Handler', () => {
        test('GET /nonexistent should return 404', async () => {
            const response = await request(app).get('/nonexistent');
            
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Not Found');
        });
    });
});

