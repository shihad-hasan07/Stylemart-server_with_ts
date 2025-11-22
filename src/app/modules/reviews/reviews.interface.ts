import type { Types } from "mongoose";

export interface IReview {
    productId: string;
    reviewerId: string;
    rating: number;
    comment: string;
}
