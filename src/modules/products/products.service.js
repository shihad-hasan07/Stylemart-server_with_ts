import { ProductsModel } from "./products.model.js";

const ProductServices = {
    addProduct: async (payload) => {
        return ProductsModel.create(payload);
    },

    getProducts: async () => {
        return ProductsModel.find();
    },

    getSingleProduct: async (id) => {
        return ProductsModel.findById(id);
    },

    deleteProduct: async (productId) => {
        return ProductsModel.findByIdAndDelete(productId);
    },

    updateProduct: async (productId, payload) => {
        return ProductsModel.findByIdAndUpdate(
            productId,
            { $set: payload },
            { new: true }
        );
    },
};

export default ProductServices;
