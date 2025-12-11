import { Schema, model } from "mongoose";

const ProductsSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    sortDescription: { type: String },

    price: { type: Number, required: true },

    sale: {
        active: { type: Boolean, default: false },
        price: { type: Number, default: null },
        ends: { type: String, default: null }
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
            _id: false,
            attribute: { type: String, required: true },
            options: { type: [String], default: [] }
        }
    ],

    cartCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    sku: { type: String }
}, {
    timestamps: true
});

export const ProductsModel = model("products", ProductsSchema);
