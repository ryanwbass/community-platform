const path = require('path')
const paths = {
  appSrcDir: path.resolve(__dirname, '../../../'),
}

module.exports = {
  stories: ['../../../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  // https://github.com/storybookjs/presets/tree/master/packages/preset-create-react-app
  addons: [
    {
      name: '@storybook/preset-create-react-app',
      options: {
        tsDocgenLoaderOptions: {
          tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
        },
      },
    },
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
    '@storybook/addon-actions',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
  ],
  // https://storybook.js.org/docs/react/configure/typescript
  typescript: {},
  // update path resolution so root folder correctly checked for direct 'src' imports (before other folders)
  // https://webpack.js.org/configuration/resolve/#resolve-modules
  // https://storybook.js.org/docs/react/configure/webpack
  webpackFinal: async config => {
    config.resolve.modules = [
      paths.appSrcDir,
      ...(config.resolve.modules || []),
    ]
    return config
  },
}
