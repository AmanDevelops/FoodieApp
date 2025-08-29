import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/Layout";
import { useAppContext } from "../../contexts/AppContext";
import styles from "../../styles/Checkout.module.css";

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotalPrice, getTotalItems, placeOrder, user, setUser } =
    useAppContext();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Random delivery addresses
  const deliveryAddresses = [
    {
      id: "address1",
      label: "Home",
      address: "Jankipuram, Lucknow, 226022",
      type: "Home",
    },
    {
      id: "address2",
      label: "Office",
      address: "456 Business Plaza, Gomti Nagar, Lucknow 212345",
      type: "Office",
    },
  ];

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    setIsProcessing(true);

    const selectedAddressData = deliveryAddresses.find(
      (addr) => addr.id === selectedAddress
    );

    try {
      // Update user with selected address
      setUser((prev) => ({ ...prev, selectedAddress: selectedAddressData }));
      
      const order = await placeOrder(selectedAddressData);
      setIsProcessing(false);

      // Redirect to success page with order details
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      setIsProcessing(false);
      alert('Failed to place order. Please try again.');
      console.error('Order placement failed:', error);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.emptyCart}>
            <h2>Your cart is empty</h2>
            <p>Add some items to proceed with checkout</p>
            <Link href="/food-items" className="btn btn-primary">
              Browse Food Items
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = 60;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <Layout>
      <div className="container">
        <div className={styles.checkoutHeader}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>
            Review your order and select delivery address
          </p>
        </div>

        <div className={styles.checkoutLayout}>
          <div className={styles.checkoutForm}>
            <div className={styles.section}>
              <h3>Delivery Address</h3>
              <div className={styles.addressOptions}>
                {deliveryAddresses.map((address) => (
                  <label key={address.id} className={styles.addressOption}>
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value={address.id}
                      checked={selectedAddress === address.id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className={styles.addressRadio}
                    />
                    <div className={styles.addressDetails}>
                      <div className={styles.addressLabel}>
                        <span className={styles.addressType}>
                          {address.type}
                        </span>
                      </div>
                      <div className={styles.addressText}>
                        {address.address}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3>Order Items ({getTotalItems()} items)</h3>
              <div className={styles.orderItems}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemDetails}>
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className={styles.itemPrice}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>

              <div className={styles.summaryRow}>
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={styles.summaryRow + " " + styles.summaryTotal}>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedAddress}
                className={`${styles.placeOrderBtn} ${
                  isProcessing ? styles.processing : ""
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="loading"></span>
                    Processing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>

              <div className={styles.backToCart}>
                <Link href="/cart" className={styles.backLink}>
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
