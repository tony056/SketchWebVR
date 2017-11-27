var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
    value: true
});


var getDMMScale = function getDMMScale(distance) {
    return distance / 1000;
};

var getCurrentPath = function getCurrentPath(docObj) {
    return docObj.fileURL().path().split(docObj.displayName())[0];
};

var createWebVRFolder = function createWebVRFolder(path, folderName) {
    createFolder(path, folderName);
    return String(path) + '/' + String(folderName);
};

var createFolder = function createFolder(path, name) {
    deleteFolder(path, name);
    var fileManager = NSFileManager.defaultManager();
    fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error_(path + '/' + name, true, nil, nil);
};

var deleteFolder = function deleteFolder(path, name) {
    var fileManager = NSFileManager.defaultManager();
    fileManager.removeItemAtPath_error(path + '/' + name, nil);
};

var parseDepthInfo = function parseDepthInfo(name) {
    var arr = name.split('z_');
    log('arr: ' + String(arr));
    var depthStr = arr[arr.length - 1];
    var numArr = depthStr.split('e-').map(function (num) {
        return parseFloat(num, 10);
    });
    if (numArr.length !== 2) {
        numArr.push(0);
    }
    return numArr[0] * Math.pow(10, -numArr[1]);
};

var exportOptions = {
    "scales": "1",
    "formats": "png"
};

exports.getDMMScale = getDMMScale;
exports.exportOptions = exportOptions;
exports.getCurrentPath = getCurrentPath;
exports.createFolder = createFolder;
exports.parseDepthInfo = parseDepthInfo;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports['default'] = function (context) {
    var sketch = context.api();
    // sketch.log('wrapper:' + Object.getOwnPropertyNames(sketch.wrapperMappings()));
    var doc = sketch.selectedDocument;
    var page = doc.selectedPage;
    var docObj = doc.sketchObject;
    var fileFolder = (0, _utils.getCurrentPath)(docObj);
    sketch.log('path: ' + fileFolder);
    artboards = getArtboardsFromPage(sketch, page);
    // sketch.log('artboads: ' + artboards[0].name)
    // groups = getGroupsFromArtboards(sketch, artboards);


    // exportGroupsToImages(sketch, groups)
    exportToWebVR(sketch, 'sketch', artboards, fileFolder);
};

var _utils = __webpack_require__(0);

var _webvr = __webpack_require__(2);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var exportToWebVR = function exportToWebVR(sketch, docName, groups, currentPath) {
    // creat a webvr folder under current path
    var vrFolderName = String(docName) + '-webVR';
    (0, _utils.createFolder)(currentPath, vrFolderName);

    // creat img folder under the webvr folder
    var imgFolder = 'img';
    (0, _utils.createFolder)(String(currentPath) + '/' + vrFolderName, imgFolder);

    // export all groups as png files to img folder
    var outputPath = String(currentPath) + '/' + vrFolderName + '/' + imgFolder;
    exportGroupsToImages(sketch, groups, outputPath);

    // generate html content with groups info
    var html = (0, _webvr.createContent)(groups);
    var fileName = 'index.html';
    createPage(String(currentPath) + '/' + vrFolderName, fileName, html);
};

var createPage = function createPage(currentPath, name, content) {
    var path = String(currentPath) + '/' + String(name);
    saveTextToFile(path, content);
};

var saveTextToFile = function saveTextToFile(name, content) {
    // let path = [@"" stringByAppendingString:name];
    // let content = [@"" stringByAppendingString: content];
    var path = NSString.stringWithString(name);
    var data = NSString.stringWithString(content);
    data.dataUsingEncoding_(NSUTF8StringEncoding).writeToFile_atomically_(path, true);
};

var getArtboardsFromPage = function getArtboardsFromPage(sketch, page) {
    var layers = page.selectedLayers;
    var arts = [];
    layers.iterateWithFilter(function (layer) {
        return layer.isArtboard;
    }, function (layer) {
        sketch.log('layer name 1: ' + layer.name);
        // get groups and export each group as an image
        // exportGroupsToImages(sketch, layer)
        arts.push(layer);
    });
    return arts;
};

var getGroupsFromArtboards = function getGroupsFromArtboards(sketch, artboards) {
    var groups = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = artboards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var artboard = _step.value;

            subgroups = getGroupsFromArtboard(sketch, artboard);
            groups.push.apply(groups, _toConsumableArray(subgroups));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return groups;
};

var getGroupsFromArtboard = function getGroupsFromArtboard(sketch, artboard) {
    var groups = [];
    artboard.iterateWithFilter(function (layer) {
        return layer.isGroup;
    }, function (group) {
        groups.push(group);
    });
    return groups;
};

