/*******************************************************************************
 * Copyright (c) 2013 Max Schaefer.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Max Schaefer - initial API and implementation
 *******************************************************************************/

/* This module provides an AST visitor function, and several
 * other utility functions. */
var esprima = require('./esprima');
    
/* AST visitor */
function visit(root, visitor) {
  function doVisit(nd, parent, childProp) {
    if(!nd || typeof nd !== 'object')
      return;
    
    if(nd.type) {
      var res = visitor(nd, doVisit, parent, childProp);
      if(res === false)
        return;
    }
    
    for(var p in nd) {
// skip over magic properties
      if(!nd.hasOwnProperty(p) || p.match(/^(range|loc|attr|comments|raw)$/))
        continue;
      doVisit(nd[p], nd, p);
    }
  }
  
  doVisit(root);
}

/* Set up `attr` field that can be used to attach attributes to
 * nodes, and fill in `enclosingFunction` and `enclosingFile`
 * attributes. */
function init(root) {
  var enclosingFunction = null, enclosingFile = null;
  // global collections containing all functions and all call sites
  root.attr.functions = [];
  root.attr.calls = [];
  visit(root, function(nd, visit, parent, childProp) {
    if(nd.type && !nd.attr)
      nd.attr = {};
    
    if(enclosingFunction)
      nd.attr.enclosingFunction = enclosingFunction;
    if(enclosingFile)
      nd.attr.enclosingFile = enclosingFile;

    if(nd.type === 'Program')
      enclosingFile = nd.attr.filename;
    
    if(nd.type === 'FunctionDeclaration' || nd.type === 'FunctionExpression') {
      root.attr.functions.push(nd);
      nd.attr.parent = parent;
      nd.attr.childProp = childProp;
      var old_enclosingFunction = enclosingFunction;
      enclosingFunction = nd;
      visit(nd.id);
      visit(nd.params);
      visit(nd.body);
      enclosingFunction = old_enclosingFunction;
      return false;
    }

    if(nd.type === 'CallExpression' || nd.type === 'NewExpression')
      root.attr.calls.push(nd);
  });
}

/* Simple version of UNIX basename. */
function basename(filename) {
  if(!filename)
    return "<???>";
  var idx = filename.lastIndexOf('/');
  if(idx === -1)
    idx = filename.lastIndexOf('\\');
  return filename.substring(idx+1);
}

/* Pretty-print position. */
function ppPos(nd) {
  return basename(nd.attr.enclosingFile) + "@" + nd.loc.start.line + ":" + nd.range[0] + "-" + nd.range[1];
}

/* Build an AST from a collection of source files. */
function buildAST(sources) {
  var ast = {
    type: 'ProgramCollection',
    programs: [],
    attr: {}
  };
  sources.forEach(function(source) {
    var prog = esprima.parse(source.program, { loc: true, range: true });
    prog.attr = { filename: source.filename };
    ast.programs.push(prog);
  });
  init(ast);
  return ast;
}

module.exports.visit = visit;
module.exports.init = init;
module.exports.ppPos = ppPos;
module.exports.buildAST = buildAST;