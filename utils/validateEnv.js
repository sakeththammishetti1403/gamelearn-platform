// Minimal environment variable validation
const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET'
];

function validateEnv() {
    const missing = [];

    // Check only critical required vars
    for (const varName of requiredEnvVars) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(v => console.error(`   - ${v}`));
        process.exit(1);
    }

    console.log('✅ Environment variables validated');
    console.log(`   MongoDB: ${process.env.MONGO_URI ? '✓' : '✗'}`);
    console.log(`   JWT: ${process.env.JWT_SECRET ? '✓' : '✗'}`);
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'Not set (will use default)'}`);
    console.log(`   Backend URL: ${process.env.BACKEND_URL || 'Not set (will use default)'}`);
}

module.exports = validateEnv;
