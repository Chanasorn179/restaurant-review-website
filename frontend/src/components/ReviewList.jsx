import { useEffect, useState } from "react";
import PropTypes from "prop-types";

export default function ReviewList({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`http://localhost:3000/api/reviews/${restaurantId}`);
        const data = await res.json();
        if (data.success) {
          setReviews(data.data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("❌ Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    if (restaurantId) fetchReviews();
  }, [restaurantId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "ไม่ระบุวันที่";
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <p className="text-center text-gray-500 py-4">⏳ กำลังโหลดรีวิว...</p>;

  if (reviews.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
        ยังไม่มีรีวิว 📝 เป็นคนแรกที่รีวิวร้านนี้!
      </p>
    );
  }

  return (
    <div className="review-list space-y-6">
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100 tracking-wide">
        รีวิวทั้งหมด ({reviews.length})
      </h3>

      {reviews.map((review) => (
        <div
          key={review.id}
          className="review-item rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5 shadow-sm hover:shadow-xl transition-all duration-300 mb-4"
        >
          {/* Header */}
          <div className="review-header flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="avatar bg-sky-500 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center uppercase">
                {review.userName ? review.userName.charAt(0) : "?"}
              </div>
              <span className="reviewer-name font-semibold text-sky-600 dark:text-sky-400 text-lg">
                {review.userName || "ไม่ระบุชื่อ"}
              </span>
            </div>
            <span className="review-rating text-yellow-400 text-lg">
              {"⭐".repeat(review.rating || 0)}
            </span>
          </div>

          {/* คอมเมนต์ */}
          <p className="review-comment text-gray-700 dark:text-gray-200 mb-3 leading-relaxed">
            {review.comment || "—"}
          </p>

          {/* วันที่ */}
          <p className="review-date text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            📅 วันที่เข้าร้าน: {formatDate(review.visitDate)}
          </p>
        </div>
      ))}
    </div>
  );
}

ReviewList.propTypes = {
  restaurantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
