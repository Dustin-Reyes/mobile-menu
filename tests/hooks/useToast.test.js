jest.mock('utils/toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

import { renderHook, act } from '@testing-library/react';
import { useToast } from 'hooks/useToast';
import { toast } from 'utils/toast';

describe('useToast', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns a showToast function', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.showToast).toBe('function');
  });

  it('showToast calls toast.success for type=success', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast({ message: 'Done!', type: 'success' }));
    expect(toast.success).toHaveBeenCalledWith('Done!');
  });

  it('showToast calls toast.error for type=error', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast({ message: 'Oops', type: 'error' }));
    expect(toast.error).toHaveBeenCalledWith('Oops');
  });

  it('showToast defaults to info when type is not provided', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast({ message: 'Hello' }));
    expect(toast.info).toHaveBeenCalledWith('Hello');
  });

  it('showToast defaults to info for an unknown type', () => {
    const { result } = renderHook(() => useToast());
    act(() => result.current.showToast({ message: 'Hi', type: 'unknown' }));
    expect(toast.info).toHaveBeenCalledWith('Hi');
  });

  it('showToast is stable across re-renders (same reference)', () => {
    const { result, rerender } = renderHook(() => useToast());
    const first = result.current.showToast;
    rerender();
    expect(result.current.showToast).toBe(first);
  });
});
