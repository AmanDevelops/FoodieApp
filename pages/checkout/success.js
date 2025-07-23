import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useAppContext } from "../../contexts/AppContext";
import styles from "../../styles/Success.module.css";

export default function Success() {
  const router = useRouter();
  const { orderId } = router.query;
  const { orders, user } = useAppContext();
  const [eta, setEta] = useState("");

  useEffect(() => {
    // Generate random ETA between 20-45 minutes
    const randomEta = Math.floor(Math.random() * 26) + 20; // 20-45 minutes
    setEta(`${randomEta}-${randomEta + 5} minutes`);
  }, []);

  const order = orders.find((o) => o.id === parseInt(orderId));

  if (!order) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.notFound}>
            <h1>Order Not Found</h1>
            <p>The order you're looking for doesn't exist.</p>
            <Link href="/" className="btn btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <div className={styles.checkmark}>✓</div>
          </div>

          <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
          <p className={styles.successSubtitle}>
            Thank you for your order. We're preparing your delicious meal!
          </p>

          <div className={styles.orderDetails}>
            <div className={styles.orderInfo}>
              <h3>Order Information</h3>
              <div className={styles.infoRow}>
                <span>Order ID:</span>
                <span className={styles.orderId}>#{order.id}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Order Date:</span>
                <span>
                  {new Date(order.date).toLocaleDateString()} at{" "}
                  {new Date(order.date).toLocaleTimeString()}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span>Total Amount:</span>
                <span className={styles.totalAmount}>
                  ₹{(order.total * 1.05 + 60).toFixed(2)}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span>Status:</span>
                <span className={styles.status}>{order.status}</span>
              </div>
            </div>

            <div className={styles.deliveryInfo}>
              <h3>Delivery Information</h3>
              <div className={styles.etaSection}>
                <div className={styles.etaIcon}>🕒</div>
                <div>
                  <div className={styles.etaLabel}>Estimated Delivery Time</div>
                  <div className={styles.etaTime}>{eta}</div>
                </div>
              </div>

              {user.selectedAddress && (
                <div className={styles.addressSection}>
                  <div className={styles.addressIcon}>📍</div>
                  <div>
                    <div className={styles.addressLabel}>Delivery Address</div>
                    <div className={styles.addressText}>
                      <strong>{user.selectedAddress.type}</strong>
                      <br />
                      {user.selectedAddress.address}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.orderItems}>
            <h3>Order Items ({order.items.length} items)</h3>
            <div className={styles.itemsList}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemDetails}>
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className={styles.itemPrice}>
                      ₹{(item.price * item.quantity * 1.05 + 60).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.trackingSection}>
            <div className={styles.trackingSteps}>
              <div className={`${styles.step} ${styles.active}`}>
                <div className={styles.stepIcon}>✓</div>
                <div className={styles.stepLabel}>Order Confirmed</div>
              </div>
              <div className={`${styles.step} ${styles.active}`}>
                <div className={styles.stepIcon}>👨‍🍳</div>
                <div className={styles.stepLabel}>Preparing</div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIcon}>🚚</div>
                <div className={styles.stepLabel}>On the Way</div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIcon}>🏠</div>
                <div className={styles.stepLabel}>Delivered</div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/food-items" className="btn btn-primary">
              Order More Food
            </Link>
            <Link href="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
