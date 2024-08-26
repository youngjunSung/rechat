import React from 'react';
import { IconProps } from '@typings/types';

const defaultValue = {
  width: 64,
  height: 64,
};

export const LogoChat: React.FC<IconProps> = ({
  width = defaultValue.width,
  height = defaultValue.height,
  className,
  color,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      id="Layer_1"
      x="0px"
      y="0px"
      width={width}
      height={height}
      className={className}
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
    >
      <g transform={`scale(${width / defaultValue.width}, ${height / defaultValue.height})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill={color ?? '#288EF7'}
          d="M42.824,58.226c-0.056,0.024-0.116,0.044-0.175,0.062  c-0.017,0.005-0.031,0.013-0.046,0.018l-0.002-0.003c-0.191,0.061-0.391,0.104-0.602,0.104c-1.105,0-2-0.896-2-2  c0-0.885,0.577-1.624,1.37-1.891l-0.013-0.036C52.213,50.901,60,41.307,60,30C60,15.642,47.465,4,32,4C16.536,4,4,15.642,4,30  c0,7.998,3.908,15.127,10.031,19.891c0.032,0.039,0.044,0.083,0.088,0.117C15.263,50.893,16,52.279,16,53.835v5.884l6.795-4.633  l0.008,0.01c0.334-0.252,0.746-0.407,1.197-0.407c1.105,0,2,0.895,2,2c0,0.764-0.434,1.421-1.064,1.755l-6.984,4.89  c-0.61,0.42-1.35,0.667-2.147,0.667C13.704,64,12,62.296,12,60.196v-6.788C4.686,47.913,0,39.472,0,30C0,13.431,14.327,0,32,0  s32,13.431,32,30C64,43.004,55.166,54.063,42.824,58.226L42.824,58.226z M14.43,37.161c-0.677-0.909-0.515-2.211,0.363-2.909  l12.312-9.82c0.878-0.701,2.139-0.531,2.816,0.376l6.129,8.211l10.725-8.553c0.878-0.701,2.139-0.534,2.817,0.373  c0.677,0.909,0.514,2.211-0.363,2.909l-12.315,9.82c-0.878,0.701-2.139,0.531-2.814-0.376l-6.131-8.211l-10.725,8.553  C16.366,38.235,15.105,38.068,14.43,37.161L14.43,37.161z M34,56c1.105,0,2,0.895,2,2s-0.895,2-2,2s-2-0.895-2-2S32.895,56,34,56  L34,56z"
        />
      </g>
    </svg>
  );
};
