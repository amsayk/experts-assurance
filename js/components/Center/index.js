import React from 'react';
export default function Center({ children }) {
  return (
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </div>
  );
}
