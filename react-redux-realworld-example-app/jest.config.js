module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Map node: protocol imports to regular module names
    '^node:(.+)$': '$1',
    // Handle CSS imports (if needed)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(superagent|parse5)/)'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/registerServiceWorker.js'
  ]
};
