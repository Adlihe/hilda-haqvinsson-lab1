import readline from 'readline/promises'
import { stdin as input, stdout as output } from 'process'
// How to connect to the databse
import mysql from 'mysql2/promise'

// Run this in terminal
//node --env-file=.env handle_application/menu.js

const rl = readline.createInterface({ input, output })

console.log('test')

//Create a connection
const db = await mysql.createConnection({
    host: process.env.DB_HOST,   
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_SCHEMA, 

})

function show () {
    console.clear()
    console.log(` ---- Main Menu ----
    1. Show all products
    2. Show all suppliers
    3. Join products with supplier
    4. Insert a new product
    5. Exit        
    `)
}

async function readChoice() {
    const choice = await rl.question('Select a menu option: ')

    switch (choice) {
    case '1': await menuChoice1(); break
    case '2': await menuChoice2(); break
    case '3': await menuChoice3(); break
    case '4': await menuChoice4(); break
    case '5': return false
    default: await rl.question('Invalid option. Press enter to try again. ')
    }
    return true
}

async function menuChoice1 () {
    console.log('\n# Show all products in the database')

    const sql = `
    SELECT 
        * 
    FROM PRODUCT;
    `
    const [resultset] = await db.query(sql)
    console.table(resultset)

    await rl.question('Press enter to continue...')
}

async function menuChoice2 () {
    console.log('\n# Show all suppliers in the database')

    const sql = `
    SELECT 
        * 
    FROM SUPPLIER;
    `
    const [resultset] = await db.query(sql)
    console.table(resultset)

    await rl.question('Press enter to continue...')
}

async function menuChoice3 () {
    console.log('\n# Join products with supplier')

    const sql = `
      SELECT 
        p.productId AS product_id,
        p.name AS product_name,
        p.quantity,
        p.price,
        s.supplierId AS supplier_id,
        s.name AS supplier_name,
        c.name AS category
        FROM Product p
            JOIN Supplier s ON p.supplierId = s.supplierId
            JOIN Category c ON p.categoryId = c.categoryId
        ;
        `

    const [resultset] = await db.query(sql)
    console.table(resultset)

    await rl.question('Press enter to continue...')
}

async function menuChoice4 () {
    console.log('\n# Insert a product')

    let inserted = false

    //Loop until the insert is valid
    while (!inserted) {
        try {
            const sql = `
            INSERT INTO Product (name, quantity, price, categoryId, supplierId)
            VALUES
            (?, ?, ?, ?, ?)
            ;
            `
            const supply_sql = `
            SELECT 
                supplierId, name
            FROM SUPPLIER
            ;`  

            //Make a database query
            const validTypes = ['fruit', 'flower']
            const [suppliers] = await db.query(supply_sql)

            const name = await rl.question('What is the name of the fruit/flower: ')
            let type = await rl.question('Is it a fruit or a flower? ')
            const quantity = await rl.question('How many should there be in stock: ')
            const price = await rl.question('What is the price of the item: ' )
            console.table(suppliers)    
            const supplierId = await rl.question('What is the supplier id? ')

            //Make sure the type is actually fruit or flower
            while (!validTypes.includes(type.toLowerCase())) {
                console.log('Invalid type. Must be "fruit" or "flower"')
                type = await rl.question('Is it a fruit or a flower? ')
                console.log(type)
            }

            //Assign categoryId accordingly to the type
            let categoryId
            if (type.toLowerCase() === 'fruit') {
                categoryId = 1
            } else if (type.toLowerCase() === 'flower') {
                categoryId = 2
            } else {
                console.log('Invalid type!')
                return
            }
          
            const [resultset] = await db.query(sql, [name, quantity, price, categoryId, supplierId])
            console.log('Insert succesful!')
            inserted = true
                
        } catch (err) {
            console.log("Insert failed:", err.message)
        console.log("Please try again.\n")
        }
    }

    await rl.question('Press enter to continue...')
}

do {
    show()
} while ( await readChoice () )

rl.close()
//Close the connection
await db.end()