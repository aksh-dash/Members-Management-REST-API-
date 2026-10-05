import { useState } from 'react';

/**
 * Interactive star rating component.
 * Props:
 *   value: current rating (1-5)
 *   onChange: callback when rating changes
 *   readonly: disable interaction
 *   size: font size override
 */
export default function StarRating({ value = 0, onChange, readonly = false, size }) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (star) => {
    if (!readonly && onChange) {
      onChange(star);
    }
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className={`star-rating ${readonly ? 'readonly' : ''}`}
      style={size ? { fontSize: size } : undefined}
    >
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoverValue || value) ? 'filled' : ''} ${
            !readonly && star <= hoverValue ? 'hovered' : ''
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          role={readonly ? 'img' : 'button'}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          style={size ? { fontSize: size } : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}
