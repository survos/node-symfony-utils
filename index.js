var path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    yaml = require('js-yaml'),
    options = {
        debug: false,
        rootDir: path.join(process.cwd(), 'app'),
        environment: 'prod'
    };

module.exports = {

    options: function (newOptions) {
        return _.extend(options, newOptions);
    },

    parameters: function (parametersFile) {
        if (!parametersFile) {
            parametersFile = path.join(options.rootDir, 'config', 'parameters.yml');
        }
        var parameters = yaml.safeLoad(fs.readFileSync(parametersFile), 'utf8').parameters;
        parameters['kernel.debug'] = options.debug;
        parameters['kernel.root_dir'] = options.rootDir;
        parameters['kernel.environment'] = options.environment;
        return expand(parameters);
    }
};

function expand(value, parameters) {
    var m;
    if (!parameters) {
        parameters = value;
    }
    if (_.isString(value)) {
        if (m = value.match(/^%([^%\s]+)%$/)) {
            value = m[1] in parameters ? expand(parameters[m[1]], parameters) : m[0];
        }
        else {
            value = value.replace(
                /%([^%\s]*)%/g,
                function (m, p1) {
                    return p1 ? (p1 in parameters ? expand(parameters[p1], parameters) : m) : '%';
                }
            );
        }
    }
    else if (_.isPlainObject(value) || _.isArray(value)) {
        _.each(value, function (v, k) {
            value[k] = expand(v, parameters);
        });
    }
    return value;
}
