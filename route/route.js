import express from 'express'

export const router = express.Router()

// Hello world route
router.get('/', (req, res) => {
    res.send('Hello World!')
})