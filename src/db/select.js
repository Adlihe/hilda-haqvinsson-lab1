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
SELECT 
  * 
FROM Product order by price desc;
`

const sql2 = 
`
SELECT * From category;
`
//Make a database quety
const [resultset] = await db.query(sql)
console.table(resultset)

const [resultset2] = await db.query(sql2)
console.table(resultset2)

//Close the connection
await db.end()