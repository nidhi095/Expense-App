module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // other plugins if any...
    '@babel/plugin-transform-export-namespace-from',
    'react-native-worklets/plugin', // MUST be last
  ],
};
