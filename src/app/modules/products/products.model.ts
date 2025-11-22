import { Schema, model } from "mongoose";
import type { IProduct } from "./products.interface.js";

const ProductsSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    slug: { type: String, required: true, },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    sale: {
        active: { type: Boolean, default: false },
        price: { type: Number },
        ends: { type: String }
    },

    images: { type: [String], required: true },
    categories: { type: [String], required: true },
    tags: { type: [String], required: true },

    rating: {
        average: { type: Number },
        count: { type: Number }
    },

    stock: {
        inStock: { type: Boolean, required: true },
        quantity: { type: Number }
    },

    variations: [
        {
            attribute: { type: String },
            options: { type: [String] }
        }
    ],

    cartCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

export const ProductsModel = model<IProduct>("products", ProductsSchema);