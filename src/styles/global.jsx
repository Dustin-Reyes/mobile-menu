import { Global, css, useTheme } from '@emotion/react';

function GlobalStylesWithTheme() {
  const theme = useTheme();

  const globalStyles = css`
    /* Modern CSS Reset */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      margin: 0;
    }

    html {
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      font-size: 10px;
    }

    img,
    picture,
    video,
    canvas,
    svg {
      display: block;
      max-width: 100%;
    }

    input,
    button,
    textarea,
    select {
      font: inherit;
    }

    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      overflow-wrap: break-word;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: ${theme.typography.lineHeights.tight};
    }

    #root {
      isolation: isolate;
    }

    /* Remove list styles on ul, ol elements with a list role */
    ul[role='list'],
    ol[role='list'] {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    /* Set core root defaults */
    html {
      /* Offset anchor scroll targets so the sticky header doesn't overlap them */
      scroll-padding-top: 64px;
    }

    html:focus-within {
      scroll-behavior: smooth;
    }

    /* Set core body defaults */
    body {
      min-height: 100vh;
      text-rendering: optimizeSpeed;
      font-family: ${theme.typography.fontFamilies.sans};
      line-height: ${theme.typography.lineHeights.normal};
      color: ${theme.colors.text};
      background-color: ${theme.colors.background};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition:
        color 0.2s ease,
        background-color 0.2s ease;
    }

    code,
    pre,
    kbd,
    samp {
      font-family: ${theme.typography.fontFamilies.mono};
    }

    /* A elements that don't have a class get default styles */
    a:not([class]) {
      text-decoration-skip-ink: auto;
      color: currentColor;
    }

    /* Make images easier to work with */
    img,
    picture {
      max-width: 100%;
      display: block;
    }

    /* Inherit fonts for inputs and buttons */
    input,
    button,
    textarea,
    select {
      font: inherit;
    }

    /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
    @media (prefers-reduced-motion: reduce) {
      html:focus-within {
        scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    /* Base font size for rem units */
    html {
      font-size: 10px;
    }

    /* Focus styles */
    :focus-visible {
      outline: 2px solid ${(props) => props.theme.colors.primary};
      outline-offset: 2px;
    }

    /* Select none for non-text elements */
    button,
    input,
    select,
    textarea {
      -webkit-user-select: none;
      user-select: none;
    }

    /* Allow text selection for text inputs */
    input[type='text'],
    input[type='email'],
    input[type='password'],
    input[type='search'],
    input[type='url'],
    textarea {
      -webkit-user-select: text;
      user-select: text;
    }

    /* Remove default button styles */
    button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }

    /* Remove default fieldset styles */
    fieldset {
      border: none;
      padding: 0;
      margin: 0;
    }

    /* Fix legend styling */
    legend {
      display: block;
      width: 100%;
      padding: 0;
      margin-bottom: 0.5rem;
      font-size: inherit;
      line-height: inherit;
      color: inherit;
      white-space: normal;
      max-width: 100%;
    }

    /* Fix table styling */
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    th,
    td {
      text-align: left;
      vertical-align: top;
      padding: 0;
    }

    /* Hide elements visually but keep them accessible */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      :focus-visible {
        outline: 3px solid ${theme.colors.text};
      }
    }

    /* Print styles */
    @media print {
      *,
      *::before,
      *::after {
        background: transparent !important;
        color: black !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }

      a,
      a:visited {
        text-decoration: underline;
      }

      a[href]:after {
        content: ' (' attr(href) ')';
      }

      abbr[title]:after {
        content: ' (' attr(title) ')';
      }

      a[href^='#']:after,
      a[href^='javascript:']:after {
        content: '';
      }

      pre {
        white-space: pre-wrap !important;
      }

      pre,
      blockquote {
        border: 1px solid #999;
        page-break-inside: avoid;
      }

      thead {
        display: table-header-group;
      }

      tr,
      img {
        page-break-inside: avoid;
      }

      p,
      h2,
      h3 {
        orphans: 3;
        widows: 3;
      }

      h2,
      h3 {
        page-break-after: avoid;
      }
    }
  `;

  return <Global styles={globalStyles} />;
}

function GlobalStyles() {
  return <GlobalStylesWithTheme />;
}

export default GlobalStyles;
