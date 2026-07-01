import React, { useId } from 'react';

interface SquareBoxProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeColor?: string;
}

const SquareBox = ({
  size = 60,
  strokeColor = 'currentColor',
  ...props
}: SquareBoxProps) => {
  const patternId = useId(); // Generates a unique ID for every instance

  return (
    <svg
      className='pointer-events-none absolute inset-0 text-neutral-200'
      width='100%'
      height='100%'
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          x={-0.25}
          y={-1}
          width={size}
          height={size}
          patternUnits='userSpaceOnUse'
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill='transparent'
            stroke={strokeColor}
            strokeWidth={4}
            opacity={0.3}
          />
        </pattern>
      </defs>
      <rect fill={`url(#${patternId})`} width='100%' height='100%' />
    </svg>
  );
};

export default SquareBox;
