import { apiError, apiSuccess } from "../../utlis/apiResponse.js";
import { ProductsModel } from "../products/products.model.js";
import { OrderModel } from "./order.model.js";


// Create New Order
export const createOrder = async (req, res) => {
    try {
        const {
            userId,
            name,
            phone, // NEW
            streetAddress,
            city,
            district,
            email,
            orderNotes,
            advancePaymentType,
            paymentMethod, // NEW
            senderNumber,
            transactionId,
            products,
            deliveryCharge = 0
        } = req.body;

        // Validation
        if (!userId) {
            return apiError(res, null, "User ID is required", 400);
        }

        if (!name || !phone || !streetAddress || !city || !district) {
            return apiError(res, null, "Please provide all required customer information", 400);
        }

        if (!paymentMethod || !['bkash', 'nagad'].includes(paymentMethod)) {
            return apiError(res, null, "Please select valid payment method (bkash or nagad)", 400);
        }

        if (!senderNumber || !transactionId) {
            return apiError(res, null, "Please provide payment information", 400);
        }

        if (!products || products.length === 0) {
            return apiError(res, null, "Cart is empty", 400);
        }

        // Verify products and calculate pricing
        let subtotal = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await ProductsModel.findById(item.productId);

            if (!product) {
                return apiError(res, null, `Product not found`, 404);
            }

            if (!product.stock.inStock || product.stock.quantity < item.quantity) {
                return apiError(res, null, `${product.name} is out of stock or insufficient quantity`, 400);
            }

            // Get actual price (sale price or regular price)
            const actualPrice = product.sale?.active ? product.sale.price : product.price;
            const itemTotal = actualPrice * item.quantity;
            subtotal += itemTotal;

            // Get first image URL
            const imageUrl = product.images?.[0]?.url || '';

            orderProducts.push({
                productId: product._id,
                name: product.name,
                slug: product.slug,
                image: imageUrl,
                selectedColor: item.selectedColor || null,
                selectedSize: item.selectedSize || null,
                quantity: item.quantity,
                price: actualPrice
            });
        }

        const total = subtotal + deliveryCharge;

        // Calculate advance and payable on delivery
        const minimumAdvance = 130;
        const advanceAmount = advancePaymentType === "full" ? total : minimumAdvance;
        const payableOnDelivery = total - advanceAmount;

        // Create order
        const newOrder = new OrderModel({
            userId,
            customerInfo: {
                name,
                phone, // NEW
                streetAddress,
                city,
                district,
                email,
                orderNotes
            },
            paymentInfo: {
                advancePaymentType,
                paymentMethod, // NEW
                senderNumber,
                transactionId,
                advanceAmount,
                payableOnDelivery
            },
            products: orderProducts,
            pricing: {
                subtotal,
                deliveryCharge,
                total
            }
        });

        await newOrder.save();

        // Update product stock and cart count
        for (const item of products) {
            await ProductsModel.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        'stock.quantity': -item.quantity,
                        cartCount: -1
                    }
                }
            );
        }

        const responseData = {
            orderNumber: newOrder.orderNumber,
            orderId: newOrder._id,
            total: newOrder.pricing.total,
            advanceAmount: newOrder.paymentInfo.advanceAmount,
            payableOnDelivery: newOrder.paymentInfo.payableOnDelivery
        };

        return apiSuccess(res, responseData, "Order placed successfully", 201);

    } catch (error) {
        console.error("Create Order Error:", error);
        return apiError(res, error, "Failed to create order", 500);
    }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = status ? { orderStatus: status } : {};

        const orders = await OrderModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('products.productId', 'name brand');

        const count = await OrderModel.countDocuments(filter);

        const responseData = {
            orders,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: Number(page),
                totalOrders: count
            }
        };

        return apiSuccess(res, responseData, "Orders fetched successfully");

    } catch (error) {
        console.error("Get Orders Error:", error);
        return apiError(res, error, "Failed to fetch orders", 500);
    }
};

// Get Single Order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await OrderModel.findById(orderId)
            .populate('products.productId', 'name brand images');

        if (!order) {
            return apiError(res, null, "Order not found", 404);
        }

        return apiSuccess(res, order, "Order fetched successfully");

    } catch (error) {
        console.error("Get Order Error:", error);
        return apiError(res, error, "Invalid order id or server error", 400);
    }
};

// Get Order by Order Number
export const getOrderByOrderNumber = async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const order = await OrderModel.findOne({ orderNumber })
            .populate('products.productId', 'name brand images');

        if (!order) {
            return apiError(res, null, "Order not found", 404);
        }

        return apiSuccess(res, order, "Order fetched successfully");

    } catch (error) {
        console.error("Get Order Error:", error);
        return apiError(res, error, "Failed to fetch order", 500);
    }
};

// Get Orders by User ID (For User Dashboard)
export const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        const filter = { userId };
        if (status) filter.orderStatus = status;

        const orders = await OrderModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('products.productId', 'name brand');

        const count = await OrderModel.countDocuments(filter);

        const responseData = {
            orders,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: Number(page),
                totalOrders: count
            }
        };

        return apiSuccess(res, responseData, "Orders fetched successfully");

    } catch (error) {
        console.error("Get User Orders Error:", error);
        return apiError(res, error, "Failed to fetch orders", 500);
    }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(orderStatus)) {
            return apiError(res, null, "Invalid order status", 400);
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return apiError(res, null, "Order not found", 404);
        }

        return apiSuccess(res, order, "Order status updated successfully");

    } catch (error) {
        console.error("Update Order Status Error:", error);
        return apiError(res, error, "Failed to update order status", 500);
    }
};

// Update Payment Status (Admin)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus } = req.body;

        const validStatuses = ['pending', 'verified', 'failed'];

        if (!validStatuses.includes(paymentStatus)) {
            return apiError(res, null, "Invalid payment status", 400);
        }

        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            { 'paymentInfo.paymentStatus': paymentStatus },
            { new: true }
        );

        if (!order) {
            return apiError(res, null, "Order not found", 404);
        }

        return apiSuccess(res, order, "Payment status updated successfully");

    } catch (error) {
        console.error("Update Payment Status Error:", error);
        return apiError(res, error, "Failed to update payment status", 500);
    }
};

// Delete Order (Admin)
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return apiError(res, null, "Order not found", 404);
        }

        // Restore product stock if order is being deleted
        for (const item of order.products) {
            await ProductsModel.findByIdAndUpdate(
                item.productId,
                {
                    $inc: {
                        'stock.quantity': item.quantity
                    }
                }
            );
        }

        await OrderModel.findByIdAndDelete(orderId);

        return apiSuccess(res, null, "Order deleted successfully");

    } catch (error) {
        console.error("Delete Order Error:", error);
        return apiError(res, error, "Failed to delete order", 500);
    }
};