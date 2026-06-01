import { renderHook, act } from '../../jest.setup';
import { useMediaQuery } from '../../src/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  let mockMq;

  beforeEach(() => {
    mockMq = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    window.matchMedia = jest.fn().mockReturnValue(mockMq);
  });

  it('returns initial match value', () => {
    mockMq.matches = true;
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('updates when media query fires', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(false);

    const handler = mockMq.addEventListener.mock.calls[0][1];
    act(() => handler({ matches: true }));
    expect(result.current).toBe(true);
  });

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    const addedHandler = mockMq.addEventListener.mock.calls[0][1];
    unmount();
    expect(mockMq.removeEventListener).toHaveBeenCalledWith(
      'change',
      addedHandler,
    );
  });

  it('resubscribes when query changes', () => {
    const { rerender } = renderHook(({ q }) => useMediaQuery(q), {
      initialProps: { q: '(max-width: 768px)' },
    });
    const firstHandler = mockMq.addEventListener.mock.calls[0][1];

    rerender({ q: '(max-width: 1024px)' });

    expect(mockMq.removeEventListener).toHaveBeenCalledWith(
      'change',
      firstHandler,
    );
    expect(mockMq.addEventListener).toHaveBeenCalledTimes(2);
  });
});
