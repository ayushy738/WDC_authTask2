# Backend Development Task

## Introduction

This README explains everything I have implemented in this backend task. While building this project, my primary focus was not just to complete the required features, but to structure the backend the way a real-world system would be written.

Since WDC is the Official Tech Team of NIT Patna, I intentionally followed a modular and layered architecture instead of placing all logic inside routes. My goal was to maintain separation of concerns, security best practices, and clean code organization.

Apart from completing the required functionality, I have also implemented additional improvements in security, token management, and modularization, which are explained below.

## Tech Stack

- Node.js
- Express.js
- MySQL (mysql2)

## Project Structure

```
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── services/
│   ├── authService.js
│   └── userService.js
├── models/
│   └── userModel.js
├── middleware/
│   ├── authMiddleware.js
│   └── rateLimiter.js
├── utils/
│   ├── generateToken.js
│   └── setAuthCookies.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── .env
└── server.js
```

## Architectural Flow

- Routes → Define endpoints
- Controllers → Handle request & response
- Services → Business logic
- Models → Database interaction
- Middleware → Authentication & security
- Utils → Reusable logic (JWT generation & cookies)

This separation ensures that changes in database logic or token logic do not affect controllers directly.

## Implementation Details (As mentioned in the Task Description)

## 1. Authentication System

### Signup & Login APIs

Implemented:

- POST /api/auth/signup
- POST /api/auth/login

<img width="1437" height="670" alt="image" src="https://github.com/user-attachments/assets/28024102-dd16-489d-b1ab-78994405b7ab" />

### Password Security

Passwords are securely hashed using bcrypt before being stored:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

During login:

```js
const match = await bcrypt.compare(password, user.password);
```

This ensures that passwords are never stored in plain text and protects if the database gets compromised.

### Strict Input Validation

Using express-validator, I enforced:

- Valid email format
- Email normalization
- Strong password rules:
  - Minimum 8 characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character

This prevents weak credentials and improves overall security.

<img width="1435" height="879" alt="image" src="https://github.com/user-attachments/assets/145533bc-5dec-4c1a-b46e-224e0fc54eff" />


## 2. Database Integration & CRUD

### MySQL Integration

Database connection handled in config/db.js using mysql2:

```js
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

### Users Table Structure

- id (Primary Key)
- name
- email (Unique)
- password
- bio
- contact

### CRUD Operations Implemented

- Create → Signup
- Read → GET /api/user/me
- Update → PUT /api/user/update
- Delete → DELETE /api/user/delete

For updates, I implemented partial update logic so that fields not provided in the request are not overwritten with null values.

<img width="1436" height="836" alt="image" src="https://github.com/user-attachments/assets/58bb890a-9cfa-4350-8ffb-d46d996e9204" />


### Extra Implementation in Database Layer

- Used Promise-based model functions instead of callbacks
- Isolated database logic inside models
- Structured service layer so DB changes can be refactored independently

  <img width="1434" height="763" alt="image" src="https://github.com/user-attachments/assets/4f3ea99a-3256-46c0-8623-de0144f60761" />


## 3. JWT Authentication Flow

### Access Token & Refresh Token

On login:

- Access Token → 15 minutes
- Refresh Token → 7 days

Access token generation (via utility):

```js
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};
```

Refresh token generation:

```js
jwt.sign(
  { id: userId },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: "7d" }
);
```

### HttpOnly Cookie Storage

Tokens are stored using HttpOnly cookies:

```js
res.cookie("token", accessToken, {
  httpOnly: true,
  sameSite: "strict",
});
```

### Endpoint That Decrypts the Token

The requirement to:

Create an API endpoint that decrypts the token and returns authenticated user details.

This was implemented as:

GET /api/user/me

The authentication middleware verifies and decodes the token:

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded.id;
```

The /me endpoint then fetches user details using the decoded ID from the token.

This endpoint effectively verifies and decrypts the token before returning authenticated user information.

### Refresh Token Flow

POST /api/auth/refresh

- Verifies refresh token
- Generates new access token
- Sets new HttpOnly cookie

This allows secure session continuation without forcing re-login.


<img width="1434" height="681" alt="image" src="https://github.com/user-attachments/assets/402b0e88-6512-4612-b53f-b766fb35e59d" />


### Extra Implementation in JWT Flow

- Centralized JWT creation in utilities
- Centralized cookie configuration
- Implemented proper access + refresh token architecture
- Clean separation between middleware and business logic

## Bonus Implementations

### Rate Limiting

Implemented rate limiting using express-rate-limit.

Applied specifically on:

- Signup
- Login
- Refresh

This prevents brute-force attacks and credential stuffing attempts.

### Use HTTP Only Cookies
 httpOnly: true 
- Used HttpOnly cookies instead of localStorage to prevent from XSS attack

## Additional Design Decisions

- Followed layered architecture (controller → service → model)
- Avoided writing logic inside routes
- Used middleware for authentication
- Implemented refresh token flow instead of basic JWT
- Applied security best practices (hashing, validation, rate limiting)

