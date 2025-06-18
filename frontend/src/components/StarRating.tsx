import React from 'react';

interface StarRatingProps {
  rating: number; // Assume 0 to 5
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const maxStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  const stars = Array.from({ length: maxStars }, (_, i) => {
    if (i < fullStars) return '★';       // full star
    if (i === fullStars && halfStar) return '⯨'; // optional: half-star
    return '☆';                          // empty star
  });

  return (
    <div className="star-rating" title={`${rating} out of 5`}>
      {stars.map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>
  );
};

export default StarRating;
