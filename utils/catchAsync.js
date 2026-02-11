/**
 * Wraps an asynchronous function (route handler or middleware) 
 * to catch any errors and pass them to the next middleware.
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;
