import React, { useState } from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  padding: 2rem;
  margin: 2rem;
  border: 2px dashed ${(p) => p.theme.colors.border};
`;

const TriggerButton = styled.button`
  background-color: ${(p) => p.theme.colors.error};
  color: ${(p) => p.theme.colors.onPrimary};
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.4rem;
  cursor: pointer;
`;

// Test-only component for triggering errors in e2e tests
// This component should only be available in development/test mode
const ErrorTrigger = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('E2E test error triggered');
  }

  return (
    <Wrapper>
      <h3>Error Boundary Test Component</h3>
      <p>
        This component is only visible in development mode for testing purposes.
      </p>
      <TriggerButton onClick={() => setShouldThrow(true)}>
        Trigger Error
      </TriggerButton>
    </Wrapper>
  );
};

export default ErrorTrigger;
