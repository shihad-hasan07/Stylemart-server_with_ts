import express, { type Application } from "express"
import cors from "cors"
import dotenv from 'dotenv'
import { ProductsRouter } from "./app/modules/products/products.routes.js"
import { ReviewRouter } from "./app/modules/reviews/reviews.routes.js"


const app: Application = express()

// core middlewares
app.use(cors())
dotenv.config()

// products routes
app.use('/v1/products', ProductsRouter)

// review Routes
app.use('/v1/review', ReviewRouter)


// test the server 
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' })
})

export default app