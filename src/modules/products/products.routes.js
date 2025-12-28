import { Router } from "express";
import ProductsController from "./products.controller.js";
import { requireRole } from "../../middlewares/verify_multi_role.js";
import { verifyFirebaseToken_andUser } from "../../middlewares/verifyFirebaseToken_andUser.js";
import upload from "../../middlewares/multer.middleware.js";
import { handleMulterError } from "../../middlewares/errorHandler.middleware.js";

const router = Router();

router.get("/", ProductsController.getProducts);

router.post("/add-product", verifyFirebaseToken_andUser, requireRole('admin', 'manager'), (req, res, next) => {
    upload.array('images', 4)(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next)
        ProductsController.addProduct(req, res)
    })
})

router.get("/single/:productId", ProductsController.getSingleProduct);

router.get("/multiple", ProductsController.getMultipleProduct);

// router.patch("/update/:productId", ProductsController.updateProduct);

router.patch("/update/:productId", verifyFirebaseToken_andUser, (req, res, next) => {
    upload.array('images', 4)(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        ProductsController.updateProduct(req, res);
    });
});


router.delete("/delete/:productId", verifyFirebaseToken_andUser, requireRole('admin'), ProductsController.deleteProduct);

export default router;
