import express from 'express'
import { db } from '../database.js'
import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware.js'
import { jwtMiddleware } from '../middleware/jwtMiddleware.js'

export const router = express.Router()

// Create new place. An admin can update any place, a user can only create their own
router.post('/places', jwtMiddleware, async (req, res) => {
    const payload = res.locals.payload
    const role = payload.role
    const authUserId = payload.userId

    const place = req.body

    if (!place.title || !place.description ||! place.status) {
        return res.status(400).json({ message: 'title, description and status are required'})
    }

    const validStatuses = ['wishlist', 'planned', 'visited', 'cancelled']
    if (!validStatuses.includes(place.status)) {
        return res.status(400).json({ message: 'Invalid status' })
    }

    let ownerUserId = authUserId
    if (role === 'admin' && place.userId !== undefined) {
        ownerUserId = Number(place.userId)
        if (!Number.isInteger(ownerUserId) || ownerUserId <= 0) {
            return res.status(400).json({ message: 'userId must be a positive integer'})
        }
    }

    console.log(authUserId)
    
    const sql = `
    INSERT INTO places (title, description, status, userId)
    VALUES (?, ?, ?, ?)
    `
    const [resultset] = await db.query(sql, [
        place.title,
        place.description,
        place.status,
        ownerUserId
    ])
    
    const [newRows] = await db.query(`SELECT * FROM places WHERE placeId = ?`, [resultset.insertId])
    return res.status(201).json(newRows[0])
})

// Update all details on a place. An admin can update any place, a user can only update their own
router.put('/places/:id', jwtMiddleware, async (req, res) => {
    const { role, userId} = res.locals.payload
    const placeId = Number(req.params.id)
    const place = req.body

    if (!Number.isInteger(placeId) || placeId <= 0) {
        return res.status(400).json({ message: 'Invalid placeId' })
    }
    
    if (!place.title || !place.description || !place.status){
        return res.status(400).json({ message: 'title description and status are required'})
    }

    const validStatuses = ['wishlist', 'planned', 'visited', 'cancelled']
    if (!validStatuses.includes(place.status)){
        return res.status(400).json({ message: 'Invalid status'})
    }

    const isAdmin = role === 'admin'

    try {
        if (!isAdmin) {
            const [rows] = await db.query(`SELECT userId FROM places WHERE placeId = ?`, [placeId])

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Place not found'})
            }

            if (rows[0].userId !== userId) {
                return res.status(403).json({ message: 'Permission denied'})
            }
        }
        
        const sql = isAdmin
        ?   `
        UPDATE places
        SET title = ?, description = ?, status =?
        WHERE placeId = ?
        `
    :   `
        UPDATE places
        SET title = ?, description = ?, status =?
        WHERE placeId = ? AND userId = ?
        `
    const values = [place.title, place.description, place.status, placeId]
    if (!isAdmin) values.push(userId)

    const [resultset] = await db.query(sql, values)

    if (resultset.affectedRows === 0) {
        return res.status(404).json({message: 'Place not found'})
    }
    

    const sql1 = `SELECT * FROM places where placeId = ?`
    const [updatedPlace] = await db.query(sql1, [placeId])
    
    res.json(updatedPlace[0])
    } catch (err) {
        console.log(err)
    return res.status(500).json({ message: 'Database error' })
    }
    
    
})

// Update some details on a place. An admin can update any place, a user can only update their own
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

// Delete place. An admin can delete any place, a user can only delete their own
router.delete('/places/:id', jwtMiddleware, async (req, res) => {
  const payload = res.locals.payload
  const role = payload.role
  const userId = payload.userId
  const placeId = Number(req.params.id)

  if (!Number.isInteger(placeId) || placeId <= 0) {
    return res.status(400).json({ message: 'Invalid placeId' })
  }

  // Admin: delete by id only
  if (role === 'admin') {
    const [resultset] = await db.query(
      `DELETE FROM places WHERE placeId = ?`,
      [placeId]
    )

    if (resultset.affectedRows === 0) {
      return res.status(404).json({ message: `Place with ID ${placeId} not found` })
    }

    return res.status(204).send()
  }

  // User: must own the place
  const [rows] = await db.query(
    `SELECT userId FROM places WHERE placeId = ?`,
    [placeId]
  )

  if (rows.length === 0) {
    return res.status(404).json({ message: `Place with ID ${placeId} not found` })
  }

  if (rows[0].userId !== userId) {
    return res.status(403).json({ message: 'Permission denied' })
  }

  const [resultset] = await db.query(
    `DELETE FROM places WHERE placeId = ?`,
    [placeId]
  )

  return res.status(204).send()
})



