import express from 'express'
import { db } from '../database.js'

export const router = express.Router()

// Get all places from database
router.get('/places', async (req, res) => {
   
    const sql = `
    SELECT 
        * 
    FROM places
    ORDER BY placeId;
    `
    try {
        const [resultset] = await db.query(sql)
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }
})

// Get place from id
router.get('/places/:id', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT * FROM places
    WHERE 
        placeId = ?
    ;
    `
    let placeId = req.params.id

    let error = validateNumber(placeId, 'placeId')
    if (error) return res.status(400).json({ error })

    const placId = Number(placeId)

    error = validatePositiveNumber(placId, 'placeId')
    if (error) return res.status(400).json({ error })

    try {
        const [resultset] = await db.query(sql, [placeId])

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

// Get all users from database
router.get('/users', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
  SELECT 
    * 
  FROM users
  ORDER BY userId;
  `
   try {
        const [resultset] = await db.query(sql)

        if (resultset.length === 0) {
            return res.status(404).json({
                error: 'No users found'
            })
        }
        return res.json(resultset)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Database error'})
    }
})

// Get all places and which user has it on their wishlist, with status
router.get('/user-wishlist', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
      SELECT 
            p.placeId AS placeId,
            p.title AS place,
            p.description,
            p.status,
            u.userId AS userId,
            u.username AS name,
            u.role
        FROM places p
            JOIN users u ON p.userId = u.userId
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

//Filter result on places or description
router.get('/places-filter', async (req, res) => {
   
    //Prepare SQL 
    const sql = `
    SELECT 
        p.placeId AS placeId,
        p.title AS place,
        p.description,
        u.userId AS userId
    FROM places p
        JOIN users u ON p.userId = u.userId
        WHERE p.title LIKE ?
        OR p.description LIKE ? ;
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