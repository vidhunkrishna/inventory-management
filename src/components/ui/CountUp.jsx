import React, { useEffect, useState } from 'react';

export const CountUp = ({ value, duration = 1.2, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const endValue = parseFloat(value);
    
    if (isNaN(endValue)) {
      setCount(value);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // Ease out quad animation progress formula
      const easeProgress = progress * (2 - progress);
      const current = easeProgress * endValue;

      setCount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const formatNumber = (num) => {
    if (num % 1 === 0) {
      return num.toLocaleString();
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return <span>{prefix}{formatNumber(count)}{suffix}</span>;
};
export default CountUp;
