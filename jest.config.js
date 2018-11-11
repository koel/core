module.exports = {
  moduleFileExtensions: [
    'js',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/js/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue'
  ],
  globals: {
    KOEL_ENV: 'web'
  },
  setupTestFrameworkScriptFile: '<rootDir>/js/tests/setup.js',
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['lcov', 'json', 'html'],
  coverageDirectory: '<rootDir>/js/tests/__coverage__',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/stubs/', '/libs/']
}
