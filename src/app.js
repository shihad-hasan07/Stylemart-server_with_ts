import express from "express";
import cors from "cors";

import ProductsRouter from "./modules/products/products.routes.js";
import UserRouter from "./modules/users/user.routes.js";
import ReviewRouter from "./modules/reviews/reviews.routes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// user routes
app.use('/api/v1/users', UserRouter);

// products routes
app.use('/api/v1/products', ProductsRouter);

// review routes
app.use('/api/v1/reviews', ReviewRouter);

// test the server
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Stylemart server is running' });
});

export default app;
