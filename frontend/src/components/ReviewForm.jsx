import { useState } from 'react';
import { addReview } from '../services/api';

export default function ReviewForm({ restaurantId, onReviewAdded }) {
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: '',
    visitDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const name = formData.userName.trim();
    const comment = formData.comment.trim();
    const ratingNum = parseInt(formData.rating);

    if (!name) newErrors.userName = 'กรุณากรอกชื่อ';
    else if (name.length < 2) newErrors.userName = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร';
    else if (name.length > 50) newErrors.userName = 'ชื่อต้องไม่เกิน 50 ตัวอักษร';

    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5)
      newErrors.rating = 'คะแนนต้องอยู่ระหว่าง 1-5';

    if (!comment) newErrors.comment = 'กรุณากรอกความคิดเห็น';
    else if (comment.length < 10) newErrors.comment = 'อย่างน้อย 10 ตัวอักษร';
    else if (comment.length > 500) newErrors.comment = 'ไม่เกิน 500 ตัวอักษร';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmittingError('');

    try {
      setSubmitting(true);
      const result = await addReview({ restaurantId, ...formData, rating: parseInt(formData.rating) });
      if (result.success) {
        setFormData({
          userName: '',
          rating: 5,
          comment: '',
          visitDate: new Date().toISOString().split('T')[0],
        });
        setErrors({});
        onReviewAdded?.();
      } else {
        setSubmittingError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    } catch (error) {
      setSubmittingError(error.message || 'เกิดข้อผิดพลาดในการส่งรีวิว');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form">
      <h3>เขียนรีวิว</h3>
      <form onSubmit={handleSubmit}>
        {/* ชื่อ */}
        <div className="form-group">
          <label>ชื่อของคุณ *</label>
          <input
            type="text"
            value={formData.userName}
            disabled={submitting}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            className={errors.userName ? 'invalid' : ''}
          />
          {errors.userName && <span className="error">{errors.userName}</span>}
        </div>

        {/* คะแนน */}
        <div className="form-group">
          <label>คะแนน *</label>
          <select
            value={formData.rating}
            disabled={submitting}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            className={errors.rating ? 'invalid' : ''}
          >
            <option value="5">⭐⭐⭐⭐⭐ ดีเยี่ยม</option>
            <option value="4">⭐⭐⭐⭐ ดีมาก</option>
            <option value="3">⭐⭐⭐ ดี</option>
            <option value="2">⭐⭐ พอใช้</option>
            <option value="1">⭐ ต้องปรับปรุง</option>
          </select>
          {errors.rating && <span className="error">{errors.rating}</span>}
        </div>

        {/* ความคิดเห็น */}
        <div className="form-group">
          <label>ความคิดเห็น *</label>
          <textarea
            value={formData.comment}
            disabled={submitting}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows="4"
            className={errors.comment ? 'invalid' : ''}
          />
          <div className="char-count">{formData.comment.length}/500 ตัวอักษร</div>
          {errors.comment && <span className="error">{errors.comment}</span>}
        </div>

        {/* วันที่ */}
        <div className="form-group">
          <label>วันที่เข้าร้าน</label>
          <input
            type="date"
            value={formData.visitDate}
            disabled={submitting}
            onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Error */}
        {submittingError && <p className="error text-center">{submittingError}</p>}

        {/* ปุ่ม */}
        <button type="submit" disabled={submitting}>
          {submitting ? '⏳ กำลังส่ง...' : 'ส่งรีวิว'}
        </button>
      </form>
    </div>
  );
}
