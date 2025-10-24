import { useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const fallbackImg = "https://placehold.co/600x400?text=No+Image";

export default function RestaurantCard({ restaurant }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewList, setShowReviewList] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // 🌟 สำหรับหัวใจ

  const {
    id,
    name = "ไม่ระบุชื่อร้าน",
    category = "ไม่ระบุหมวดหมู่",
    description = "ไม่มีรายละเอียด",
    averageRating = 0,
    totalReviews = 0,
    image,
  } = restaurant;

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className="restaurant-card relative dark:bg-neutral-900 dark:text-gray-100">
      {/* 🖼️ รูปภาพ */}
      <div className="image-wrapper relative">
        <img
          src={image || fallbackImg}
          alt={name}
          className="restaurant-image"
          onError={(e) => (e.target.src = fallbackImg)}
        />
        <div className="image-overlay"></div>

        {/* ❤️ ปุ่ม Favorite */}
        <button
          onClick={toggleFavorite}
          className={`favorite-btn absolute top-2 left-2 text-2xl transition-transform
            ${isFavorite ? "text-red-500 scale-110" : "text-black/70 dark:text-white/70 hover:text-red-400"}
          `}
          aria-label="Favorite"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      {/* 📝 ข้อมูลร้าน */}
      <div className="restaurant-info">
        <h3 className="font-semibold">{name}</h3>
        <p className="category text-gray-600 dark:text-gray-400">{category}</p>
        <p className="desc line-clamp-2 text-gray-800 dark:text-gray-300">
          {description}
        </p>

        <div className="rating-row mt-1 text-sm text-gray-700 dark:text-gray-300 flex gap-2">
          <span>
            <span className="star">⭐</span>{" "}
            {averageRating > 0
              ? `${averageRating.toFixed(1)} คะแนน`
              : "ยังไม่มีรีวิว"}
          </span>
          <span>{totalReviews} รีวิว</span>
        </div>

        {/* 📝 ปุ่มรีวิว */}
        <div className="review-buttons mt-3 flex gap-2">
          <button
            onClick={() => setShowReviewForm((prev) => !prev)}
            onDoubleClick={() => setShowReviewForm(false)}
            className="write-review-btn px-3 py-1 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition"
          >
            ✍️ เขียนรีวิว
          </button>

          {totalReviews > 0 && (
            <button
              onClick={() => setShowReviewList((prev) => !prev)}
              onDoubleClick={() => setShowReviewList(false)}
              className="view-all-reviews-btn px-3 py-1 rounded-lg bg-gray-200 dark:bg-neutral-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-neutral-700 transition"
            >
              ดูรีวิวทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* 🪄 Modal: ฟอร์มรีวิว */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-lg w-full relative">
            <ReviewForm
              restaurantId={id}
              onReviewAdded={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}

      {/* 📜 Modal: รายการรีวิว */}
      {showReviewList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-lg w-full relative overflow-y-auto max-h-[80vh]">
            <ReviewList restaurantId={id} />
          </div>
        </div>
      )}
    </div>
  );
}
