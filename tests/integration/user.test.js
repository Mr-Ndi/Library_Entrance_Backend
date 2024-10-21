import mongoose from 'mongoose';
import supertest from 'supertest';
import { app, server } from '../../src';
import { User } from '../../src/api/models/user.model';
import { History } from '../../src/api/models/history.model';

let request;

describe('/api/user', () => {
    beforeEach(async () => {
        if (server) server.close();
        request = supertest(app);

        // Prepopulate the database with test data
        await User.deleteMany({});
        await History.deleteMany({});

        await User.create([
            { regNo: 220000001, firstName: 'John', otherName: 'Doe', department: 'CS', level: 3, gender: 'male' },
            { regNo: 220000002, firstName: 'Jane', otherName: 'Smith', department: 'IT', level: 2, gender: 'female' }
        ]);
    });

    afterEach(async () => {
        // Clean up the database after each test
        await User.deleteMany({});
        await History.deleteMany({});
    });

    afterAll(async () => {
        // Close the mongoose connection after all tests
        await mongoose.connection.close();
    });

    describe('POST /', () => {
        it('should return 400 if user already exists', async () => {
            const res = await request
                .post('/api/user')
                .send({ regNo: 220000001, firstName: 'John', otherName: 'Doe', department: 'CS', level: 3, gender: 'male' });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });

        it('should return 400 if a required field is missing', async () => {
            const res = await request
                .post('/api/user')
                .send({ regNo: 220000003, firstName: '', otherName: 'Doe', department: 'CS', level: 3, gender: 'male' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'All fields are required');
        });

        it('should return 400 if regNo format is invalid', async () => {
            const res = await request
                .post('/api/user')
                .send({ regNo: 210000001, firstName: 'John', otherName: 'Doe', department: 'CS', level: 3, gender: 'male' });
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Registration number must start with 22 and be 9 digits');
        });

        it('should return 400 if names are too short', async () => {
            const res = await request
                .post('/api/user')
                .send({ regNo: 220000003, firstName: 'J', otherName: 'D', department: 'CS', level: 3, gender: 'male' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Names must be at least 2 characters long');
        });

        it('should return 400 if level is invalid', async () => {
            const res = await request
                .post('/api/user')
                .send({ regNo: 220000003, firstName: 'John', otherName: 'Doe', department: 'CS', level: 7, gender: 'male' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Level must be between 1 and 6');
        });

        it('should return 400 if gender is invalid', async () => {
            const res = await request
                .post('/api/user')
                .send({ regNo: 220000003, firstName: 'John', otherName: 'Doe', department: 'CS', level: 3, gender: 'other' });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Gender must be either male or female');
        });

        it('should return 201 and create user and history if valid data is provided', async () => {
            const res = await request
                .post('/api/user')
                .send({ regNo: 220000003, firstName: 'Alice', otherName: 'Johnson', department: 'CS', level: 3, gender: 'female' });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('ticketId');
            expect(res.body.ticketId.slice(-4)).toBe(res.body.regNo.toString().slice(-4));

            // Check if user is saved in database
            const user = await User.findOne({ regNo: 220000003 });
            expect(user).not.toBeNull();

            // Check if history is created
            const history = await History.findOne({ regNo: user.regNo });
            expect(history).not.toBeNull();
            expect(history.ticketId.slice(-4)).toBe(user.regNo.toString().slice(-4));
        });
    });
});
