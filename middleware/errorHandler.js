    
export const errorHandler = {}

// Error handler for 404
errorHandler.errorNotFound = (req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
}

// Global errorhandler
errorHandler.errorDefault = (err, req, res, next) => {
    const status = err.status || 500
    console.error(err)
    res.status(status).json({
        status,
        message: err.message
    })
}