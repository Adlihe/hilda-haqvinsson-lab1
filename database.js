// How to connect to the databse
import mysql from 'mysql2/promise'

//Create a connection

export const db = await mysql.createConnection({
    host: process.env.DB_HOST,   
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_SCHEMA, 
})