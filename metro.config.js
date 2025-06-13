// metro.config.js

const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .cjs modules that Firebase uses
config.resolver.sourceExts.push('cjs');

// Disable strict package exports so Metro can resolve Firebase internals
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
