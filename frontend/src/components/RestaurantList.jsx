import { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import { getRestaurants } from "../services/api";

function RestaurantList({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minRating: "",
    priceRange: "",
  });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getRestaurants(filters);
      console.log("📸 Restaurant Data:", result.data); // ✅ ตรวจ API data
      setRestaurants(result.data);
    } catch (err) {
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) =>
    setFilters((prev) => ({ ...prev, search: searchTerm }));

  const handleFilterChange = (newFilters) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));

  return (
    <div className="restaurant-list-container">
      <SearchBar onSearch={handleSearch} />
      <FilterPanel onFilterChange={handleFilterChange} filters={filters} />

      {loading && <div className="loading">กำลังโหลด...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          {restaurants.length === 0 ? (
            <p className="no-results">
              ไม่พบร้านอาหารที่ค้นหา ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะครับ
            </p>
          ) : (
            <div className="restaurant-grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant} // ✅ ส่ง object ทั้งก้อน
                  onClick={() => onSelectRestaurant(restaurant)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RestaurantList;
