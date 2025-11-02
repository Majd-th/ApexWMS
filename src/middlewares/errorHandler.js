export function errorHandler(err, req, res, next){
    console.error('Error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.message
        });
    }
    
    // Handle database connection errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return res.status(503).json({
            message: 'Database connection failed'
        });
    }
    
    // Handle PostgreSQL errors
    if (err.code && err.code.startsWith('23')) {
        return res.status(400).json({
            message: 'Database constraint violation',
            error: err.message
        });
    }
    
    // Default error response
    res.status(500).json({
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message })
    });
}