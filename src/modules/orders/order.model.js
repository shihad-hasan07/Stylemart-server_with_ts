import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
    // User Reference
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    // Customer Information
    customerInfo: {
        name: { type: String, required: true },
        phone: { type: String, required: true }, // NEW - Customer contact number
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        email: { type: String },
        orderNotes: { type: String }
    },

    // Payment Information
    paymentInfo: {
        advancePaymentType: {
            type: String,
            enum: ['partial', 'full'],
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['bkash', 'nagad'],
            required: true
        }, // NEW - Payment method
        senderNumber: { type: String, required: true },
        transactionId: { type: String, required: true },
        advanceAmount: { type: Number, required: true },
        payableOnDelivery: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ['pending', 'verified', 'failed'],
            default: 'pending'
        }
    },

    // Order Items
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            name: { type: String, required: true },
            slug: { type: String, required: true },
            image: { type: String, required: true },
            selectedColor: { type: String },
            selectedSize: { type: String },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],

    // Price Details
    pricing: {
        subtotal: { type: Number, required: true },
        deliveryCharge: { type: Number, default: 0 },
        total: { type: Number, required: true }
    },

    // Order Status
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Order Number
    orderNumber: {
        type: String,
        unique: true
    }

}, {
    timestamps: true
});

// Auto-generate order number before saving
OrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        let orderNumber;
        let isUnique = false;

        while (!isUnique) {
            // Generate random 5 digit number (10000 to 99999)
            const randomNum = Math.floor(10000 + Math.random() * 90000);
            orderNumber = `ORD-${randomNum}`;

            // Check if this number already exists
            const existing = await model('orders').findOne({ orderNumber });
            if (!existing) {
                isUnique = true;
            }
        }

        this.orderNumber = orderNumber;
    }
    next();
});

export const OrderModel = model("orders", OrderSchema);