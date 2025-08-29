import Link from 'next/link';
import { useAppContext } from '../contexts/AppContext';
import styles from '../styles/FoodCard.module.css';

const FoodCard = ({ item, showAddButton = true }) => {
  const { addToCart } = useAppContext();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(item, 1);
      
      // Show a brief success message
      const button = e.target;
      const originalText = button.textContent;
      button.textContent = 'Added!';
      button.style.backgroundColor = 'var(--success-color)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
      }, 1000);
    } catch (error) {
      alert('Failed to add item to cart');
    }
  };

  return (
    <div className={styles.card}>
      <Link href={`/food-items/${item.id}`}>
        <div className={styles.imageContainer}>
          <img src={item.image} alt={item.name} className={styles.image} />
          {item.featured && <div className={styles.featuredBadge}>Featured</div>}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{item.name}</h3>
          <p className={styles.description}>{item.description}</p>
          <div className={styles.meta}>
            <span className={styles.category}>{item.category}</span>
            <span className={styles.rating}>⭐ {item.rating}</span>
            <span className={styles.cookTime}>🕒 {item.cookTime}</span>
          </div>
          <div className={styles.tags}>
            {item.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.footer}>
            <span className={styles.price}>₹{item.price}</span>
            {showAddButton && (
              <button 
                className={styles.addButton}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FoodCard;