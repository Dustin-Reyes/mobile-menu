import React from 'react';
import { render, screen } from '../utils/test-utils';
import Home from 'pages/Home';

// usePage starts loading:true in tests; mock it settled so Hero renders content
jest.mock('hooks/useContent', () => ({
  usePage: jest.fn(() => ({ content: null, loading: false, error: null })),
}));

const STACK = [
  'Vite 6',
  'React 18',
  'Emotion',
  'Radix UI',
  'Framer Motion',
  'Firebase',
  'i18next',
  'Sentry',
  'Jest',
  'Playwright',
  'Netlify',
];

describe('Home page', () => {
  beforeEach(() => render(<Home />));

  it('renders the headline using the translation key', () => {
    expect(screen.getByText('home.title')).toBeInTheDocument();
  });

  it('renders the badge using the translation key', () => {
    // react-i18next is mocked: t(key) returns key
    expect(screen.getByText('home.badge')).toBeInTheDocument();
  });

  it('renders the subtitle using the translation key', () => {
    expect(screen.getByText('home.subtitle')).toBeInTheDocument();
  });

  it('renders all 11 tech stack pills', () => {
    for (const tech of STACK) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });
});
