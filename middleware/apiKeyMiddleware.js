export function apiKeyMiddleware (req, res, next) {
    // Read header x-api-key
    const apiKeyHeader = req.headers['x-api-key']
    
    if (!apiKeyHeader) {
        res.status(401).json({message: 'Missing API key'})
    }
    // Read the API_KEY
    const apiKey = process.env.API_KEY

    if (apiKeyHeader !== apiKey) {
        res.status(403).json({message: 'Invalid API key'})
    }

    // Compare and decide if proceed or not
    next()
}