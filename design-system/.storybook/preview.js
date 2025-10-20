import { themes } from '@storybook/theming';
import '../web/styles/global.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    dark: { ...themes.dark },
    light: { ...themes.normal },
    darkClass: 'dark-mode',
    lightClass: 'light-mode',
    current: 'light',
    stylePreview: true,
  },
  viewport: {
    viewports: {
      iPhoneSE: {
        name: 'iPhone SE',
        styles: { width: '375px', height: '667px' },
      },
      iPhone14Pro: {
        name: 'iPhone 14 Pro',
        styles: { width: '393px', height: '852px' },
      },
      iPadMini: {
        name: 'iPad Mini',
        styles: { width: '768px', height: '1024px' },
      },
      iPadPro: {
        name: 'iPad Pro',
        styles: { width: '1024px', height: '1366px' },
      },
      pixelPhone: {
        name: 'Pixel Phone',
        styles: { width: '411px', height: '823px' },
      },
      galaxyTab: {
        name: 'Galaxy Tab',
        styles: { width: '800px', height: '1280px' },
      },
    },
  },
  docs: {
    toc: {
      contentsSelector: '.sbdocs-content',
      headingSelector: 'h1, h2, h3',
      title: 'Table of Contents',
      disable: false,
      unsafeTocbotOptions: {
        orderedList: false,
      },
    },
  },
  options: {
    storySort: {
      order: [
        'Introduction',
        'Getting Started',
        'Design Tokens',
        ['Colors', 'Typography', 'Spacing', 'Shadows', 'Animation'],
        'Components',
        ['Button', 'Input', 'Card', 'Modal', 'Navigation'],
        'Patterns',
        'Templates',
        'Accessibility',
        'Migration Guide',
      ],
    },
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'light', title: 'Light', icon: 'sun' },
        { value: 'dark', title: 'Dark', icon: 'moon' },
        { value: 'auto', title: 'Auto', icon: 'circle' },
      ],
      showName: true,
    },
  },
  locale: {
    name: 'Locale',
    description: 'Locale for components',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'es', title: 'Español' },
        { value: 'fr', title: 'Français' },
        { value: 'de', title: 'Deutsch' },
        { value: 'ja', title: '日本語' },
        { value: 'zh', title: '中文' },
      ],
      showName: true,
    },
  },
};

export const decorators = [
  (Story, context) => {
    const theme = context.globals.theme;
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    return <Story />;
  },
];