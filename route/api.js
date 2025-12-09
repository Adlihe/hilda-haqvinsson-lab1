import express from 'express'
import { db } from '../database.js'

export const router = express.Router()

// Run this in terminal
//node --env-file=.env app.js

// Get all products from database
router.get('/products', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
  SELECT 
    * 
  FROM Product;
  `
    //Make a database quety
    const [resultset] = await db.query(sql)
    //console.table(resultset)
  
    res.json(resultset)
})

// Get all suppliers from database
router.get('/supplier', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
  SELECT 
    * 
  FROM Supplier;
  `
    //Make a database quety
    const [resultset] = await db.query(sql)
    //console.table(resultset)
  
    res.json(resultset)
})

// Get all products and suppliers from database
router.get('/product-and-supplier', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
      SELECT 
        p.productID AS product_id,
        p.name AS product_name,
        p.quantity,
        p.price,
        s.supplierID AS supplier_id,
        s.name AS supplier_name,
        c.name AS category
    FROM Product p
        JOIN Supplier s ON p.supplierID = s.supplierID
        JOIN Category c ON p.categoryID = c.categoryID
    ;
      `
    //Make a database quety
    const [resultset] = await db.query(sql)
    //console.table(resultset)
  
    res.json(resultset)
})

//Filter result on product, type or supplier
router.get('/product-filter', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.productID AS productId,
        p.name AS productName,
        c.name AS type,
        s.supplierID AS supplierID
    FROM PRODUCT p
        JOIN CATEGORY c ON c.categoryID = p.categoryID
        JOIN SUPPLIER s on s.supplierID = p.supplierID
        WHERE p.name LIKE ?
        OR c.name LIKE ? ;
        `

    let searchString = '%' + req.query.search + '%'

    //Make a database quety
    const [resultset] = await db.query(sql, [searchString, searchString])
    res.json(resultset)
})