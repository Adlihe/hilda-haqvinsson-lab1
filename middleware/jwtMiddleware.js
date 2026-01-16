import jwt from 'jsonwebtoken'

export function jwtMiddleware (req, res, next) {
    // Read header x-api-key
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
        res.status(401).json({message: 'Missing JWT token'})
    }

    const [schema, token] = authHeader.split(' ')

    if (schema !== 'Bearer' || !token){
        res.status(401).json({ message: 'Invalid authorisation.. '})
    }
    try {
        const payload = jwt.verify(token, "VERY SECRET KEY")
        res.locals.payload = payload
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'JWT Expired'
            })
        }
        return res.status(403).json({
            message: 'Token invalid'
        })
    }

    // Compare and decide if proceed or not
    next()
}