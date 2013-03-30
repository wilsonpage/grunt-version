
/**
 * Module Dependencies
 */

var extname = require('path').extname;

/**
 * Locals
 */

var regex = {
  json: /"version":.+"([\d\.]+)"/g,
  jsdoc: /@version ([\d\.]+)/g,
  js: /\.version(?:[ \=]+)(?:['"])([\d\.]+)(?:['"])/gi
};

/**
 * Exports
 */

module.exports = function (grunt) {

  grunt.registerMultiTask('version', function() {
    var pkg = grunt.config.data.pkg;
    var version = grunt.option('set');

    if (!version) return console.log(pkg.version);

    this.files.forEach(function(file) {
      file.src.forEach(function(file) {
        var src = grunt.file.read(file);
        var ext = extname(file);

        if (ext === '.json') {
          src = replaceVersion(src, regex.json, version);
        } else if ('.js') {
          src = replaceVersion(src, regex.js, version);
          src = replaceVersion(src, regex.jsdoc, version);
        }

        grunt.file.write(file, src);
        grunt.log.writeln('File "' + file + '" version updated to #' + version);
      });
    });
  });
};


function replaceVersion(string, regex, version) {
  return string.replace(regex, function(match, group) {
    return match.replace(group, version);
  });
}