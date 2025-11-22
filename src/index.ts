import express, { type Application } from "express"
import cors from "cors"
import dotenv from 'dotenv'
import { ProductsRouter } from "./app/modules/products/products.routes.js"
import { ReviewRouter } from "./app/modules/reviews/reviews.routes.js"


const app: Application = express()

// core middlewares
app.use(cors())
dotenv.config()
app.use(express.json())

// products routes
app.use('/product', ProductsRouter)

// review Routes
app.use('/review', ReviewRouter)


// test the server 
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' })
})

export default app