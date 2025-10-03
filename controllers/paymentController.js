const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});
// Create payment order
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: amount * 100, // amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        
        res.status(200).json({
            status: 200,
            data: order
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.status(200).json({
                status: 200,
                message: "Payment verified successfully",
                paymentId: razorpay_payment_id
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "Invalid signature"
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};