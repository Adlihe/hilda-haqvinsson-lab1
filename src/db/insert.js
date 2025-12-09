// How to connect to the databse
import mysql from 'mysql2/promise'

// Run this in terminal
//node --env-file=.env src/db/select.js 

//Create a connection

const db = await mysql.createConnection({
    host: process.env.DB_HOST,   
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_SCHEMA, 

})

//Prepare SQL 
const sql = `
INSERT INTO Product (name, type, quantity, price, categoryid, supplierid)
VALUES
  (?, ?, ?, ?, ?, ?)
;
`

const name = 'Orange'
const type = 'Fruit'
const quantity = 101
const price = 15.90
const categoryid = 1
const supplierid = 2

//Make a database quety
const [resultset] = await db.query(sql, [name, type, quantity, price, categoryid, supplierid])
console.table(resultset)


//Close the connection
await db.end()