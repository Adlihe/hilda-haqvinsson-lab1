import express from 'express'
import { db } from '../database.js'
import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware.js'
import { jwtMiddleware } from '../middleware/jwtMiddleware.js'

export const router = express.Router()

// Create new place
router.post('/places', jwtMiddleware, async (req, res) => {
    const place = req.body
    console.log(place.title)
    
    const sql = `
    INSERT INTO places (title, description, status, userId)
    VALUES (?, ?, ?, ?)
    `
    const [resultset] = await db.query(sql, [
        place.title,
        place.description,
        place.status,
        place.userId
    ])
    
    const sql1 = `SELECT * FROM places where placeId = ?`
    const [newPlace] = await db.query(sql1, [resultset.insertId])
    
    res.status(201).json(...newPlace)
})

// Update all details on a place
router.put('/places/:id', jwtMiddleware, async (req, res) => {
    //const userId = res.locals.payload.userId
    const role = res.locals.payload.role
    const place = req.body
    const placeId = req.params.id
    
    
    if (role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied'})
    } else {
        const sql = `
    UPDATE places
    SET title = ?, description = ?, status =?
    WHERE placeId = ?
    `
    const [resultset] = await db.query(sql, [
        place.title,
        place.description,
        place.status,
        placeId
    ])
    
    if (resultset.affectedRows === 0) {
        return res.status(404).json({message: 'Place not found'})
    }
    
    const sql1 = `SELECT * FROM places where placeId = ?`
    const [updatedPlace] = await db.query(sql1, [placeId])
    
    res.json(updatedPlace[0])
    }
    
})

// Update some details on a place
router.patch('/places/:id', jwtMiddleware, async (req, res) => {
    const userId = res.locals.payload.userId
    const role = res.locals.payload.role
    const placeId = req.params.id
    const body = req.body

    
    const allowedFields = ['title', 'description', 'status']
    const setParts = []
    const values = []

    for (const field of allowedFields){
        if (body[field] !== undefined) {
            setParts.push(`${field} = ?`)
            values.push(body[field])
        }
    }

    if (setParts.length === 0) {
        return res.status(400).json({ message: 'No valid fields to update'})
    }

    const validStatuses = ['wishlist', 'planned', 'visited', 'cancelled']
    if (body.status !== undefined && !validStatuses.includes(body.status)) {
        return res.status(400).json({ message: 'Invalid status' })
    }

    const isAdmin = role === 'admin'
    
    const sql = isAdmin
    ? `
      UPDATE places
      SET ${setParts.join(', ')}
      WHERE placeId = ?
    `
    : `
      UPDATE places
      SET ${setParts.join(', ')}
      WHERE placeId = ? AND userId = ?
    `

    try {
        values.push(placeId)
        if (!isAdmin) values.push(userId)

        const [resultset] = await db.query(sql, values)

    if (resultset.affectedRows === 0) {
        return res.status(404).json({message: 'Place not found'})
    }

    const [updatedRows] = await db.query(`SELECT * FROM places WHERE placeId = ?`, [placeId])
    return res.json(updatedRows[0])

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Database error'})
    }

})

// Delete place
router.delete('/places/:id', jwtMiddleware, async (req, res) => {
    const placeId = req.params.id
    
    const sql = `DELETE FROM places WHERE placeId = ?`
    const [resultset] = await db.query(sql, [
        placeId
    ])

    if (resultset.affectedRows === 0) {
        return res.status(404).json({message: 'Place not found'})
    }
    
    res.status(204).send()
})



