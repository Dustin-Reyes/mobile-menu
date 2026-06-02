import { renderHook } from '@testing-library/react';
import useAnimationConfig from 'hooks/useAnimationConfig';

describe('useAnimationConfig', () => {
  it('returns all expected keys', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current).toHaveProperty('fadeIn');
    expect(result.current).toHaveProperty('slideUp');
    expect(result.current).toHaveProperty('slideDown');
    expect(result.current).toHaveProperty('scaleIn');
    expect(result.current).toHaveProperty('staggerContainer');
    expect(result.current).toHaveProperty('buttonPress');
    expect(result.current).toHaveProperty('prefersReduced');
  });

  it('prefersReduced is false (mock returns false)', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.prefersReduced).toBe(false);
  });

  it('fadeIn has hidden, visible, and exit variants', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.fadeIn.hidden).toBeDefined();
    expect(result.current.fadeIn.visible).toBeDefined();
    expect(result.current.fadeIn.exit).toBeDefined();
  });

  it('fadeIn.visible transition duration > 0 when not reduced', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.fadeIn.visible.transition.duration).toBeGreaterThan(
      0,
    );
  });

  it('slideUp hidden state has positive y offset', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.slideUp.hidden.y).toBeGreaterThan(0);
  });

  it('slideUp visible state has y=0', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.slideUp.visible.y).toBe(0);
  });

  it('buttonPress has whileTap and whileHover when not reduced', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.buttonPress).toHaveProperty('whileTap');
    expect(result.current.buttonPress).toHaveProperty('whileHover');
  });
});
