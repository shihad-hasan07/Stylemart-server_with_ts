import { Schema, model } from "mongoose";

const ProductsSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
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
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },

    stock: {
        inStock: { type: Boolean, required: true },
        quantity: { type: Number, default: 0 }
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

export const ProductsModel = model("products", ProductsSchema);
