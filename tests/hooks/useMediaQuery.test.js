import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from 'hooks/useMediaQuery';

describe('useMediaQuery', () => {
  let mockMql;

  beforeEach(() => {
    mockMql = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    window.matchMedia = jest.fn().mockReturnValue(mockMql);
  });

  it('returns the initial matches value from matchMedia', () => {
    mockMql.matches = true;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('returns false when media query does not match', () => {
    mockMql.matches = false;
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('registers a change event listener', () => {
    renderHook(() => useMediaQuery('(max-width: 480px)'));
    expect(mockMql.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('removes change listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 480px)'));
    unmount();
    expect(mockMql.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('updates matches value when media query fires change event', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 480px)'));
    const [, handler] = mockMql.addEventListener.mock.calls[0];
    act(() => handler({ matches: true }));
    expect(result.current).toBe(true);
  });
});
