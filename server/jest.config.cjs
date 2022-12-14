module.exports = {
  'preset': 'ts-jest',
  'roots': [
    '<rootDir>/tests',
    '<rootDir>/lib/tests'
  ],
  'testMatch': [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  'transform': {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
}
