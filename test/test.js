var assert = require('chai').assert,
    _ = require('lodash'),
    rootDir = __dirname,
    sf = require('../');

sf.options({rootDir: rootDir});

describe('options', function () {
    var options = sf.options();
    it('should be an object with the correct properties', function () {
        assert.isObject(options);
        assert.propertyVal(options, 'debug', false);
        assert.propertyVal(options, 'environment', 'prod');
        assert.deepEqual(options, {
            debug: false,
            environment: 'prod',
            rootDir: rootDir
        });
    });
});

describe('parameters', function () {
    var parameters = sf.parameters();
    it('should be an object with the correct properties', function () {
        assert.deepEqual(parameters, {
            'kernel.debug': false,
            'kernel.environment': 'prod',
            'kernel.root_dir': rootDir,
            numeric: 123,
            string: 'ABC',
            alias: false,
            interpolated: 'ABC_123',
            nested: 'nest_ABC_123',
            array: ['one', 2, [false, 'ABCDEF']],
            object: {env: 'prod', percent: '100%'}
        });
    });
});
