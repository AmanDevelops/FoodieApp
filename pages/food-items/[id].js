import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useAppContext } from '../../contexts/AppContext';
import styles from '../../styles/FoodItemDetail.module.css';

export default function FoodItemDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { foodItems, addToCart } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const item = foodItems.find(item => item.id === parseInt(id));

  if (!item) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.notFound}>
            <h1>Item Not Found</h1>
            <p>The food item you're looking for doesn't exist.</p>
            <Link href="/food-items" className="btn btn-primary">
              Back to Food Items
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(item, quantity);
    
    // Simulate loading state
    setTimeout(() => {
      setIsAdding(false);
      // Show success and redirect to cart or show confirmation
      const goToCart = confirm('Item added to cart! Go to cart now?');
      if (goToCart) {
        router.push('/cart');
      }
    }, 500);
  };

  const relatedItems = foodItems
    .filter(relatedItem => 
      relatedItem.category === item.category && relatedItem.id !== item.id
    )
    .slice(0, 3);

  return (
    <Layout>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/food-items">Food Items</Link>
          <span>/</span>
          <span>{item.name}</span>
        </div>

        <div className={styles.itemDetail}>
          <div className={styles.imageSection}>
            <img src={item.image} alt={item.name} className={styles.image} />
            {item.featured && (
              <div className={styles.featuredBadge}>Featured Item</div>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.category}>{item.category}</div>
            <h1 className={styles.name}>{item.name}</h1>
            <div className={styles.meta}>
              <span className={styles.rating}>⭐ {item.rating}</span>
              <span className={styles.cookTime}>🕒 {item.cookTime}</span>
            </div>
            
            <p className={styles.description}>{item.description}</p>
            
            <div className={styles.tags}>
              {item.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <div className={styles.priceSection}>
              <span className={styles.price}>₹{item.price}</span>
            </div>

            <div className={styles.orderSection}>
              <div className={styles.quantitySection}>
                <label htmlFor="quantity">Quantity:</label>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.quantityBtn}
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className={styles.quantityInput}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.totalPrice}>
                Total: ₹{(item.price * quantity).toFixed(2)}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`${styles.addToCartBtn} ${isAdding ? styles.adding : ''}`}
              >
                {isAdding ? (
                  <>
                    <span className="loading"></span>
                    Adding to Cart...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        </div>

        {relatedItems.length > 0 && (
          <div className={styles.relatedSection}>
            <h2>More from {item.category}</h2>
            <div className={styles.relatedGrid}>
              {relatedItems.map(relatedItem => (
                <Link key={relatedItem.id} href={`/food-items/${relatedItem.id}`}>
                  <div className={styles.relatedItem}>
                    <img src={relatedItem.image} alt={relatedItem.name} />
                    <div className={styles.relatedInfo}>
                      <h3>{relatedItem.name}</h3>
                      <span className={styles.relatedPrice}>₹{relatedItem.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}