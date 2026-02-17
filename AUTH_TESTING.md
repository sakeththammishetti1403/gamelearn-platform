# Authentication Testing Guide

This guide helps you test both local credentials and OAuth authentication.

## Testing Local Authentication (Email/Password)

### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "student"
}
```

**Expected Response:**
```json
{
  "_id": "user_id",
  "name": "Test User",
  "email": "test@example.com",
  "role": "student",
  "avatar": "",
  "authProvider": "local",
  "token": "jwt_token_here"
}
```

### 2. Login with Credentials

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "_id": "user_id",
  "name": "Test User",
  "email": "test@example.com",
  "role": "student",
  "avatar": "",
  "authProvider": "local",
  "token": "jwt_token_here"
}
```

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Expected Response:**
```json
{
  "_id": "user_id",
  "name": "Test User",
  "email": "test@example.com",
  "role": "student",
  "authProvider": "local",
  "avatar": "",
  "xp": 0,
  "skillRating": 1000,
  "rank": "Bronze"
}
```

## Testing OAuth Authentication

### Google OAuth Flow

1. Navigate to: `http://localhost:5173/login`
2. Click "Continue with Google"
3. You'll be redirected to Google's login page
4. Sign in with your Google account
5. Grant permissions
6. You'll be redirected back to: `http://localhost:5173/auth/success?token=...`
7. The app will automatically log you in and redirect to the appropriate dashboard

### GitHub OAuth Flow

1. Navigate to: `http://localhost:5173/login`
2. Click "Continue with GitHub"
3. You'll be redirected to GitHub's authorization page
4. Click "Authorize"
5. You'll be redirected back and logged in

### LinkedIn OAuth Flow

1. Navigate to: `http://localhost:5173/login`
2. Click "Continue with LinkedIn"
3. Sign in with your LinkedIn account
4. Grant permissions
5. You'll be redirected back and logged in

## Common Test Scenarios

### Scenario 1: User Tries to Login with Wrong Password

**Request:**
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```

**Expected Response:** `401 Unauthorized`
```json
{
  "message": "Invalid email or password"
}
```

### Scenario 2: User Tries to Register with Existing Email

**Request:**
```json
{
  "email": "test@example.com",
  "password": "newpassword123",
  "name": "Another User"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "message": "User already exists with this email"
}
```

### Scenario 3: OAuth User Tries to Login with Password

If a user registered via Google OAuth and tries to login with email/password:

**Expected Response:** `401 Unauthorized`
```json
{
  "message": "This account uses google login. Please use the \"google\" button to sign in."
}
```

### Scenario 4: Missing Required Fields

**Request:**
```json
{
  "email": "test@example.com"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "message": "Please provide email and password"
}
```

### Scenario 5: Invalid Email Format

**Request:**
```json
{
  "email": "invalid-email",
  "password": "password123"
}
```

**Expected Response:** Handled by frontend validation before API call

### Scenario 6: Password Too Short

**Request:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123"
}
```

**Expected Response:** `400 Bad Request`
```json
{
  "message": "Password must be at least 6 characters long"
}
```

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing with Postman

1. Import the following collection or create requests manually
2. Set the base URL to `http://localhost:5000/api`
3. For authenticated requests, add the token to the Authorization header

### Collection Structure:
```
Auth
├── Register (POST /auth/register)
├── Login (POST /auth/login)
└── Get Current User (GET /auth/me)
```

## Automated Testing Script

You can use this Node.js script to test the authentication flow:

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    // 1. Register
    console.log('Testing registration...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'student'
    });
    console.log('✅ Registration successful');
    const token = registerRes.data.token;

    // 2. Get current user
    console.log('Testing get current user...');
    const meRes = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get current user successful');

    // 3. Login
    console.log('Testing login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerRes.data.email,
      password: 'password123'
    });
    console.log('✅ Login successful');

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();
```

## Troubleshooting

### Issue: "Invalid email or password"
- Verify the email exists in the database
- Check that the password is correct
- Ensure the user's authProvider is 'local'

### Issue: "Token verification failed"
- Check that JWT_SECRET is set in .env
- Verify the token hasn't expired (30 days default)
- Ensure the token is being sent in the Authorization header

### Issue: "OAuth authentication failed"
- Verify OAuth credentials are configured in .env
- Check callback URLs match exactly
- Ensure the OAuth app is not restricted to specific users
- Check server logs for detailed error messages

### Issue: "User already exists"
- The email is already registered
- Try logging in instead of registering
- Use a different email address

## Security Checklist

- [ ] Passwords are hashed before storing (bcrypt)
- [ ] JWT tokens expire after 30 days
- [ ] Sensitive data is not exposed in API responses
- [ ] OAuth credentials are stored securely in .env
- [ ] CORS is configured correctly
- [ ] HTTPS is used in production
- [ ] Rate limiting is implemented (recommended)
- [ ] Input validation is performed on all endpoints
