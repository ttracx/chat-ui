module.exports = {
  stories: [
    '../web/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../documentation/**/*.stories.mdx'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-docs',
    'storybook-addon-designs',
    'storybook-dark-mode'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  features: {
    storyStoreV7: true,
    buildStoriesJson: true
  },
  staticDirs: ['../assets'],
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation'
  }
};