var exportGroupsToImages = function exportGroupsToImages(sketch, groups, output) {
    var d = 1;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = groups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var group = _step2.value;

            var scale = (0, _utils.getDMMScale)(d);
            // sketch.log('s: ' + scale);
            var x = group.frame.x;
            var y = group.frame.y;
            var w = group.frame.width * scale;
            var h = group.frame.height * scale;
            var options = _utils.exportOptions;
            options.output = output;
            sketch.log('w, h: ' + w + ', ' + h);
            // group.frame = new sketch.Rectangle(x, y, w, h);
            group['export'](options);
            // d += 1;
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createContent = undefined;

var _utils = __webpack_require__(0);

var HTML_HEAD = '<!DOCTYPE html>\n\
<html lang="en">\n\
<head>\n\
<meta charset="utf-8">\n\
<title>' + 'webVR' + '</title>\n\
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\
<script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script> \n\
</head>\n\
<body>\n\
<a-scene>\n';

var HTML_END = '<a-entity camera look-controls wasd-controls>\n\
<a-entity cursor="fuse: true;" position="0 0 -1" scale=".01 .01 .01" geometry="primitive: ring" material="color: #fff; shader: flat">\n\
</a-entity>\n\
</a-entity>\n\
</a-scene>\n\
</body>\n\
</html>\n';

var BASIC_SCENE_SOURCE = '<img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" crossorigin="anonymous">\n\
<img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" crossorigin="anonymous">\n';

var BASIC_SCENE = '<a-sky height="2048" radius="30" src="#skyTexture" theta-length="90" width="2048"></a-sky>\n';

var createContent = function createContent(groups) {
    var assets = createAssets(groups);
    var uis = createUIs(groups);
    return '' + HTML_HEAD + String(assets) + BASIC_SCENE + String(uis) + HTML_END;
};

var createAssets = function createAssets(groups) {
    var assets = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var group = _step.value;

            var name = group.name;
            // acubemap = `<a-cubemap id="${name}">\n\
            // <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Solid_gray.png">\n\
            // <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Solid_gray.png">\n\
            // <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Solid_gray.png">\n\
            // <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Solid_gray.png">\n\
            // <img src="./img/${name}.png">\n\
            // <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Solid_gray.png">\n\
            // </a-cubemap>\n`;
            var id = name.toLowerCase().replace(' ', '-');
            log('id: ' + String(id));
            assets += '<img id="' + String(id) + '" src="./img/' + String(name) + '.png">\n';
            // assets += acubemap;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return '<a-assets>\n' + BASIC_SCENE_SOURCE + assets + '</a-assets>\n';
};

var createUIs = function createUIs(groups) {
    var uis = '';
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = groups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var group = _step2.value;

            var name = group.name;
            var frame = group.frame;
            var d = (0, _utils.parseDepthInfo)(name);

            var _scaleUIs = scaleUIs(frame.width, frame.height, d),
                width = _scaleUIs.width,
                height = _scaleUIs.height;

            var _placeUIs = placeUIs(frame.x, frame.y, width, height, d),
                x = _placeUIs.x,
                y = _placeUIs.y;

            log('name: ' + String(name) + ', x: ' + String(x) + ', y: ' + String(y) + ', d:' + String(d) + ', w: ' + String(width) + ', h: ' + String(height));
            // uis += `<a-entity>\n\
            // <a-entity geometry="primitive: box; width: ${width}; height: ${height}; depth: 0.001;" material="side: front; src: #${name}" position="${x} ${y} ${d}"></a-entity>\n\
            // <a-entity geometry="primitive: box; width: ${width}; height: ${height}; depth: 0.001;" material="side: back; src: https://upload.wikimedia.org/wikipedia/commons/b/b3/Solid_gray.png" position="${x} ${y} ${d}"></a-entity>\n\
            // </a-entity>\n`;
            uis += '<a-image width="' + String(width) + '" height="' + String(height) + '" position="' + String(x) + ' ' + String(y) + ' ' + String(d) + '" src="#' + String(name.toLowerCase().replace(' ', '-')) + '" rotation="0 180 0"></a-image>\n';
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return uis;
};

var scaleUIs = function scaleUIs(w, h, d) {
    var scale = (0, _utils.getDMMScale)(d);
    return { width: w * scale, height: h * scale };
};

var placeUIs = function placeUIs(x, y, w, h, d) {
    var scale = (0, _utils.getDMMScale)(d);
    return { x: x * scale + w / 2, y: -(y * scale + h / 2) + 0.5 };
};

exports.createContent = createContent;

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')
