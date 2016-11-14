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

/* Module for converting a graph into DOT format. */
// if(typeof define !== 'function') {
//   var define = require('amdefine')(module);
// }

  var d3Transform = require('./d3Transform');
// define(function(require, exports) {
  var graph = require('./graph'),
      fs = require('fs');

  graph.Graph.prototype.dotify = function() {
  	var res = "";
  	res += "digraph FG {\n";
  	this.iter(function(from, to) {
  	  res += '  "' + from.attr.pp() + '" -> "' + to.attr.pp() + '";\n'; 
      // res += '  "' + Object.keys(from) + '";\n';   
      // res += '  "' + from.type + '";\n';   
  	});
  	res += "}\n";
  	return res;
  };

  graph.Graph.prototype.writeDOTFile = function(fn) {
    fs.writeFileSync(fn, this.dotify());
  };

  // Added by Boyan to label the vertices
  // TODO: How to group it/label it
  graph.Graph.prototype.toD3 = function() {
    return d3Transform.toD3VertexFormat(this);
  };

  graph.Graph.prototype.toD3Json = function(fn) {
    var d3Json = JSON.stringify(d3Transform.toD3VertexFormat(this));
    fs.writeFileSync(fn, d3Json)
  };
//   return exports;
// });