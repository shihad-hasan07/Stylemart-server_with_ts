// products.controller.js
import ProductServices from "./products.service.js";
import { apiError, apiSuccess } from "../../utlis/apiResponse.js";

const ProductsController = {
    addProduct: async (req, res) => {
        try {
            const result = await ProductServices.addProduct(req.body);
            return apiSuccess(res, result, "Product created successfully", 201);
        } catch (error) {
            return apiError(res, error, "Failed to create product");
        }
    },

    getProducts: async (req, res) => {
        try {
            const result = await ProductServices.getProducts();
            return apiSuccess(res, result);
        } catch (error) {
            return apiError(res, error, "Failed to fetch products");
        }
    },

    getSingleProduct: async (req, res) => {
        try {
            const result = await ProductServices.getSingleProduct(req.params.id);
            return apiSuccess(res, result);
        } catch (error) {
            return apiError(res, error, "Failed to fetch product");
        }
    },

    updateProduct: async (req, res) => {
        try {
            const result = await ProductServices.updateProduct(req.params.id, req.body);
            return apiSuccess(res, result, "Product updated");
        } catch (error) {
            return apiError(res, error, "Failed to update product");
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const result = await ProductServices.deleteProduct(req.params.id);
            return apiSuccess(res, result, "Product deleted");
        } catch (error) {
            return apiError(res, error, "Failed to delete product");
        }
    },
};

export default ProductsController;
