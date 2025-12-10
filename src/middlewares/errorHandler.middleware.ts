
import type { NextFunction, Request, Response } from "express";
import multer from "multer";

export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: err.message });
    }

    if (err && err.message === "INVALID_FILE_TYPE") {
        return res.status(400).json({
            success: false,
            message: "INVALID_FILE_TYPE",
        });
    }

    next(err);
};
