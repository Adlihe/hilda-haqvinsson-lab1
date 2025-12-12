import express from 'express'
import { db } from '../database.js'
import { validateInput, validateNumber, validatePositiveNumber } from './errorHandler.js'

export const router = express.Router()

// Run this in terminal
//node --env-file=.env app.js

// Get all products from database
router.get('/products', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
  SELECT 
    * 
  FROM Product
  ORDER BY productID;
  `
    try {
        const [resultset] = await db.query(sql)

        if (resultset.length === 0) {
            return res.status(404).json({
                error: 'No products found'
            })
        }
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
  ORDER BY supplierID;
  `
   try {
        const [resultset] = await db.query(sql)

        if (resultset.length === 0) {
            return res.status(404).json({
                error: 'No products found'
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
            ORDER BY productID
        ;
      `

    try {
        const [resultset] = await db.query(sql)

        if (resultset.length === 0) {
            return res.status(404).json({
                error: 'No products found'
            })
        }
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

    let searchStringRaw = req.query.search
    let searchString = '%' + searchStringRaw + '%'

    let error = validateInput(searchStringRaw, 'searchString')
    if (error) return res.status(400).json({ error })

    try {
        const [resultset] = await db.query(sql, [searchString, searchString])

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

// Get product from id
router.get('/product/:id', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.productID, 
        p.name AS product_name,
        p.price,
        c.name AS category
    FROM PRODUCT p
        JOIN Category c ON p.categoryID = c.categoryID
    WHERE 
        productID = ?
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
        s.supplierID AS supplier_id,
        s.name AS supplier_name,
        s.phone,
        s.email
    FROM Product p
        JOIN Supplier s ON p.supplierID = s.supplierID
    WHERE productID = ?
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
        p.productID as product_id,
        p.name AS product_name,
        s.supplierID as supplier_id,
        s.name as supplier_name,
        p.quantity
    FROM Product p
        JOIN Supplier s ON p.supplierID = s.supplierID
    WHERE productID = ?
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
        p.productID AS productId,
        p.name AS productName,
        c.name AS type,
        s.supplierID AS supplierId,
        s.name AS supplier_name, 
        p.price,
        p.quantity
    FROM PRODUCT p
        JOIN CATEGORY c ON c.categoryID = p.categoryID
        JOIN SUPPLIER s on s.supplierID = p.supplierID
        WHERE s.supplierID = ?
        ORDER BY productID
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
        p.productID AS productId,
        p.name AS productName,
        c.name AS type,
        s.supplierID AS supplierId,
        s.name AS supplier_name, 
        p.price,
        p.quantity
    FROM PRODUCT p
        JOIN CATEGORY c ON c.categoryID = p.categoryID
        JOIN SUPPLIER s on s.supplierID = p.supplierID
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