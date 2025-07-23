import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import FoodCard from "../../components/FoodCard";
import Layout from "../../components/Layout";
import { useAppContext } from "../../contexts/AppContext";
import styles from "../../styles/FoodItems.module.css";

export default function FoodItems() {
  const router = useRouter();
  const { foodItems } = useAppContext();
  const { category: urlCategory } = router.query;

  const [filters, setFilters] = useState({
    category: urlCategory || "All",
    sortBy: "name",
    priceRange: "all",
  });

  const categories = [
    "All",
    ...new Set(foodItems.map((item) => item.category)),
  ];
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...foodItems];

    // Filter by category
    if (filters.category !== "All") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Filter by price range
    if (filters.priceRange !== "all") {
      switch (filters.priceRange) {
        case "under-100":
          filtered = filtered.filter((item) => item.price < 100);
          break;
        case "100-300":
          filtered = filtered.filter(
            (item) => item.price >= 100 && item.price <= 300
          );
          break;
        case "over-300":
          filtered = filtered.filter((item) => item.price > 300);
          break;
      }
    }

    // Sort items
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [foodItems, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // Update URL when category changes
    if (key === "category") {
      const newQuery = value === "All" ? {} : { category: value };
      router.push(
        {
          pathname: "/food-items",
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>All Food Items</h1>
          <p className={styles.subtitle}>
            Discover delicious meals from our extensive menu
          </p>
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Category:</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className={styles.filterSelect}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className={styles.filterSelect}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Price Range:</label>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
                className={styles.filterSelect}
              >
                <option value="all">All Prices</option>
                <option value="under-100">Under ₹100</option>
                <option value="100-300">₹100 - ₹300</option>
                <option value="over-300">Over ₹300</option>
              </select>
            </div>
          </div>

          <div className={styles.resultsCount}>
            {filteredAndSortedItems.length} items found
          </div>
        </div>

        <div className={styles.grid}>
          {filteredAndSortedItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className={styles.noResults}>
            <h3>No items found</h3>
            <p>Try adjusting your filters to see more results.</p>
            <button
              className="btn btn-primary"
              onClick={() =>
                setFilters({
                  category: "All",
                  sortBy: "name",
                  priceRange: "all",
                })
              }
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
