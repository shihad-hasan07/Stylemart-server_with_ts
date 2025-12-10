import { Router } from "express";
import UserController from "./user.controller.js";
import upload from "../../middlewares/multer.middleware.js";
import { handleMulterError } from "../../middlewares/errorHandler.middleware.js";

const router = Router();

// router.get("/", UserController.getUsers);
router.get("/single", UserController.getSingleUser);

router.post("/create-user", UserController.createUser);

router.patch("/update/:id", (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        UserController.updateUser(req, res);
    });
});

router.delete("/delete/:id", UserController.deleteUser);

export default router;
