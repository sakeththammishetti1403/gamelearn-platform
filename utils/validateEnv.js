// Environment variable validation
const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'FRONTEND_URL'
];

const oauthEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET'
];

function validateEnv() {
    const missing = [];
    const placeholder = [];

    // Check required vars
    for (const varName of requiredEnvVars) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }

    // Check OAuth vars (warn if placeholder)
    for (const varName of oauthEnvVars) {
        if (!process.env[varName]) {
            missing.push(varName);
        } else if (process.env[varName].includes('your_') || process.env[varName].includes('_here')) {
            placeholder.push(varName);
        }
    }

    if (missing.length > 0) {
        console.error('❌ FATAL: Missing required environment variables:');
        missing.forEach(v => console.error(`   - ${v}`));
        process.exit(1);
    }

    if (placeholder.length > 0) {
        console.warn('⚠️  WARNING: OAuth credentials are placeholders. Social login will NOT work:');
        placeholder.forEach(v => console.warn(`   - ${v}`));
        console.warn('   Update .env with real OAuth credentials from:');
        console.warn('   - Google: https://console.cloud.google.com/');
        console.warn('   - GitHub: https://github.com/settings/developers');
        console.warn('   - LinkedIn: https://www.linkedin.com/developers/apps');
    }

    console.log('✅ Environment variables loaded');
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`   OAuth Status: ${placeholder.length === 0 ? 'READY' : 'NOT CONFIGURED'}`);
}

module.exports = validateEnv;
