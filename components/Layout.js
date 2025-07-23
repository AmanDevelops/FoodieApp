import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import styles from "../styles/Layout.module.css";

const Layout = ({ children }) => {
  const router = useRouter();
  const { getTotalItems } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Food Items", href: "/food-items" },
    { name: "Cart", href: "/cart" },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>
              🍴 FoodieApp
            </Link>

            <nav
              className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${styles.navLink} ${
                    router.pathname === item.href ? styles.navLinkActive : ""
                  }`}
                >
                  {item.name}
                  {item.name === "Cart" && getTotalItems() > 0 && (
                    <span className={styles.cartBadge}>{getTotalItems()}</span>
                  )}
                </Link>
              ))}
            </nav>

            <button
              className={styles.menuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>FoodieApp</h3>
              <p>Your favorite food delivery service</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <Link href="/">Home</Link>
              <Link href="/food-items">Food Items</Link>
              <Link href="/cart">Cart</Link>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact</h4>
              <p>📞 9889785715</p>
              <p>📧 contact@amandev.me</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 FoodieApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
