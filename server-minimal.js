// Absolute minimal server for Railway testing
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

console.log('🚀 Starting minimal server...');
console.log('📍 Port:', PORT);
console.log('📍 Environment:', process.env.NODE_ENV);

// Health check FIRST
app.get('/health', (req, res) => {
    console.log('✅ Health check hit');
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.send('Minimal server is running!');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Minimal server running on 0.0.0.0:${PORT}`);
}).on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
});
