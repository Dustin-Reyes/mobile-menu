import { renderHook, act } from '../../jest.setup';
import useScrollToSection from '../../src/hooks/useScrollToSection';

const mockNavigate = jest.fn();
let mockPathname = '/';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

describe('useScrollToSection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
    mockPathname = '/';
    window.scrollTo = jest.fn();
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('on the root path', () => {
    it('scrolls to an element by id', () => {
      const el = { scrollIntoView: jest.fn() };
      document.getElementById.mockReturnValue(el);

      const { result } = renderHook(() => useScrollToSection());
      act(() => result.current('about'));

      expect(el.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('calls window.scrollTo for null sectionId', () => {
      const { result } = renderHook(() => useScrollToSection());
      act(() => result.current(null));

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('calls window.scrollTo for undefined sectionId', () => {
      const { result } = renderHook(() => useScrollToSection());
      act(() => result.current(undefined));

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('off the root path', () => {
    beforeEach(() => {
      mockPathname = '/about';
    });

    it('navigates to root before scrolling', () => {
      const el = { scrollIntoView: jest.fn() };
      document.getElementById.mockReturnValue(el);

      const { result } = renderHook(() => useScrollToSection());
      act(() => result.current('services'));

      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(el.scrollIntoView).not.toHaveBeenCalled();
    });

    it('scrolls after the default 150ms delay', () => {
      const el = { scrollIntoView: jest.fn() };
      document.getElementById.mockReturnValue(el);

      const { result } = renderHook(() => useScrollToSection());
      act(() => result.current('services'));

      expect(el.scrollIntoView).not.toHaveBeenCalled();
      act(() => jest.advanceTimersByTime(150));
      expect(el.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('respects a custom delay option', () => {
      const el = { scrollIntoView: jest.fn() };
      document.getElementById.mockReturnValue(el);

      const { result } = renderHook(() => useScrollToSection({ delay: 300 }));
      act(() => result.current('services'));

      act(() => jest.advanceTimersByTime(299));
      expect(el.scrollIntoView).not.toHaveBeenCalled();

      act(() => jest.advanceTimersByTime(1));
      expect(el.scrollIntoView).toHaveBeenCalledTimes(1);
    });
  });

  describe('onBeforeScroll callback', () => {
    it('calls onBeforeScroll with the sectionId before scrolling', () => {
      const el = { scrollIntoView: jest.fn() };
      document.getElementById.mockReturnValue(el);
      const onBeforeScroll = jest.fn();

      const { result } = renderHook(() =>
        useScrollToSection({ onBeforeScroll }),
      );
      act(() => result.current('contact-form'));

      expect(onBeforeScroll).toHaveBeenCalledWith('contact-form');
      expect(onBeforeScroll).toHaveBeenCalledTimes(1);
    });

    it('passes null to onBeforeScroll when scrolling to top', () => {
      const onBeforeScroll = jest.fn();

      const { result } = renderHook(() =>
        useScrollToSection({ onBeforeScroll }),
      );
      act(() => result.current(null));

      expect(onBeforeScroll).toHaveBeenCalledWith(null);
    });

    it('does not throw when onBeforeScroll is omitted', () => {
      const el = { scrollIntoView: jest.fn() };
      document.getElementById.mockReturnValue(el);

      const { result } = renderHook(() => useScrollToSection());
      expect(() => act(() => result.current('about'))).not.toThrow();
    });

    it('picks up a changed onBeforeScroll without recreating the scroll function', () => {
      const first = jest.fn();
      const second = jest.fn();
      const el = { scrollIntoView: jest.fn() };
      document.getElementById.mockReturnValue(el);

      let callback = first;
      const { result, rerender } = renderHook(() =>
        useScrollToSection({ onBeforeScroll: callback }),
      );

      const scrollFnBefore = result.current;

      callback = second;
      rerender();

      // Same stable reference (ref-based callback pattern)
      expect(result.current).toBe(scrollFnBefore);

      // But the latest callback is called
      act(() => result.current('about'));
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledWith('about');
    });
  });
});
