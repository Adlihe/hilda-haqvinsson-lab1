import express from 'express'
import logger from 'morgan'
import path from 'path'
import { router } from '../route/route.js'
import { router as api } from '../route/api.js'
import { router as crud } from '../route/apiCrud.js'
import { router as jwt } from '../route/jwt.js'
import { errorHandler } from '../middleware/errorHandler.js'


export const app = express()
console.log('express is running')

// Use a logger
app.use(logger('dev'))

//Parse body as JSON when needed
app.use(express.json())

// Add the router
app.use('/', router)
app.use('/api', api)
app.use('/api', crud)
app.use('/jwt', jwt)

// Use static content from public/
app.use(express.static('public'))

// Add EJS template engine
app.set('view engine', 'ejs')
app.set('views', path.join('src', 'views'))


app.use(errorHandler.errorNotFound)
app.use(errorHandler.errorDefault)
