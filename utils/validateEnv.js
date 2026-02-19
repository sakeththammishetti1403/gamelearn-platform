// Simple environment variable validation
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
    console.log(`   MongoDB: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`);
    console.log(`   JWT: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
}

module.exports = validateEnv;
