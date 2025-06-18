declare module 'react-rating-stars-component' {
  import * as React from 'react';

  interface ReactStarsProps {
    count?: number;
    value?: number;
    onChange?: (newRating: number) => void;
    size?: number;
    color?: string;
    activeColor?: string;
    edit?: boolean;
    isHalf?: boolean;
    emptyIcon?: React.ReactNode;
    halfIcon?: React.ReactNode;
    filledIcon?: React.ReactNode;
    a11y?: boolean;
  }

  const ReactStars: React.FC<ReactStarsProps>;

  export default ReactStars;
}
