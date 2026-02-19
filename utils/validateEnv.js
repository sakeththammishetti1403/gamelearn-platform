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
    const oauthMissing = [];

    // Check required vars
    for (const varName of requiredEnvVars) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }

    // Check OAuth vars (warn only, don't fail)
    for (const varName of oauthEnvVars) {
        if (!process.env[varName]) {
            oauthMissing.push(varName);
        } else if (
            process.env[varName] === 'DISABLED' || 
            process.env[varName] === 'placeholder' ||
            process.env[varName].includes('your_') || 
            process.env[varName].includes('_here')
        ) {
            placeholder.push(varName);
        }
    }

    if (missing.length > 0) {
        console.error('❌ FATAL: Missing required environment variables:');
        missing.forEach(v => console.error(`   - ${v}`));
        process.exit(1);
    }

    if (oauthMissing.length > 0) {
        console.warn('\n⚠️  OAuth credentials not configured (optional):');
        oauthMissing.forEach(v => console.warn(`   - ${v}`));
        console.warn('   Social login will be disabled.');
    }

    if (placeholder.length > 0) {
        console.warn('\n⚠️  WARNING: OAuth credentials need configuration:');
        placeholder.forEach(v => console.warn(`   - ${v}`));
        console.warn('\n📖 Social login will NOT work until you configure OAuth credentials.');
        console.warn('   See OAUTH_SETUP.md for detailed setup instructions.');
        console.warn('\n   Quick links:');
        console.warn('   - Google: https://console.cloud.google.com/');
        console.warn('   - GitHub: https://github.com/settings/developers');
        console.warn('   - LinkedIn: https://www.linkedin.com/developers/apps\n');
    }

    console.log('✅ Environment variables loaded');
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`   Backend URL: ${process.env.BACKEND_URL || 'Not set (using default)'}`);
    console.log(`   OAuth Status: ${placeholder.length === 0 ? '✅ READY' : '⚠️  NEEDS CONFIGURATION'}`);
}

module.exports = validateEnv;
