import { useMemo, useState } from "react";
import FoodCard from "../components/FoodCard";
import Layout from "../components/Layout";
import { useAppContext } from "../contexts/AppContext";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { foodItems } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  const featuredItems = useMemo(
    () => foodItems.filter((item) => item.featured),
    [foodItems]
  );

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return foodItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [foodItems, searchTerm]);

  return (
    <Layout>
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Delicious Food, <span>Delivered Fast</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Order your favorite meals from the best restaurants in town
            </p>

            <div className={styles.searchSection}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search for food items, categories, or cuisines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <button className={styles.searchButton}>🔍</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {searchTerm.trim() && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Search Results for "{searchTerm}" ({searchResults.length})
            </h2>
            {searchResults.length > 0 ? (
              <div className={styles.grid}>
                {searchResults.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>No items found matching your search.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
        )}

        {!searchTerm.trim() && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Featured Items</h2>
              <div className={styles.grid}>
                {featuredItems.map((item) => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
