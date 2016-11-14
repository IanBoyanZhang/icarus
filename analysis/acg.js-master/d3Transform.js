// See flowgraph.js for type references
// Types
var vertexMap = {
	FuncVertex: 1,
	UnknownVertex: 2,
	PropertyVertex: 3,
	NativeVertex: 4,
	parmVertex: 5,
	ArgumentVertex: 6,
	ReturnVertex: 7,
	ResVertex: 8,
	ExprVertex: 9,
	CalleeVertex: 10,
	VarVertex: 11
};

/**
 * TODO: define interface
 * Input
 * Output
 */

function toD3VertexFormat(graph) {
	var d3Data = {
		nodes: [],
		links: []
	};

	graph.iter(function(from, to) {
		// if (to.attr.pp())
		var d3link = {
			// source: from.attr.pp(),
			// target: to.attr.pp(),
			source: from.attr.node_id,
			target: to.attr.node_id,
			// value: edge type? How do we leverage edge type?
			value: 1
		}
		// d3Data.nodes.push(d3node);
		d3Data.links.push(d3link);
	});

	// Create nodes with all possible nodes 
	// With available edges 
	for(var i=0, len=graph.id2node.length; i<len;i+=1) {
		if(!graph.id2node[i]) { continue; }

		var d3node = {
			// name: graph.id2node[i].attr.node_id,
			name: graph.id2node[i].attr.pp(),
			// group: graph.id2node[i].type
			group: vertexMap[graph.id2node[i].type]
			// TODO: issue circular reference if we do something below
			// Full data payload
			// data: graph.id2node[i]
			// TODO: pass symbol table information?
		}
		console.log(d3node);
		d3Data.nodes.push(d3node);
	}

	return d3Data;
}

module.exports.toD3VertexFormat = toD3VertexFormat;