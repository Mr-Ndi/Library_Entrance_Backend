# Library API

## Version
2.0.0

## Description
The Library API provides endpoints for user registration, session requests, and ticket validation for library access.

## Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://library-entrance-backend.onrender.com`

## Tags
- **Requesting Session:** Endpoints related to requesting sessions.
- **History:** Endpoints related to ticket history and validation.

## Endpoints

### 1. Requesting a Session

#### **Get User Session**
- **Endpoint:** `/api/user/{regnumber}`
- **Method:** `GET`
- **Description:** Requests a session using the provided registration number.
- **Parameters:**
  - `regnumber` (path, required): The registration number to request a session.
- **Responses:**
  - **200:** Session requested successfully.
    - Content: 
      ```json
      {
        "message": "Session requested successfully"
      }
      ```
  - **204:** No content to return; the request was successful but there is no such student.
    - Content: 
      ```json
      {
        "message": "No such student",
        "status": false
      }
      ```
  - **400:** Bad request.
  - **401:** Unauthorized.

---

### 2. User Registration

#### **Register User**
- **Endpoint:** `/api/user`
- **Method:** `POST`
- **Description:** Registers a new user and records them for attendance.
- **Request Body:**
  ```json
  {
    "regNo": 222003242,
    "firstName": "John",
    "otherName": "Doe",
    "level": 200,
    "department": "Computer Science",
    "gender": "male"
  }
