module.exports = {
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.e2e-spec.ts', '<rootDir>/test/**/*.spec.ts'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/utils/setup-e2e.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
