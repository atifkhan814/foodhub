
import Order from "../models/order.models.js";

// Process a demo payment
export const processDemoPayment = async (req, res) => {
  try {
    const { orderId, paymentResult } = req.body;

    // Validate order ID
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    // Find the order belonging to the logged-in customer
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Check payment method
    if (order.paymentMethod !== "Stripe Demo") {
      return res.status(400).json({
        success: false,
        message: "This order does not use Stripe Demo.",
      });
    }

    // Prevent duplicate payment processing
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This order has already been paid.",
      });
    }

    // Validate simulated payment result
    if (!["success", "failure"].includes(paymentResult)) {
      return res.status(400).json({
        success: false,
        message: "Invalid demo payment result.",
      });
    }

    // Simulate successful or failed payment
    if (paymentResult === "success") {
      order.paymentStatus = "Paid";
    } else {
      order.paymentStatus = "Failed";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        paymentResult === "success"
          ? "Demo payment successful!"
          : "Demo payment failed.",
      data: order,
    });

  } catch (error) {
    console.error("Demo payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process demo payment.",
    });
  }
};
