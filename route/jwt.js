import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { jwtMiddleware } from '../middleware/jwtMiddleware.js'
import { db } from '../database.js'
 

export const router = express.Router()

// Login
router.post('/login', async (req, res) => {

    const username = req.body.username
    const password = req.body.password
    let jwtToken

    try {
        jwtToken = await login(username, password)
    } catch (err) {
        return res.status(401).json({
            type: 'failed',
            message: 'Wrong username or password'
        })
    }

    res.json({
        type: 'Success',
        message: 'The user was authenticated',
        token: jwtToken, 
        payload: jwt.decode(jwtToken)
    })

})

// Perform a login, check username/password and return a JWT on success
async function login (username, password) {
    
    const user = await getUser(username, password)
    if (!user) {
        throw new Error('No user')
    }

    const payload = {
        iss: 'Issuer id', 
        sub: user.username,
        iat: Date.now(),
        username: user.username,
        role: user.role,
        permissions: ['read', 'write']
    }

    const options = {
        expiresIn: '1h'
    }
    const token = jwt.sign(payload, "VERY SECRET KEY", options)
    return token
}

async function getUser(username, password) {
    const sql = `SELECT * FROM user WHERE username = ?`
    const [resultset] = await db.query(sql, [
        username
    ])
    const user = resultset.length > 0 ? resultset[0] : null

    if (!user) {
        return null
    }

    const success = await bcrypt.compare(password, user.password)
    if (!success) {
        return null
    }

    delete user.password
    return user
}

// Protected route
router.get('/protected', jwtMiddleware, async (req, res) => {
    res.json({
        message: 'This is a protected route that you have reached successfully',
        payload: res.locals.payload
    })
})

//Upgrade database with hashed passwords
router.post('/hash-passwords', async (req, res) => {
    const sql = `SELECT * FROM user`
    const [allUsers] = await db.query(sql)

    for (const user of allUsers) {
        const plainPassword = user.password
        const hashedPassword = await bcrypt.hash(plainPassword, 10)

        const updateSql = `UPDATE user SET password = ? WHERE id = ?`
        await db.query(updateSql, [
            hashedPassword,
            user.id
        ]
        )
    }

    res.json({
        message: 'The user passwords were hashed'
    })

})
