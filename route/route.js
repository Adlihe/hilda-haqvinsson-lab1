import express from 'express'

export const router = express.Router()

// Hello world route
router.get('/', (req, res) => {
    res.send('Hello World! FINALLY')
    console.log('we are in the get function.')
})

// JSON Hello World!
/*router.get('/api/hello', (req, res) => {
    res.json({
        message: 'Hello world in JSON',
        now: new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm'}),
        random: Math.floor(Math.random() * 100 + 1)
    })
})*/

// A route throwing exceptions
/*router.get('/api/error', (req, res) => {
    throw new Error('This is a forced error for demonstration purposes')  
})*/

// A route being forbidden, using exceptions to show it
/*router.get('/api/forbidden', (req, res, next) => {
    const err = new Error('You are not allowed to access this resource')
    err.status = 403
    throw err
})*/

// A route rendering a page using EJS template/view engine
/*router.get('/home', (req, res) => {
    const data = {
        header: 'EJS Example',
        message: 'Hello world in EJS',
        now: new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm'}),
        random: Math.floor(Math.random() * 100 + 1)
    }
    res.render('home', data)
})*/