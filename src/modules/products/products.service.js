import { deleteFromCloudinary } from "../../utlis/cloudinary.utils.js";
import { ProductsModel } from "./products.model.js";

const ProductServices = {
    addProduct: async (payload) => {
        return ProductsModel.create(payload);
    },

    getProducts: async () => {
        const products = await ProductsModel.find().lean();

        const productsForClient = products.map(product => ({
            ...product,
            images: product.images.map(img =>
                typeof img === "string" ? img : img.url
            ),
        }));

        return {
            products: productsForClient,
        };
    },


    getSingleProduct: async (id) => {
        const product = await ProductsModel.findById(id).lean();
        if (!product) return null;

        return {
            ...product,
            images: product.images.map(img =>
                typeof img === "string" ? img : img.url
            ),
        };
    },

    getMultipleProducts: async (ids) => {
        const products = await ProductsModel.find({
            _id: { $in: ids },
        }).lean();

        const productsForClient = products.map(product => ({
            ...product,
            images: product.images.map(img =>
                typeof img === "string" ? img : img.url
            ),
        }));
        return productsForClient
    },


    deleteProduct: async (productId) => {
        const product = await ProductsModel.findById(productId);
        if (!product) return null;

        if (Array.isArray(product.images)) {
            for (const img of product.images) {
                if (img?.publicId) {
                    await deleteFromCloudinary(img.publicId);
                }
            }
        }

        await product.deleteOne();
        return product;
    },
    updateProduct: async (productId, payload) => {
        const updated = await ProductsModel.findByIdAndUpdate(
            productId,
            { $set: payload },
            { new: true }
        ).lean();

        if (!updated) return null;

        // Client er jonno image format correct kora
        const productForClient = {
            ...updated,
            images: updated.images.map(img =>
                typeof img === "string" ? img : img.url
            ),
        };

        return productForClient;
    },
};

export default ProductServices;
