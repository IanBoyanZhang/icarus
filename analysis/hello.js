var print = function() {
	console.log('hello world');
};

print();

// var arr = new Array();
var arr = [1, 2, 3];

var arrRef = arr;
// (function(args) {
// 	console.log(args);
// })(1)

module.exports = {
	print: print
}