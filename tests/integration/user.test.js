import mongoose from "mongoose";
import supertest from "supertest";
import { app, server } from "../../src";
import { User } from "../../src/api/models/user.model";
import { History } from "../../src/api/models/history.model";

let request;

describe("/api/user", () => {
  beforeEach(async () => {
    if (server) server.close();
    request = supertest(app);

    await User.create([
      {
        regNo: 220000001,
        firstName: "John",
        otherName: "Doe",
        department: "CS",
        level: 3,
        gender: "male",
      },
      {
        regNo: 220000002,
        firstName: "Jane",
        otherName: "Smith",
        department: "IT",
        level: 2,
        gender: "female",
      },
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

  describe("POST /", () => {
    it("should return 400 if user already exists", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000001,
          firstName: "John",
          otherName: "Doe",
          department: "CS",
          level: 3,
          gender: "male",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "User already exists");
    });

    it("should return 400 if first name is missing", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "",
          otherName: "Doe",
          department: "CS",
          level: 3,
          gender: "male",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "First name is required");
    });

    it("should return 400 if last name is missing", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "John",
          otherName: "",
          department: "CS",
          level: 3,
          gender: "male",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Last name is required");
    });

    it("should return 400 if department name is missing", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "John",
          otherName: "Doe",
          department: "",
          level: 3,
          gender: "male",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Department is required");
    });

    it("should return 400 if level is missing", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "John",
          otherName: "Doe",
          department: "CS",
          level: "",
          gender: "male",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Level must be between 1 and 6");
    });

    it("should return 400 if gender is not correct", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "John",
          otherName: "Doe",
          department: "CS",
          level: 2,
          gender: "",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Gender must be either male or female");
    });

    it("should return 400 if regNo format is invalid", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 210000001,
          firstName: "John",
          otherName: "Doe",
          department: "CS",
          level: 3,
          gender: "male",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Registration number must start with 22 and be 9 digits"
      );
    });

    it("should return 400 if names are too short", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "J",
          otherName: "D",
          department: "CS",
          level: 3,
          gender: "male",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Names must be at least 2 characters long"
      );
    });

    it("should return 400 if level is invalid", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "John",
          otherName: "Doe",
          department: "CS",
          level: 7,
          gender: "male",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Level must be between 1 and 6"
      );
    });

    it("should return 400 if gender is invalid", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "John",
          otherName: "Doe",
          department: "CS",
          level: 3,
          gender: "other",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Gender must be either male or female"
      );
    });

    it("should return 201 and create user and history if valid data is provided", async () => {
      const res = await request
        .post("/api/user")
        .send({
          regNo: 220000003,
          firstName: "Alice",
          otherName: "Johnson",
          department: "CS",
          level: 3,
          gender: "female",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("ticketId");
      expect(res.body.ticketId.slice(-4)).toBe(
        res.body.regNo.toString().slice(-4)
      );

      // Check if user is saved in database
      const user = await User.findOne({ regNo: 220000003 });
      expect(user).not.toBeNull();

      // Check if history is created
      const history = await History.findOne({ regNo: user.regNo });
      expect(history).not.toBeNull();
      expect(history.ticketId.slice(-4)).toBe(user.regNo.toString().slice(-4));
    });
  });

  describe("GET /:reg", () => {
    // Test 1: Validate input (reg number should exist, be a number, start with 22, and have 9 characters)
    it("should return 400 if the reg number is missing or invalid", async () => {
      // Missing regNo
      let res = await request.get("/api/user/");
      expect(res.status).toBe(404);

      // regNo not a number
      res = await request.get("/api/user/abc123");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Registration number must be a valid number"
      );

      // regNo not starting with 22
      res = await request.get("/api/user/210000001");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Registration number must start with 22"
      );

      // regNo not 9 digits
      res = await request.get("/api/user/22000001"); // 8 digits
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Registration number must be 9 digits long"
      );
    });

    // Test 2: Check if user exists in the database
    it("should return 404 if the user with the given reg number does not exist", async () => {
      const res = await request.get("/api/user/220000009");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });

    // Test 3a: Check if the user already has a ticket for today
    it("should return 400 if the user already has a ticket for today", async () => {
      await History.create({
        regNo: 220000001,
        ticketId: `UR${Date.now()}-0001`,
      });

      const res = await request.get("/api/user/220000001");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "User already has a ticket for today"
      );
    });

    // Test 3b: Successfully create a new ticket if everything is valid
    it("should create a new history record and return firstName, otherName, and ticketId if valid", async () => {
      const res = await request.get("/api/user/220000002");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("firstName", "Jane");
      expect(res.body).toHaveProperty("otherName", "Smith");
      expect(res.body).toHaveProperty("ticketId");

      // Validate ticketId format
      expect(res.body.ticketId.startsWith("UR")).toBe(true);
      expect(res.body.ticketId.slice(-4)).toBe("0002");

      // Check if history is saved in database
      const history = await History.findOne({ regNo: 220000002 });
      expect(history).not.toBeNull();
      expect(history.ticketId).toBe(res.body.ticketId);
    });
  });
});
