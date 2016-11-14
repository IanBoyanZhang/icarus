// Depend format

/*Each of these takes in a single AST node argument and returns a boolean.

isDefine: if node matches an AMD define function call (defining a module)
isRequire: if node matches a require function all (declaring a dependency)
isTopLevelRequire: if node matches a require at the very top of the file.
isAMDDriverScriptRequire: if node matches an AMD driver script's require call require([deps], function)
isExports: if the node matches CommonJS module.exports or exports (defining a module)
Detecting the various forms of defining an AMD module

isNamedForm: if the node is a define call of the form: define('name', [deps], func)
isDependencyForm: if the node is a define call of the form: define([deps], func)
isFactoryForm: if the node is a define call of the form: define(func(require))
isNoDependencyForm: if the node is a define call of the form: define({})
isREMForm: if the node matches the form: define(function(require, exports, module){}); */

var graph = require('../graph');
    // natives = require('../natives');
    // flowgraph = require('./flowgraph'),
    // callgraph = require('./callgraph');

var astutil = require('../astutil');

var bluePathConfig = require('./pathConfig').requireConfig();

// "expression": {
// "type": "CallExpression",
// "callee": {
//     "type": "Identifier",
//     "name": "define"
// },
// "arguments": [
//     {
//         "type": "FunctionExpression",
//         "id": null,
//         "params": [
//             {
//                 "type": "Identifier",
//                 "name": "require"
//             },
//             {
//                 "type": "Identifier",
//                 "name": "exports"
//             },
//             {
//                 "type": "Identifier",
//                 "name": "module"
//             }
//         ],
//         "body": {
//             "type": "BlockStatement",
//             "body": []
//         },
//         "generator": false,
//         "expression": false
//     }
// ]

// -------------------------------------------------------
// Utility
// -------------------------------------------------------
function isRequire(node) {
	if (!node) {
		return false;
	}

	var c = node.callee;
	return c && node.type === 'CallExpression' && 
		c.type === 'Identifier' &&
		c.name === 'require';
}

// define([dep], func)
function isDependencyForm(node) {
	if (!isRequire(node)) { return false; }

	var args = node['arguments'];
	return args && args[0].type === 'ArrayExpression';
}


// Blue stack
// File path mapping
// Convert arguments to path mapping
var BASE_PATH = '/Users/i658481/Workspace/digital-ui-area';
var SRC = '/src';
var JS = '.js'

/**
 * [endWith description]
 * @param  {[type]} last [description]
 * @return {[type]}      [description]
 */
function endWith(target, str) {
	return str.slice(-target.length) === target;
}

// Only stripe out beginning part of string before first '/'
/**
 * [transformPath description]
 * @param  {[type]} pathIn        [description]
 * @param  {[type]} requireConfig [description]
 * @return {[type]}               [description]
 */
function transformPath(pathIn, requireConfig) {
	var buf = '';
	var packagePath = '';
	console.log(pathIn);
	for(var iter = 0, len = pathIn.length; iter < len; iter+=1) {
		if (pathIn[iter] === '/' && packagePath === '') {
			packagePath = buf;
			buf = '';
		}
		buf += pathIn[iter];
	}

	// Now buf is remaining path
	var pathOut = '';
	if (requireConfig[packagePath]) {
		// debug
		// pathOut = requireConfig[packagePath] + buf;
		// debugFull path
		// pathOut = '/Users/i658481/Workspace/icarus/analysis' + '/' + requireConfig[packagePath] + buf;
		// TODO: optimize do not store leading string to both key and edges 
		// fileGraph hash
		pathOut = BASE_PATH + SRC + '/' + requireConfig[packagePath] + buf;

		if (!endWith('.js', buf)) {
			pathOut += JS;
		}
	} else {
		// console.warn('Blue stack: Could not find path in requireJS config for: ' + packagePath);
	}
	return pathOut;
}

// -------------------------------------------------------
// Interface
// -------------------------------------------------------
function buildDependencyGraph(ast, fileGraph) {
	// We would not add visited node to dep_graph, since astutil.visit 
	// is essentially a depth first search
	astutil.visit(ast, function(nd) {
		if (isRequire(nd) || isDependencyForm(nd)) {
			// Special case for require, there is only one argument
			var path = nd.arguments[0].value;
			// console.log(path);

			// console.log(transformPath(path, bluePathConfig));
			// console.log(bluePathConfig[path.split('/').shift()]);
			// Trial resolve dependencies
			
			// Hack:
			if (!path) {
				return;
			}
			// Cache
			var enclosingFileKey = fileGraph[nd.attr.enclosingFile];
			var resolvedPath = transformPath(path, bluePathConfig);

			// console.log(path)

			// TODO: Actually, if we can find that in end graph doesn't really matter
			// As long as, we have proper links
			if (enclosingFileKey && resolvedPath !== '') {
				// console.log(enclosingFileKey)
				// console.log('r' + resolvedPath);
				enclosingFileKey.push(resolvedPath);
			}
		}
	});
}

module.exports = {
	buildDependencyGraph: buildDependencyGraph
}