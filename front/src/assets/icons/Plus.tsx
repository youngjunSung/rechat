import React from 'react';
import { IconProps } from '@typings/types';

const defaultValue = {
  width: 16,
  height: 16,
};

export const Plus: React.FC<IconProps> = ({
  width = defaultValue.width,
  height = defaultValue.height,
  className,
  color,
}) => {
  return (
    <svg width={width} height={height} className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform={`scale(${width / defaultValue.width}, ${height / defaultValue.height})`}>
        <rect x="2" y="7" width="12" height="2" rx="1" fill={color ?? '#000'} />
        <rect x="7" y="14" width="12" height="2" rx="1" transform="rotate(-90 7 14)" fill={color ?? '#000'} />
      </g>
    </svg>
  );
};
