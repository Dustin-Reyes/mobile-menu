/**
 * Home page — Main menu display page.
 *
 * This will be rebuilt in Sprint 3 with the new menu layout components.
 *
 * @returns {JSX.Element}
 */
import styled from '@emotion/styled';

const Container = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.s6};
`;

const Message = styled.div`
  text-align: center;
  max-width: 600px;

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes.s7};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.s4};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSizes.s4};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export default function Home() {
  return (
    <Container>
      <Message>
        <h1>Menu Template</h1>
        <p>
          Home page placeholder. The new menu layout will be built here in
          Sprint 3.
        </p>
      </Message>
    </Container>
  );
}
