module.exports = {
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "./node_modules/ts-jest/preprocessor.js",
    "^.+\\.js$": "./transform/requireExt.js"
  },
  transformIgnorePatterns : [
    "node_modules/(?!(egg-core/lib/loader/file_loader.js|egg-core/lib/utils/index.js))"
  ],
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node"
};
