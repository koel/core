module.exports = {
  moduleFileExtensions: [
    'ts',
    'js',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/js/$1'
  },
  transform: {
    '^.+\\.(t|j)s?$': '<rootDir>/node_modules/ts-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  snapshotSerializers: [
    '<rootDir>/node_modules/jest-serializer-vue'
  ],
  globals: {
    KOEL_ENV: 'web',
    NODE_ENV: 'test'
  },
  setupFilesAfterEnv: ['<rootDir>/js/tests/setup.ts'],
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['lcov', 'json', 'html'],
  coverageDirectory: '<rootDir>/js/tests/__coverage__',
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/', '/stubs/', '/libs/']
}
