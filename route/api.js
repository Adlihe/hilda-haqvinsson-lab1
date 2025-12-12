import express from 'express'
import { db } from '../database.js'
import { validateInput, validateNumber, validatePositiveNumber } from './errorHandler.js'

export const router = express.Router()

// Run this in terminal
//node --env-file=.env app.js

// Get all products from database
router.get('/products', async (req, res) => {
   
    const sql = `
    SELECT 
        * 
    FROM Product
    ORDER BY productId;
    `
    try {
        const [resultset] = await db.query(sql)
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }
})

// Get all suppliers from database
router.get('/supplier', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
  SELECT 
    * 
  FROM Supplier
  ORDER BY supplierId;
  `
   try {
        const [resultset] = await db.query(sql)

        if (resultset.length === 0) {
            return res.status(404).json({
                error: 'No suppliers found'
            })
        }
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }
})

// Get all products and suppliers from database
router.get('/product-and-supplier', async (req, res) => {
   
    //Prepare SQL 
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
            ORDER BY productId
        ;
      `

    try {
        const [resultset] = await db.query(sql)
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }
})

//Filter result on product, type or supplier
router.get('/product-filter', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.productId AS productId,
        p.name AS productName,
        c.name AS type,
        s.supplierId AS supplierId
    FROM PRODUCT p
        JOIN CATEGORY c ON c.categoryId = p.categoryId
        JOIN SUPPLIER s on s.supplierId = p.supplierId
        WHERE p.name LIKE ?
        OR c.name LIKE ? ;
        `

    let searchStringRaw = req.query.search
    let searchString = '%' + searchStringRaw + '%'

    let error = validateInput(searchStringRaw, 'searchString')
    if (error) return res.status(400).json({ error })

    try {
        const [resultset] = await db.query(sql, [searchString, searchString])
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }

})

// Get product from id
router.get('/product/:id', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.productId, 
        p.name AS product_name,
        p.price,
        c.name AS category
    FROM PRODUCT p
        JOIN Category c ON p.categoryId = c.categoryId
    WHERE 
        productId = ?
    ;
    `
    let productId = req.params.id

    let error = validateNumber(productId, 'productId')
    if (error) return res.status(400).json({ error })

    const prodId = Number(productId)

    error = validatePositiveNumber(prodId, 'productId')
    if (error) return res.status(400).json({ error })

    try {
        const [resultset] = await db.query(sql, [productId])

        if (resultset.length === 0) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }
})

// Show the supplier info based on specific productId
router.get('/product/:id/supplier', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.name AS product_name,
        s.supplierId AS supplier_id,
        s.name AS supplier_name,
        s.phone,
        s.email
    FROM Product p
        JOIN Supplier s ON p.supplierId = s.supplierId
    WHERE productId = ?
    ;
    `
    let productId = req.params.id

    let error = validateNumber(productId, 'productId')
    if (error) return res.status(400).json({ error })

    const prodId = Number(productId)

    error = validatePositiveNumber(prodId, 'productId')
    if (error) return res.status(400).json({ error })

    try {
        const [resultset] = await db.query(sql, [productId])

        if (resultset.length === 0) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }

})

//Get inventory for specific product
router.get('/product/:id/inventory', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.productId as product_id,
        p.name AS product_name,
        s.supplierId as supplier_id,
        s.name as supplier_name,
        p.quantity
    FROM Product p
        JOIN Supplier s ON p.supplierId = s.supplierId
    WHERE productId = ?
    ;
  ` 
    let productId = req.params.id

    let error = validateNumber(productId, 'productId')
    if (error) return res.status(400).json({ error })

    const prodId = Number(productId)

    error = validatePositiveNumber(prodId, 'productId')
    if (error) return res.status(400).json({ error })

    try {
        const [resultset] = await db.query(sql, [productId])

        if (resultset.length === 0) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }
    
    
})

//Get all products related to a specific supplier
router.get('/supplier-filter', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.productId AS productId,
        p.name AS productName,
        c.name AS type,
        s.supplierId AS supplierId,
        s.name AS supplier_name, 
        p.price,
        p.quantity
    FROM PRODUCT p
        JOIN CATEGORY c ON c.categoryId = p.categoryId
        JOIN SUPPLIER s on s.supplierId = p.supplierId
        WHERE s.supplierId = ?
        ORDER BY productId
        `

    let input = req.query.supplierId

    let error = validateInput(input, 'supplierId')
    if (error) return res.status(400).json({ error })

    error = validateNumber(input, 'supplierId')
    if (error) return res.status(400).json({ error })

    const supplierId = Number(input)

    error = validatePositiveNumber(supplierId, 'supplierId')
    if (error) return res.status(400).json({ error })

    //Make a database quety
    const [resultset] = await db.query(sql, [supplierId])
    res.json(resultset)
})

//Filter products with minimum quantity
router.get('/products/quantity', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.productId AS productId,
        p.name AS productName,
        c.name AS type,
        s.supplierId AS supplierId,
        s.name AS supplier_name, 
        p.price,
        p.quantity
    FROM PRODUCT p
        JOIN CATEGORY c ON c.categoryId = p.categoryId
        JOIN SUPPLIER s on s.supplierId = p.supplierId
        WHERE p.quantity < ?
        ORDER BY quantity
        `

    let input = req.query.min_quantity

    let error = validateInput(input, 'min_quantity')
    if (error) return res.status(400).json({ error })

    error = validateNumber(input, 'min_quantity')
    if (error) return res.status(400).json({ error })

    const minQuantity = Number(input)

    error = validatePositiveNumber(minQuantity, 'min_quantity')
    if (error) return res.status(400).json({ error })
    
    //Make a database quety
    const [resultset] = await db.query(sql, [minQuantity])
    res.json(resultset)
})