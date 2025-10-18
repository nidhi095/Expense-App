module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // other plugins if any...
    'react-native-worklets/plugin', // MUST be last
  ],
};
