import ProductServices from "./products.service.js";
import { apiError, apiSuccess } from "../../utlis/apiResponse.js";
import { uploadOnCloudinary } from "../../utlis/cloudinary.utils.js";

const ProductsController = {
    addProduct: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one image is required",
                });
            }
            if (!req.body.data) {
                return res.status(400).json({
                    success: false,
                    message: "Product data is missing",
                });
            }

            const parsedData = JSON.parse(req.body.data);
            const finalData = {
                ...parsedData,
                images: [],
            };

            // Upload images to Cloudinary
            for (const file of req.files) {
                const uploaded = await uploadOnCloudinary(file.path);

                if (!uploaded) {
                    return res.status(500).json({
                        success: false,
                        message: "Image upload failed",
                    });
                }

                finalData.images.push({
                    url: uploaded.secure_url,
                    publicId: uploaded.public_id,
                });
            }

            const result = await ProductServices.addProduct(finalData);
            return res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: result,
            });

        } catch (error) {
            console.error("Add product error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to create product",
            });
        }
    },

    getProducts: async (req, res) => {
        try {
            // const page = Math.max(Number(req.query.page) || 1, 1);
            // const limit = Math.min(Number(req.query.limit) || 12, 40);
            // const result = await ProductServices.getProducts({ page, limit });
            const result = await ProductServices.getProducts();

            return apiSuccess(res, result);
        } catch (error) {
            return apiError(res, error, "Failed to fetch products");
        }
    },

    getSingleProduct: async (req, res) => {
        try {
            const result = await ProductServices.getSingleProduct(req.params.productId);

            if (!result) {
                return apiError(res, null, "Product not found", 404);
            }

            return apiSuccess(res, result);
        } catch (error) {
            return apiError(res, error, "Invalid product id or server error", 400);
        }
    },

    getMultipleProduct: async (req, res) => {
        try {
            const { ids } = req.query;

            if (!ids) {
                return apiError(res, null, "Product ids are required", 400);
            }
            const idArray = ids.split(",");

            const result = await ProductServices.getMultipleProducts(idArray)

            return apiSuccess(res, result, "Multiple product fetched successfully")
        } catch (error) {
            return apiError(res, error, "Failed to get multiple Products")
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { productId } = req.params;

            // Product data missing check
            if (!req.body.data) {
                return res.status(400).json({
                    success: false,
                    message: "Product data is missing",
                });
            }

            const parsedData = JSON.parse(req.body.data);

            // Existing images parse (ager images jegula keep korbe)
            const existingImages = req.body.existingImages
                ? JSON.parse(req.body.existingImages)
                : [];

            // Validation: Minimum 1 image thakte hobe (existing + new)
            const totalImages = existingImages.length + (req.files?.length || 0);
            if (totalImages === 0) {
                return res.status(400).json({
                    success: false,
                    message: "At least one image is required",
                });
            }

            // Maximum 4 images allowed
            if (totalImages > 4) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum 4 images allowed",
                });
            }

            // Final data prepare
            const finalData = {
                ...parsedData,
                images: [],
            };

            // 1. Existing images add (jegula already Cloudinary te uploaded)
            existingImages.forEach(url => {
                // URL theke publicId extract (if needed for future deletion)
                const publicId = url.split('/').slice(-2).join('/').split('.')[0];
                finalData.images.push({
                    url: url,
                    publicId: publicId,
                });
            });

            // 2. New images upload to Cloudinary
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const uploaded = await uploadOnCloudinary(file.path);

                    if (!uploaded) {
                        return res.status(500).json({
                            success: false,
                            message: "Image upload failed",
                        });
                    }

                    finalData.images.push({
                        url: uploaded.secure_url,
                        publicId: uploaded.public_id,
                    });
                }
            }

            // Update service call
            const result = await ProductServices.updateProduct(productId, finalData);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: result,
            });

        } catch (error) {
            console.error("Update product error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to update product",
            });
        }
    },


    deleteProduct: async (req, res) => {
        try {
            const result = await ProductServices.deleteProduct(req.params.productId);
            return apiSuccess(res, result, "Product deleted");
        } catch (error) {
            return apiError(res, error, "Failed to delete product");
        }
    },
};

export default ProductsController;
