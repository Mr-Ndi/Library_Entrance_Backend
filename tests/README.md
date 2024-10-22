# Project Testing Guide

This guide will walk you through setting up and running the integration tests for the `/api/user` and `/api/history` endpoints.

## Prerequisites

Before running the tests, ensure you have the following installed on your machine:

- **Node.js**: Install the latest version of Node.js from [here](https://nodejs.org/).
- **MongoDB**: Ensure MongoDB is installed and running locally or remotely. You can download and install MongoDB from [here](https://www.mongodb.com/try/download/community).

## Project Setup

### 1. Clone the Repository

First, you need to clone the project repository to your local machine. Run the following command in your terminal:

```bash
git clone <repository-url>
```

Navigate to the project directory and install the necessary dependencies using `npm`:
```
cd Library_Entrance_Backend
npm install
```

Create a `.env` file at the root of your project and add the necessary environment variables, including MongoDB connection details. An example `.env` file might look like this:

```
MONGO_URI=mongodb://localhost:27017/your_database_name
```

## Running Tests

### 1. Run the tests

To run the tests, you will use the `jest` testing framework, which has already been set up in this project.

First, ensure your application is not already running on the same port (as configured in the `.env` file).

Now, run the tests using the following command:

```
npm test
```

This command will execute all the test files in the project.

### 2. Running a specific test file

If you want to run a specific test file (for example, the user tests), you can specify the path to the test file like so:


```
npm jest path/to/test/file
```

for example run:
```
npm jest tests/integration/user.test.js
```

### 3. Detect Open Handles (Debugging)

If you encounter issues with tests not completing properly or warnings about open handles, you can run the tests with the --detectOpenHandles flag for debugging:
```
npm test -- --detectOpenHandles
```
