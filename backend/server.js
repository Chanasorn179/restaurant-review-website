const express = require("express");
const cors = require("cors");
require("dotenv").config();

const restaurantRoutes = require("./routes/restaurants");
const reviewRoutes = require("./routes/reviews");
const { readJsonFile } = require("./utils/fileManager");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "🍜 Restaurant Review API",
    version: "1.0.0",
    endpoints: {
      restaurants: "/api/restaurants",
      reviews: "/api/reviews",
      stats: "/api/stats",
    },
  });
});

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/stats", async (req, res) => {
  try {
    // 🧮 1. อ่านข้อมูลจากไฟล์ JSON
    const restaurants = await readJsonFile("restaurants.json");
    const reviews = await readJsonFile("reviews.json");

    // 🏪 2. คำนวณจำนวนร้าน
    const totalRestaurants = restaurants.length;

    // 📝 3. คำนวณจำนวนรีวิวทั้งหมด
    const totalReviews = reviews.length;

    // ⭐ 4. คำนวณคะแนนเฉลี่ยของร้านทั้งหมด
    const validRestaurants = restaurants.filter((r) => r.totalReviews > 0);
    const sumRatings = validRestaurants.reduce(
      (sum, r) => sum + r.averageRating,
      0
    );
    const averageRating =
      validRestaurants.length > 0
        ? Math.round((sumRatings / validRestaurants.length) * 10) / 10
        : 0;

    // 🏆 5. เรียงร้านจากคะแนนมากไปน้อย แล้วเอา top 5
    const topRatedRestaurants = [...restaurants]
      .filter((r) => r.totalReviews > 0) // ตัดร้านที่ไม่มีรีวิวออก
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);

    // 📤 6. ส่งข้อมูลกลับ
    res.json({
      success: true,
      data: {
        totalRestaurants,
        totalReviews,
        averageRating,
        topRatedRestaurants,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงสถิติ",
    });
  }
});


// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
