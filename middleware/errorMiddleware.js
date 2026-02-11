const fs = require('fs');
const path = require('path');

/**
 * Global error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    const errorDetails = {
        timestamp: new Date().toISOString(),
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        user: req.user ? req.user._id : 'anonymous'
    };

    // Log to console
    console.error('❌ Error caught by global handler:', errorDetails);

    // Log to file for persistent debugging
    const logPath = path.join(__dirname, '../server_error.log');
    const logEntry = JSON.stringify(errorDetails, null, 2) + '\n---\n';
    try {
        fs.appendFileSync(logPath, logEntry);
    } catch (fsErr) {
        console.error('Failed to write to error log file:', fsErr);
    }

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
