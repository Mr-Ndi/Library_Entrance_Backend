import mongoose from 'mongoose';
import supertest from 'supertest';
import { app, server } from '../../src';
import { User } from '../../src/api/models/user.model';
import { History } from '../../src/api/models/history.model';

let request;

describe('/api/history', () => {
    beforeAll(async () => {
        if (server) server.close();
        request = supertest(app);
        await mongoose.connection.dropDatabase();
    });

    beforeEach(async () => {
        // Clean up database before each test
        await User.deleteMany({});
        await History.deleteMany({});

        // Create test users
        await User.create([
            { regNo: 220000001, firstName: 'John', otherName: 'Doe', department: 'CS', level: 3, gender: 'male' },
            { regNo: 220000002, firstName: 'Jane', otherName: 'Smith', department: 'IT', level: 2, gender: 'female' },
            { regNo: 220000003, firstName: 'Alice', otherName: 'Johnson', department: 'CS', level: 4, gender: 'female' }
        ]);

        // Create history records with proper ticketId format
        const timestamp = Date.now();
        await History.create([
            { regNo: 220000001, ticketId: `UR${timestamp}-0001` },
            { regNo: 220000002, ticketId: `UR${timestamp}-0002` },
            { regNo: 220000003, ticketId: `UR${timestamp}-0003` }
        ]);
    });

    afterEach(async () => {
        await User.deleteMany({});
        await History.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('GET /api/history?ticketId=', () => {
        it('should return correct user data when searching by a valid ticketId', async () => {
            const ticketId = `UR${Date.now()}-0001`;
            
            // First remove any existing history for this regNo
            await History.deleteOne({ regNo: 220000001 });
            // Then create new history with yesterday's date
            await History.create({ regNo: 220000001, ticketId });
            
            const res = await request.get(`/api/history?ticketId=${ticketId}`);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toHaveProperty('firstName', 'John');
            expect(res.body[0]).toHaveProperty('otherName', 'Doe');
            expect(res.body[0]).toHaveProperty('ticketId', ticketId);
        });

        it('should return 404 if ticketId does not exist', async () => {
            const nonExistentTicketId = `UR${Date.now()}-9999`;
            const res = await request.get(`/api/history?ticketId=${nonExistentTicketId}`);
            
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'No history record found with this ticketId');
        });
    });

    describe('GET /api/history with other query parameters', () => {
        it('should return multiple results when searching by department', async () => {
            const res = await request.get('/api/history?department=CS');

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            res.body.forEach(record => {
                expect(record).toHaveProperty('department', 'CS');
            });
        });

        it('should return correct user data when searching by regNo', async () => {
            const res = await request.get('/api/history?regNo=220000002');
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toHaveProperty('firstName', 'Jane');
            expect(res.body[0]).toHaveProperty('otherName', 'Smith');
            expect(res.body[0]).toHaveProperty('regNo', 220000002);
            // Verify ticketId format
            expect(res.body[0].ticketId).toMatch(/UR\d+-0002$/);
        });

        it('should return results that match both department and gender', async () => {
            const res = await request.get('/api/history?department=CS&gender=female');

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
            res.body.forEach(record => {
                expect(record).toHaveProperty('department', 'CS');
                expect(record).toHaveProperty('gender', 'female');
                // Verify ticketId format matches regNo
                const lastFourDigits = record.regNo.toString().slice(-4);
                expect(record.ticketId).toMatch(new RegExp(`UR\\d+-${lastFourDigits}$`));
            });
        });

        it('should return an empty array if no matches are found', async () => {
            const res = await request.get('/api/history?department=Physics');
            
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('should return multiple results when searching by gender', async () => {
            const res = await request.get('/api/history?gender=female');
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            res.body.forEach(record => {
                expect(record).toHaveProperty('gender', 'female');
                // Verify ticketId format
                const lastFourDigits = record.regNo.toString().slice(-4);
                expect(record.ticketId).toMatch(new RegExp(`UR\\d+-${lastFourDigits}$`));
            });
        });

        it('should return records that match multiple criteria: department, level, and gender', async () => {
            const res = await request.get('/api/history?department=CS&level=3&gender=male');
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toMatchObject({
                firstName: 'John',
                otherName: 'Doe',
                level: 3,
                department: 'CS',
                gender: 'male'
            });
            // Verify ticketId format
            expect(res.body[0].ticketId).toMatch(/UR\d+-0001$/);
        });

        it('should handle pagination correctly', async () => {
            const res = await request.get('/api/history?department=CS&limit=1&page=1');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            // Verify ticketId format for returned record
            const lastFourDigits = res.body[0].regNo.toString().slice(-4);
            expect(res.body[0].ticketId).toMatch(new RegExp(`UR\\d+-${lastFourDigits}$`));
        });

        it('should return all records if no query parameters are provided', async () => {
            const res = await request.get('/api/history');

            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThanOrEqual(3);
            // Verify all ticketIds follow the correct format
            res.body.forEach(record => {
                const lastFourDigits = record.regNo.toString().slice(-4);
                expect(record.ticketId).toMatch(new RegExp(`UR\\d+-${lastFourDigits}$`));
            });
        });
    });
});