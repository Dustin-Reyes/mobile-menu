/**
 * @module components/UserGreeting
 * @description User greeting component for the top of the menu page.
 * Displays avatar and personalized welcome message.
 */
import styled from '@emotion/styled';
import { User } from 'lucide-react';

const GreetingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s3};
  margin-bottom: ${({ theme }) => theme.spacing.s6};
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 56px;
    height: 56px;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.s1};
`;

const Greeting = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.s5};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.s6};
  }
`;

const GreetingName = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.s4};
  }
`;

/**
 * UserGreeting component
 * @param {Object} props
 * @param {string} props.name - User's name to display
 * @param {string} props.subtitle - Subtitle text (default: "What do you want to eat today!")
 * @returns {JSX.Element}
 */
export default function UserGreeting({
  name = 'Guest',
  subtitle = 'What do you want to eat today!',
}) {
  return (
    <GreetingWrapper>
      <Avatar>
        <User size={24} />
      </Avatar>
      <TextContent>
        <Greeting>
          Hello, <GreetingName>{name}</GreetingName>
        </Greeting>
        <Subtitle>{subtitle}</Subtitle>
      </TextContent>
    </GreetingWrapper>
  );
}
