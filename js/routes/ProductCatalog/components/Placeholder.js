import React from 'react';

export default function Placeholder({}) {
  return (
    <svg viewBox='0 0 32 32'>
      <g style={{fillRule: 'evenodd'}}>
        <rect fill='#BDC4C9' x={4} y={1} width={24} height={30} rx={1} />
        <path fill='#FFF' d='M5 2h22v28H5z' />
        <path fill='#70B1E7' d='M9 6h14v1H9zm0 3h14v1H9zm0 3h6v1H9z' />
        <path fill='#70B1E7' d='M8.5 25h15L19 20.5l-2 2-3-4z' fillOpacity='0.3' />
        <path d='M14 18a1 1 0 0 0-.768.36l-5 6A1 1 0 0 0 9 26h14a1 1 0 0 0 .707-1.707l-4-4a.997.997 0 0 0-1.414 0l-1.185 1.185L14.8 18.4a1 1 0 0 0-.774-.4H14m3 5l2-2 4 4H9l5-6 3 4z' fill='#70B1E7' />
      </g>
    </svg>

  );
}

