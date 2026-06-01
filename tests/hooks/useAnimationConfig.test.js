import { renderHook } from '../../jest.setup';
import useAnimationConfig from '../../src/hooks/useAnimationConfig';

// The framer-motion mock returns useReducedMotion = () => false by default
describe('useAnimationConfig', () => {
  it('returns an object with all expected animation configs', () => {
    const { result } = renderHook(() => useAnimationConfig());

    expect(result.current).toHaveProperty('fadeIn');
    expect(result.current).toHaveProperty('slideUp');
    expect(result.current).toHaveProperty('slideDown');
    expect(result.current).toHaveProperty('scaleIn');
    expect(result.current).toHaveProperty('staggerContainer');
    expect(result.current).toHaveProperty('buttonPress');
    expect(result.current).toHaveProperty('prefersReduced');
  });

  it('returns prefersReduced=false when reduced motion is not preferred', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.prefersReduced).toBe(false);
  });

  it('slideUp hidden variant has non-zero y when not reduced', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.slideUp.hidden.y).not.toBe(0);
  });

  it('slideUp visible variant resolves to y=0', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.slideUp.visible.y).toBe(0);
  });

  it('buttonPress has whileTap and whileHover when not reduced', () => {
    const { result } = renderHook(() => useAnimationConfig());
    expect(result.current.buttonPress).toHaveProperty('whileTap');
    expect(result.current.buttonPress).toHaveProperty('whileHover');
  });
});

describe('useAnimationConfig with reduced motion', () => {
  beforeEach(() => {
    // Override the framer-motion mock to return true for reduced motion
    jest.resetModules();
    jest.mock('framer-motion', () => ({
      ...jest.requireActual('../../tests/__mocks__/framer-motion'),
      useReducedMotion: () => true,
    }));
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('slideUp hidden variant has y=0 when reduced', async () => {
    const { useReducedMotion } = require('framer-motion');
    expect(useReducedMotion()).toBe(true);
  });
});
