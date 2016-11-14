/*******************************************************************************
  Test based on Max's work
 *******************************************************************************/

var bindings = require('./acg.js-master/bindings'),
    astutil = require('./acg.js-master/astutil'),
    pessimistic = require('./acg.js-master/pessimistic'),
    semioptimistic = require('./acg.js-master/semioptimistic'),
    diagnostics = require('./acg.js-master/diagnostics'),
    fs = require('fs');

// Dependo
var dependo = require('./acg.js-master/dependo/dependo');

var files = ['./hello.js',
             './readHello.js',
             './single.js',
             './callSingle.js',
             '/Users/i658481/Workspace/digital-ui-area/src/dashboard/profile/js/lib/phoneValidator/decorator.js'];

// Test read file list

var arr = fs.readFileSync('../fileList', 'utf8').split('\n').filter(function(path) {
  // TODO: regex file path?
  return path !== '';
});

// Below source code files are actually json files with js extension
// /Users/i658481/Workspace/digital-ui-area/src/dashboard/json/payments/payMortgage/scheduleHomeEquityAutomaticPaymentConfirm.js
// /Users/i658481/Workspace/digital-ui-area/src/dashboard/json/payments/payBills/confirmation.js
// /Users/i658481/Workspace/digital-ui-area/src/dashboard/json/payments/payMortgage/scheduleHomeEquityAutomaticPaymentVerify.js
// /Users/i658481/Workspace/digital-ui-area/src/dashboard/json/payments/payMortgage/schMortgagePaymentConfirm.js
// /Users/i658481/Workspace/digital-ui-area/src/dashboard/json/payments/payMortgage/schMortgagePaymentOptions.js
// /Users/i658481/Workspace/digital-ui-area/src/dashboard/json/payments/payMortgage/schMortgagePaymentVerify.js

var files = arr.slice(0, 1000);

// var files = ['./hello.js',
//              './readHello.js',
//              './single.js',
//              './callSingle.js']

// var files = ['./hello.js'];
// var files = ['./readhello.js'];

// var files = ['/Users/i658481/Workspace/digital-ui-area/src/dashboard/profile/js/lib/phoneValidator/decorator.js'];

var fileGraph = {}
// Does visited flag really matter?
files.forEach(function(file) {
  fileGraph[file] = [];
});

var sources = files.map(function(file) {
	return { filename: file,
	         program: fs.readFileSync(file, 'utf-8') };
});
var times = [];

var ast = astutil.buildAST(sources);
bindings.addBindings(ast);
var cg;

cg = pessimistic.buildCallGraph(ast, true);

// console.log(cg.fg.dotify());
  // cg.fg.writeDOTFile('../dotFile');


// console.log(cg.fg.toD3());
// cg.fg.toD3Json('../d3Data.json');

// if(args.cg) {
  function pp(v) {
    if(v.type === 'CalleeVertex')
  	  return astutil.ppPos(v.call);
  	if(v.type === 'FuncVertex')
  	  return astutil.ppPos(v.func);
  	if(v.type === 'NativeVertex')
  	  return v.name;
  	throw new Error("strange vertex: " + v);
  }

  var d3Data = {
    links: []
  };

  // Value color map
  // 0: root node
  // 1: call graph
  // 2: dependency
  cg.edges.iter(function(call, fn) {
  	// console.log(pp(call) + " -> " + pp(fn));
    // console.log(pp(call)); 

    var d3link = {
      // source: call.attr.pp(),
      // target: fn.attr.pp(),
      source: call.attr.node_id,
      target: fn.attr.node_id,
      payload: { 
        src: call.attr.pp(),
        tgt: fn.attr.pp()
      },
      // value: edge type? How do we leverage edge type?
      value: 1
    }
    // // d3Data.nodes.push(d3node);
    d3Data.links.push(d3link);

    // 10/03/16
    // Add node to enclosingFile to call_graph only
    // Not flow graph
    // console.log(call.call.attr.enclosingFile);
    d3Data.links.push({
      source: call.attr.node_id,
      target: call.call.attr.enclosingFile,
      payload: {
        src: '',
        tgt: call.call.attr.enclosingFile
      },
      value: 0
    });
  });

  // Right now mostly for testing
  dependo.buildDependencyGraph(ast, fileGraph);

  /**
   * [addDepEdges description]
   * @param {[type]} Required to be array/object which can be processed
   * in references
   */
  (function addDepEdges(fileGraph, outputLinks) {
    Object.keys(fileGraph).forEach(function(enclosingFileKey) {
      console.log(enclosingFileKey);
      fileGraph[enclosingFileKey].forEach(function(target) {
        outputLinks.push({
          source: enclosingFileKey,
          target: target,
          //TODO: Payload src/tgt is required by Client side
          payload: {
            src: '',
            tgt: ''
          },
          value: 2
        });
      });
    });
  })(fileGraph, d3Data.links);

  var fn = '../d3.json';
  var d3Json = JSON.stringify(d3Data);
  fs.writeFileSync(fn, d3Json)


  // ast.programs.forEach(function(program) {
  //   console.log(program.body);
  // });

  // ast.attr.calls.forEach(function(elem) {
  //   console.log(elem.attr);
  // });
  // console.log(ast.attr.calls.length);
  // console.log(dotFile);


// console.log(fileGraph);

// TODO: 10/04/2016
// Idea: hide file root list (Leaves only root node for dependency connection)
// x1. Hash file node to independent graph
// TODO: [0, 3000] files running out of memory
// Scale node radius based on number of
// Run only dashboard?
// x2. Connect node graph through path
// x2.5 Support multiple define/require dependencies
// x3. Then use different color label/path
// 4. directed graph
// 5. filter graph by different color label
// 6. Only connect output interface with root node
// 7. Global Optimization by removing cached base path


// Build dependency graph
// Counting how many files under digital-ui-area/src
// find . -type f | wc -l
// Gives: 6328
// ls -l | grep -v ^l | wc -l 
// find . -type f | wc -l | grep -v ^l
// Turns out there is no symbolic link