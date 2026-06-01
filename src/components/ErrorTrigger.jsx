import React, { useState } from 'react';

// Test-only component for triggering errors in e2e tests
// This component should only be available in development/test mode
const ErrorTrigger = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('E2E test error triggered');
  }

  return (
    <div style={{ padding: '2rem', margin: '2rem', border: '2px dashed #ccc' }}>
      <h3>Error Boundary Test Component</h3>
      <p>
        This component is only visible in development mode for testing purposes.
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        style={{
          backgroundColor: '#d73a4a',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '0.4rem',
          cursor: 'pointer',
        }}
      >
        Trigger Error
      </button>
    </div>
  );
};

export default ErrorTrigger;
