import {
  fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight,
  scaleIn, staggerContainer, staggerItem, hoverScale, hoverLift, pageTransition,
} from 'utils/animations';

describe('entrance variants', () => {
  it('fadeIn has hidden and visible (opacity only, no exit)', () => {
    expect(fadeIn.hidden).toEqual({ opacity: 0 });
    expect(fadeIn.visible.opacity).toBe(1);
    expect(fadeIn.visible.transition.duration).toBeGreaterThan(0);
    expect(fadeIn.exit).toBeUndefined();
  });

  it('fadeInUp hidden state has positive y offset', () => {
    expect(fadeInUp.hidden.y).toBeGreaterThan(0);
    expect(fadeInUp.visible.y).toBe(0);
  });

  it('fadeInDown hidden state has negative y offset', () => {
    expect(fadeInDown.hidden.y).toBeLessThan(0);
    expect(fadeInDown.visible.y).toBe(0);
  });

  it('fadeInLeft hidden state has negative x offset', () => {
    expect(fadeInLeft.hidden.x).toBeLessThan(0);
    expect(fadeInLeft.visible.x).toBe(0);
  });

  it('fadeInRight hidden state has positive x offset', () => {
    expect(fadeInRight.hidden.x).toBeGreaterThan(0);
    expect(fadeInRight.visible.x).toBe(0);
  });

  it('scaleIn hidden state has scale < 1', () => {
    expect(scaleIn.hidden.scale).toBeLessThan(1);
    expect(scaleIn.visible.scale).toBe(1);
  });
});

describe('container and item variants', () => {
  it('staggerContainer visible.transition has staggerChildren > 0', () => {
    expect(staggerContainer.visible.transition.staggerChildren).toBeGreaterThan(0);
  });

  it('staggerItem has hidden and visible with y movement', () => {
    expect(staggerItem.hidden.y).toBeGreaterThan(0);
    expect(staggerItem.visible.y).toBe(0);
  });
});

describe('hover presets (direct prop objects, not variant maps)', () => {
  it('hoverScale has scale > 1', () => {
    expect(hoverScale.scale).toBeGreaterThan(1);
    expect(hoverScale.transition).toBeDefined();
  });

  it('hoverLift has negative y offset', () => {
    expect(hoverLift.y).toBeLessThan(0);
    expect(hoverLift.transition).toBeDefined();
  });
});

describe('pageTransition', () => {
  it('has hidden, visible, and exit variants', () => {
    expect(pageTransition.hidden).toBeDefined();
    expect(pageTransition.visible).toBeDefined();
    expect(pageTransition.exit).toBeDefined();
  });

  it('exit state has negative y', () => {
    expect(pageTransition.exit.y).toBeLessThan(0);
  });
});
