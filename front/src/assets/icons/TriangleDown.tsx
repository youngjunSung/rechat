import React from 'react';
import { IconProps } from '@typings/types';

const defaultValue = {
  width: 8,
  height: 7,
};

export const TriangleDown: React.FC<IconProps> = ({
  width = defaultValue.width,
  height = defaultValue.height,
  className,
  color,
}) => {
  return (
    <svg width={width} height={height} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform={`scale(${width / defaultValue.width}, ${height / defaultValue.height})`}>
        <path
          d="M4.822 5.98a1 1 0 0 1-1.644 0L.758 2.486a1 1 0 0 1 .821-1.57h4.842a1 1 0 0 1 .822 1.57L4.822 5.98Z"
          fill={color ?? '#7A8699'}
        />
      </g>
    </svg>
  );
};
