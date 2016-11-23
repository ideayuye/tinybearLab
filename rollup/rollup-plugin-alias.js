'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));

// Helper functions
var noop = function () {
  return null;
};
var startsWith = function (needle, haystack) {
  return !haystack.indexOf(needle);
};
var endsWith = function (needle, haystack) {
  return haystack.slice(-needle.length) === needle;
};
var isFilePath = function (id) {
  return (/(^\.?\/)|(^[a-zA-Z]\:(\\|\/))/.test(id)
  );
};
var exists = function (uri) {
  try {
    return fs.statSync(uri).isFile();
  } catch (e) {
    return false;
  }
};

function alias() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var hasResolve = Array.isArray(options.resolve);
  var resolve = hasResolve ? options.resolve : ['.js'];
  var aliasKeys = hasResolve ? Object.keys(options).filter(function (k) {
    return k !== 'resolve';
  }) : Object.keys(options);

  // No aliases?
  if (!aliasKeys.length) {
    return {
      resolveId: noop
    };
  }

  return {
    resolveId: function (importee, importer) {
      // First match is supposed to be the correct one
      var toReplace = aliasKeys.find(function (key) {
        return startsWith(key, importee);
      });

      if (!toReplace) {
        return null;
      }

      var entry = options[toReplace];

      var updatedId = importee.replace(toReplace, entry);

      if (isFilePath(updatedId)) {
        var _ret = function () {
          var directory = path.dirname(importer);

          // Resolve file names
          var filePath = path.resolve(directory, updatedId);
          var match = resolve.map(function (ext) {
            return '' + filePath + ext;
          }).find(exists);

          if (match) {
            return {
              v: match
            };
          }

          // To keep the previous behaviour we simply return the file path
          // with extension
          if (endsWith('.js', filePath)) {
            return {
              v: filePath
            };
          }

          return {
            v: filePath + '.js'
          };
        }();

        if (typeof _ret === "object") return _ret.v;
      }

      return updatedId;
    }
  };
}

module.exports = alias;
