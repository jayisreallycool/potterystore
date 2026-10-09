import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductReview } from '../types';

interface ReviewsPanelProps {
  productId: string;
  reviews: ProductReview[];
  avgRating: number;
  reviewCount: number;
  onAddReview: (review: Omit<ProductReview, 'id' | 'createdAt' | 'verified'>) => void;
}

export const ReviewsPanel: React.FC<ReviewsPanelProps> = ({
  productId,
  reviews,
  avgRating,
  reviewCount,
  onAddReview
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleSubmitReview = () => {
    if (!reviewText.trim() || !customerName.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onAddReview({
      productId,
      customerId: 'user-' + Date.now(),
      customerName,
      rating,
      text: reviewText,
      helpful: 0
    });

    setReviewText('');
    setCustomerName('');
    setRating(5);
    setShowReviewForm(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-[#E2B17B] text-[#E2B17B]' : 'text-[#3B3530]'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#24201D] border border-[#3B3530] rounded-lg p-6 lg:p-8">
      {/* Summary */}
      <div className="mb-8">
        <h3 className="text-xl font-serif text-[#FAF7F2] mb-4">Customer Reviews</h3>
        <div className="flex items-end gap-4 mb-6">
          <div>
            {renderStars(Math.round(avgRating))}
            <p className="text-sm text-[#A69B8E] mt-2">
              {avgRating.toFixed(1)} out of 5 ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-4 py-2 bg-[#E2B17B] text-[#24201D] rounded hover:bg-[#D4A46F] transition-colors text-sm font-semibold"
        >
          Write a Review
        </button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden bg-[#2c2723] border border-[#3B3530] rounded-lg p-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#FAF7F2] mb-2">Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1816] border border-[#3B3530] rounded text-[#FAF7F2] placeholder-[#8A7B6D] focus:outline-none focus:border-[#E2B17B]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#FAF7F2] mb-2">Rating</label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          i < rating ? 'fill-[#E2B17B] text-[#E2B17B]' : 'text-[#3B3530]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#FAF7F2] mb-2">Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1a1816] border border-[#3B3530] rounded text-[#FAF7F2] placeholder-[#8A7B6D] focus:outline-none focus:border-[#E2B17B]"
                  placeholder="Share your thoughts about this piece..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-[#E2B17B] text-[#24201D] rounded hover:bg-[#D4A46F] transition-colors text-sm font-semibold"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 bg-[#3B3530] text-[#FAF7F2] rounded hover:bg-[#443c36] transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-[#A69B8E] text-sm">No reviews yet. Be the first to review this piece!</p>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-[#3B3530] pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#FAF7F2]">{review.customerName}</p>
                  <div className="flex gap-2 items-center mt-1">
                    {renderStars(review.rating)}
                    {review.verified && (
                      <span className="text-xs bg-[#1f3a1f] text-[#8fd19e] px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-[#C4BAAE] text-sm mb-3">{review.text}</p>
              <button className="text-xs text-[#8A7B6D] hover:text-[#E2B17B] transition-colors flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                Helpful ({review.helpful || 0})
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
