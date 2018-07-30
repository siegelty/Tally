// poll.ts routes
import * as express from 'express'

// Initialize the router for this instance
export const poll_router = express.Router();

poll_router.get('/', (req, res) => {
    res.json({
        message: 'This route was linked correctly'
    })
})

poll_router.get('/new', (req, res) => {
    res.json({
        message: 'A new Route was created'
    })
})

