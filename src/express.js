import express from 'express'
import logger from 'morgan'
import path from 'path'
import { router } from '../route/route.js'
import { router as api } from '../route/api.js'

export const app = express()
console.log('express is running')

// Use a logger
app.use(logger('dev'))

// Add the router
app.use('/', router)
app.use('/api', api)

// Use static content from public/
app.use(express.static('public'))

// Add EJS template engine
app.set('view engine', 'ejs')
app.set('views', path.join('src', 'views'))


/*app.use((req, res) => {
    console.log('INSIDE')
    res.send('HELLOOO!!')
})*/

// Error handler for 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Global errorhandler
app.use((err, req, res, next) => {
    const status = err.status || 500
    console.error(err)
    res.status(status).json({
        status,
        message: err.message
    })
})
