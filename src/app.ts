import express, { type Application } from "express"
import cors from "cors"
// import dotenv from 'dotenv'
import ProductsRouter from "./modules/products/products.routes.js"
import UserRouter from "./modules/users/user.routes.js"
import { ReviewRouter } from "./modules/reviews/reviews.routes.js"


const app: Application = express()

// core middlewares
app.use(cors())
// dotenv.config()
app.use(express.json())

// user routes
app.use('/api/v1/users', UserRouter)

// products routes
app.use('/api/v1/products', ProductsRouter)

// review Routes
app.use('/api/v1/reviews', ReviewRouter)



// test the server 
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Stylemart server is running' })
})

export default app