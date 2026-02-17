# OAuth Setup Guide

This guide will help you configure OAuth authentication for Google, GitHub, and LinkedIn.

## Prerequisites

- A deployed backend URL (for production) or `http://localhost:5000` (for development)
- A frontend URL (for production) or `http://localhost:5173` (for development)

## 1. Google OAuth Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### Step 2: Create OAuth Credentials
1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Authorized JavaScript origins:**
     - `http://localhost:5173` (development)
     - Your production frontend URL
   - **Authorized redirect URIs:**
     - `http://localhost:5000/api/auth/google/callback` (development)
     - `https://your-backend-url.com/api/auth/google/callback` (production)
5. Copy the **Client ID** and **Client Secret**

### Step 3: Update .env
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 2. GitHub OAuth Setup

### Step 1: Register a New OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name:** Your App Name
   - **Homepage URL:** `http://localhost:5173` or your production URL
   - **Authorization callback URL:**
     - `http://localhost:5000/api/auth/github/callback` (development)
     - `https://your-backend-url.com/api/auth/github/callback` (production)
4. Click **Register application**
5. Copy the **Client ID**
6. Generate a new **Client Secret** and copy it

### Step 2: Update .env
```env
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## 3. LinkedIn OAuth Setup

### Step 1: Create a LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click **Create app**
3. Fill in the required information
4. Once created, go to the **Auth** tab

### Step 2: Configure OAuth Settings
1. Add **Authorized redirect URLs:**
   - `http://localhost:5000/api/auth/linkedin/callback` (development)
   - `https://your-backend-url.com/api/auth/linkedin/callback` (production)
2. Request access to the following scopes:
   - `r_liteprofile`
   - `r_emailaddress`
3. Copy the **Client ID** and **Client Secret** from the Auth tab

### Step 3: Update .env
```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

## 4. Complete .env Configuration

Your final `.env` file should look like this:

```env
# ================================
# SERVER
# ================================
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000/api

# ================================
# DATABASE
# ================================
MONGO_URI=your_mongodb_connection_string

# ================================
# AUTH
# ================================
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# ================================
# FRONTEND
# ================================
FRONTEND_URL=http://localhost:5173

# ================================
# OAUTH CREDENTIALS
# ================================
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

## 5. Testing OAuth

### Development Testing
1. Start your backend: `npm run server`
2. Start your frontend: `npm run client` (or `cd client && npm run dev`)
3. Navigate to `http://localhost:5173/login`
4. Click on any OAuth provider button
5. Complete the OAuth flow
6. You should be redirected back and logged in

### Common Issues

#### "OAuth authentication failed"
- Check that your OAuth credentials are correct in `.env`
- Verify callback URLs match exactly (including http/https)
- Ensure the OAuth app is not in development/testing mode that restricts users

#### "Redirect URI mismatch"
- The callback URL in your OAuth provider settings must exactly match your backend URL
- Check for trailing slashes
- Verify http vs https

#### "Invalid client"
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces in your `.env` file
- Restart your server after updating `.env`

## 6. Production Deployment

When deploying to production:

1. Update `BACKEND_URL` to your production backend URL
2. Update `FRONTEND_URL` to your production frontend URL
3. Add production callback URLs to all OAuth providers:
   - Google: `https://your-backend.com/api/auth/google/callback`
   - GitHub: `https://your-backend.com/api/auth/github/callback`
   - LinkedIn: `https://your-backend.com/api/auth/linkedin/callback`
4. Update environment variables on your hosting platform
5. Restart your application

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique secrets for `JWT_SECRET` and `SESSION_SECRET`
- In production, always use HTTPS
- Regularly rotate your OAuth secrets
- Monitor OAuth usage for suspicious activity

## Support

If you encounter issues:
1. Check the server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple OAuth flow first (Google is usually easiest)
4. Check the OAuth provider's documentation for any recent API changes
