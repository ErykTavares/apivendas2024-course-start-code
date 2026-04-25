/* eslint-disable @typescript-eslint/no-require-imports */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
    moduleFileExtensions: ['js', 'ts', 'json'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    testRegex: String.raw`.*\.int\.spec\.ts$`,
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: 'coverage/integration',
    testEnvironment: 'node',
};
