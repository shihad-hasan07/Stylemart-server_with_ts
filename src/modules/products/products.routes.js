import { Router } from "express";
import ProductsController from "./products.controller.js";

const router = Router();

router.get("/", ProductsController.getProducts);

router.post("/add-product", ProductsController.addProduct);

router.get("/single/:productId", ProductsController.getSingleProduct);

router.patch("/update/:productId", ProductsController.updateProduct);

router.delete("/delete/:productId", ProductsController.deleteProduct);

export default router;
