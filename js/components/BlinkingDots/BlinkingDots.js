import React from 'react';

import style from './BlinkingDots.scss';

export default function BlinkingDots({ children }) {
  return (
    <div className={style.blinkingDots}>
      {children}<span>.</span><span>.</span><span>.</span>
    </div>
  );
}

