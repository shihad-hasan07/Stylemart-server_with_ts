import type { Request, Response } from "express";
import { ReviewServices } from "./reviews.service.js";

export const ReviewsController = {
    addReview: async (req: Request, res: Response) => {
        try {
            const payload = req.body
            const result = await ReviewServices.addReview(payload)
            res.json({
                success: true,
                data: result
            })

        } catch (err) {
            res.status(500).json({
                success: false
            })
        }
    },


    getReviewByProductID: async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            if (!productId) {
                res.status(400).json({ error: "productId is required" });
                return;
            }

            const result = await ReviewServices.getReviewsByProductId(productId);
            res.json({
                success: true,
                data: result
            });

        } catch (err: unknown) {
            // const error = err as Error
            // res.status(500).json({ error: error.message });

            res.status(500).json({
                success: false
            });
        }
    },


    deleteReview: async (req: Request, res: Response) => {
        try {
            const { reviewId } = req.params
            if (!reviewId) {
                res.status(400).json({ error: "reviewId is required" });
                return;
            }

            const result = await ReviewServices.deleteReview(reviewId)
            res.json({
                success: true,
                data: result
            });

        } catch (error) {
            res.status(500).json({
                success: false
            });
        }
    },


    updateReview: async (req: Request, res: Response) => {
        try {
            const { reviewId } = req.params
            if (!reviewId) {
                res.status(400).json({ error: "reviewId is required" });
                return
            }

            const result = await ReviewServices.updateReview(reviewId, req.body)
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false
            });
        }
    }


}