import styled from '@emotion/styled';
import { LogOut, LayoutDashboard, Home, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'components/ui/DropdownMenu';

const AvatarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${(p) => p.theme.colors.primary};
  color: ${(p) => p.theme.colors.onPrimary};
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.s2};
  cursor: pointer;
  transition: background ${(p) => p.theme.transitions.fast};

  &:hover {
    background: ${(p) => p.theme.colors.secondary};
  }
`;

const AvatarInitials = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
`;

const MenuItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const getUserInitials = () => {
    const email = user.email || '';
    const parts = email.split('@');
    const username = parts[0] || '';
    return username.slice(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleGoToAdmin = () => {
    navigate('/admin');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToAbout = () => {
    navigate('/about');
  };

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <AvatarButton aria-label="User menu">
          <AvatarInitials>{getUserInitials()}</AvatarInitials>
        </AvatarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleGoHome}>
          <MenuItemContent>
            <Home size={16} />
            Home
          </MenuItemContent>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleGoToAbout}>
          <MenuItemContent>
            <Info size={16} />
            About
          </MenuItemContent>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleGoToAdmin}>
          <MenuItemContent>
            <LayoutDashboard size={16} />
            Go to Admin Dashboard
          </MenuItemContent>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <MenuItemContent>
            <LogOut size={16} />
            Sign out
          </MenuItemContent>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
