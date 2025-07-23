import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/Layout";
import { useAppContext } from "../../contexts/AppContext";
import styles from "../../styles/Cart.module.css";

export default function Cart() {
  const router = useRouter();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalItems,
    placeOrder,
    user,
  } = useAppContext();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateCartQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to get started!</p>
            <Link href="/food-items" className="btn btn-primary">
              Browse Food Items
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className={styles.cartHeader}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <p className={styles.subtitle}>
            {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        <div className={styles.cartLayout}>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <Link href={`/food-items/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                </Link>

                <div className={styles.itemInfo}>
                  <Link
                    href={`/food-items/${item.id}`}
                    className={styles.itemName}
                  >
                    <h3 className={styles.itemName}>{item.name}</h3>
                  </Link>
                  <p className={styles.itemCategory}>{item.category}</p>
                  <p className={styles.itemPrice}>₹{item.price} each</p>
                </div>

                <div className={styles.quantityControls}>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className={styles.quantityBtn}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className={styles.quantityInput}
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className={styles.removeBtn}
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>

              <div className={styles.summaryRow}>
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>₹60</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tax</span>
                <span>₹{(getTotalPrice() * 0.05).toFixed(2)}</span>
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={styles.summaryRow + " " + styles.summaryTotal}>
                <span>Total</span>
                <span>
                  ₹{(getTotalPrice() + 60 + getTotalPrice() * 0.05).toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`${styles.checkoutBtn} ${
                  isCheckingOut ? styles.checking : ""
                }`}
              >
                {isCheckingOut ? (
                  <>
                    <span className="loading"></span>
                    Processing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
