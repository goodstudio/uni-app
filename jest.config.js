module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./scripts/setupJestEnv.ts'],
  globals: {
    __DEV__: true,
    __TEST__: true,
    __NODE_JS__: true,
    __VERSION__: require('./package.json').version,
    __BROWSER__: false,
    __GLOBAL__: false,
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    uni: {
      requireNativePlugin(name) {
        return {
          invokeSync(args, callback) {
            console.log(`invoke`, JSON.stringify(args))
          },
          invokeAsync(args, callback) {
            console.log(`invokeAsync`, JSON.stringify(args))
          },
        }
      },
    },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@dcloudio/(.*?)$': '<rootDir>/packages/$1/src',
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: { 'service\\.runtime\\.esm\\.js$': ['ts-jest'] },
}
