module.exports = {
  testEnvironment: "jsdom",
  clearMocks: true,

  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",

    // See https://github.com/molefrog/wouter/issues/126#issuecomment-667661129
    "^wouter/(.*)$": "wouter/cjs/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.tsx"],
};
