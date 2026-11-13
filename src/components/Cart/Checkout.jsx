
import { useState } from 'react';
import { useCart } from '../../context/useCart';
import toast from 'react-hot-toast';
import './Checkout.css';

function Checkout({ cartitems = [] }) {
  const { clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [placedTotal, setPlacedTotal] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert the food price into a number
  function getPrice(food) {
    const rawPrice =
      food?.price ??
      food?.foodPrice ??
      food?.product?.price;

    if (rawPrice === undefined || rawPrice === null) {
      return 0;
    }

    const price =
      typeof rawPrice === 'object'
        ? Number(rawPrice.$numberDecimal ?? rawPrice.value)
        : Number(String(rawPrice).replace('$', '').trim());

    return Number.isFinite(price) ? price : 0;
  }

  // Calculate the total from individual food prices
  const calculatedTotal = cartitems.reduce(
    (total, food) => total + getPrice(food),
    0
  );

  const finalTotal = calculatedTotal;

  // Update customer fields
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Update card fields
  function handleCardChange(event) {
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === 'cardNumber') {
      updatedValue = value.replace(/\D/g, '').slice(0, 19);
    }

    if (name === 'expiryDate') {
      updatedValue = value.replace(/\D/g, '').slice(0, 4);

      if (updatedValue.length >= 3) {
        updatedValue =
          updatedValue.slice(0, 2) +
          '/' +
          updatedValue.slice(2);
      }
    }

    if (name === 'cvv') {
      updatedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData((previousData) => ({
      ...previousData,
      [name]: updatedValue,
    }));
  }

  // Validate the card details locally
  function validateCardDetails() {
    if (!cardData.cardholderName.trim()) {
      toast.error('Please enter the cardholder name.');
      return false;
    }

    const cardNumber = cardData.cardNumber.replace(/\D/g, '');

    if (!/^\d{16}$/.test(cardNumber)) {
      toast.error('Please enter a valid 16-digit demo card number.');
      return false;
    }

    // Only these two cards are supported in our local demo
    const supportedDemoCards = [
      '4242424242424242',
      '4000000000000002',
    ];

    if (!supportedDemoCards.includes(cardNumber)) {
      toast.error('Please use one of the supported demo card numbers.');
      return false;
    }

    const [month, year] = cardData.expiryDate.split('/');
    const expiryMonth = Number(month);
    const expiryYear = Number(`20${year}`);

    if (
      !/^\d{2}\/\d{2}$/.test(cardData.expiryDate) ||
      expiryMonth < 1 ||
      expiryMonth > 12
    ) {
      toast.error('Please enter a valid expiry date in MM/YY format.');
      return false;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      toast.error('Your card expiry date has passed.');
      return false;
    }

    if (!/^\d{3,4}$/.test(cardData.cvv)) {
      toast.error('Please enter a valid 3 or 4-digit CVV.');
      return false;
    }

    return true;
  }

  // Submit the order to the backend
  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    if (cartitems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const requiredFields = [
      formData.fullName,
      formData.phone,
      formData.email,
      formData.address,
      formData.city,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    // Validate card details before creating an online payment order
    if (
      formData.paymentMethod === 'Stripe Demo' &&
      !validateCardDetails()
    ) {
      return;
    }

    const orderItems = cartitems.map((food) => ({
      foodId: String(food._id || food.id || ''),
    }));

    if (orderItems.some((item) => !item.foodId)) {
      toast.error('A food item is missing its ID. Please add it again.');
      return;
    }

    // Do not submit an order with invalid or missing prices
    if (cartitems.some((food) => getPrice(food) <= 0)) {
      toast.error(
        'A food item has an invalid price. Please remove it and add it again.'
      );
      console.error('Cart items with invalid prices:', cartitems);
      return;
    }

    setIsSubmitting(true);

    try {
      // STEP 1: Create the order
      const response = await fetch(
        'http://localhost:8000/api/orders',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer: {
              fullName: formData.fullName.trim(),
              phone: formData.phone.trim(),
              email: formData.email.trim(),
              address: formData.address.trim(),
              city: formData.city.trim(),
              notes: formData.notes.trim(),
            },
            items: orderItems,
            paymentMethod: formData.paymentMethod,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Unable to place your order.'
        );
      }

      // STEP 2: Get the created order
      const createdOrder = result.data;

      setOrderNumber(createdOrder.orderNumber);
      setPlacedTotal(Number(createdOrder.total));

      let finalPaymentStatus =
        createdOrder.paymentStatus || 'Unpaid';

      // STEP 3: Process demo payment
      if (formData.paymentMethod === 'Stripe Demo') {
        const cardNumber = cardData.cardNumber.replace(/\D/g, '');

        // Determine the simulated payment result
        const paymentResult = cardNumber === '4242424242424242'
          ? 'success'
          : 'failure';

        const paymentResponse = await fetch(
          'http://localhost:8000/api/payments/demo',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: createdOrder._id,
              paymentResult,
            }),
          }
        );

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok || !paymentData.success) {
          throw new Error(
            paymentData.message || 'Unable to process demo payment.'
          );
        }

        finalPaymentStatus =
          paymentData.data.paymentStatus;

        if (finalPaymentStatus === 'Paid') {
          toast.success('Demo payment successful!');
        } else {
          toast.error('Demo payment failed. Please try another demo card.');
        }
      } else {
        toast.success('Order placed successfully!');
      }

      // STEP 4: Update the confirmation screen
      setPaymentStatus(finalPaymentStatus);
      setOrderPlaced(true);

      // Clear card details from frontend state
      setCardData({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      });

      clearCart();

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Display the confirmation message after backend response
  if (orderPlaced) {
    return (
      <section className="checkout-section">
        <div className="checkout-success">
          <div className="success-icon">
            {paymentStatus === 'Failed' ? '!' : '✓'}
          </div>

          <h2>
            {paymentStatus === 'Failed'
              ? 'Order Created — Payment Failed'
              : 'Order Placed Successfully!'}
          </h2>

          <p>
            Thank you, {formData.fullName}. Your order has been received.
          </p>

          <p className="success-order-number">
            Order Number: <strong>{orderNumber}</strong>
          </p>

          <div className="order-success-details">
            <p>
              Payment Method: <strong>{formData.paymentMethod}</strong>
            </p>

            <p>
              Total Amount: <strong>${placedTotal.toFixed(2)}</strong>
            </p>

            <p>
              Payment Status: <strong>{paymentStatus}</strong>
            </p>
          </div>

          <button
            type="button"
            className="checkout-home-button"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-section">
      <div className="checkout-heading">
        <span className="checkout-eyebrow">FOODHUB CHECKOUT</span>

        <h2>Complete Your Order</h2>

        <p>
          Enter your delivery details and review your order
          before placing it.
        </p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">
          <div className="checkout-card-heading">
            <div className="checkout-step">01</div>

            <div>
              <h3>Customer Details</h3>
              <p>Please provide your information for delivery.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="checkout-fields">
              <div className="checkout-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="checkout-field checkout-field-full">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="checkout-field checkout-field-full">
                <label htmlFor="address">Delivery Address</label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="checkout-field checkout-field-full">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  autoComplete="address-level2"
                  required
                />
              </div>

              <div className="checkout-field checkout-field-full">
                <label htmlFor="notes">
                  Additional Notes (Optional)
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special delivery instructions?"
                  rows={3}
                />
              </div>
            </div>

            <div className="payment-heading">
              <h3>Payment Method</h3>
            </div>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={formData.paymentMethod === 'Cash on Delivery'}
                onChange={handleChange}
              />

              <span>
                <strong>Cash on Delivery</strong>
                <small>
                  Pay when your order arrives at your address.
                </small>
              </span>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="Stripe Demo"
                checked={formData.paymentMethod === 'Stripe Demo'}
                onChange={handleChange}
              />

              <span>
                <strong>Debit / Credit Card (Demo)</strong>
                <small>
                  Enter simulated card details to complete your demo payment.
                </small>
              </span>
            </label>

            {formData.paymentMethod === 'Stripe Demo' && (
              <div className="checkout-fields" style={{ marginTop: '20px' }}>
                <div className="checkout-field checkout-field-full">
                  <p className="payment-note">
                    DEMO PAYMENT ONLY — No real payment will be processed.
                  </p>
                </div>

                <div className="checkout-field checkout-field-full">
                  <label htmlFor="cardholderName">
                    Cardholder Name
                  </label>

                  <input
                    id="cardholderName"
                    type="text"
                    name="cardholderName"
                    value={cardData.cardholderName}
                    onChange={handleCardChange}
                    placeholder="Name printed on card"
                    autoComplete="off"
                  />
                </div>

                <div className="checkout-field checkout-field-full">
                  <label htmlFor="cardNumber">Card Number</label>

                  <input
                    id="cardNumber"
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={19}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="expiryDate">Expiry Date</label>

                  <input
                    id="expiryDate"
                    type="text"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={5}
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="cvv">CVV</label>

                  <input
                    id="cvv"
                    type="password"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                  />
                </div>

                <div className="checkout-field checkout-field-full">
                  <p className="payment-note">
                    Test card ending in 4242: successful payment.
                    <br />
                    Test card ending in 0002: failed payment.
                  </p>
                </div>
              </div>
            )}

            <p className="payment-note">
              Stripe Demo is a local simulation and does not process real payments.
              Never enter your actual bank card details.
            </p>

            <button
              type="submit"
              className="place-order-button"
              disabled={isSubmitting || cartitems.length === 0}
              style={{ marginTop: '24px' }}
            >
              {isSubmitting
                ? 'Processing Order...'
                : formData.paymentMethod === 'Stripe Demo'
                  ? `Pay & Place Order · $${finalTotal.toFixed(2)}`
                  : `Place Order · $${finalTotal.toFixed(2)}`}
            </button>

            <p className="summary-note">
              Your order is saved after successful confirmation
              from the server.
            </p>
          </form>
        </div>

        <aside className="order-summary">
          <h3>Order Summary</h3>

          <p className="summary-caption">
            Review the items in your cart.
          </p>

          <div className="summary-items">
            {cartitems.length > 0 ? (
              cartitems.map((food, index) => (
                <div
                  className="order-item"
                  key={`${food._id || food.id || food.name || 'food'}-${index}`}
                >
                  <span>{food.name || 'Food item'}</span>
                  <strong>${getPrice(food).toFixed(2)}</strong>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>${finalTotal.toFixed(2)}</strong>
          </div>

          <p className="summary-caption">
            <strong>Payment:</strong> {formData.paymentMethod}
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;
