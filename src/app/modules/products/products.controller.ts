import type { Request, Response } from "express";
import ProductServices from "./products.service.js";


const ProductsController = {
    addProduct: async (req: Request, res: Response) => {
        try {
            const payload = req.body
            console.log('payload is ', payload);
            const result = await ProductServices.addProduct(payload)
            res.json({
                success: true,
                data: result
            })

        } catch (err) {
            res.status(500).json({
                success: false,
                error: err
            })
        }
    },


    getProducts: async (req: Request, res: Response) => {
        try {
            const result = await ProductServices.getProducts()
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

    deleteProduct: async (req: Request, res: Response) => {
        const { productId } = req.params
        if (!productId) {
            res.status(404).json({ error: "productId required" })
            return
        }
        const result = await ProductServices.deleteProduct(productId)
        try {
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

    updateProduct: async (req: Request, res: Response) => {
        const { productId } = req.params
        if (!productId) {
            res.status(404).json({ error: "productId required" })
            return
        }
        const result = await ProductServices.updateProduct(productId, req.body)
        try {
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


}

export default ProductsController