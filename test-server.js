// Minimal test server for Railway debugging
const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    console.log(`📥 Request received: ${req.method} ${req.url}`);
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from Railway!\nPort: ${PORT}\nTime: ${new Date().toISOString()}\n`);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Test server running on 0.0.0.0:${PORT}`);
    console.log(`📍 Server address:`, server.address());
});

server.on('error', (err) => {
    console.error('❌ Server error:', err);
    process.exit(1);
});
