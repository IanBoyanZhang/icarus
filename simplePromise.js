// Specification

// Fulfilled
// Rejected
// Pending
// Settled

// Thenable

// Sample usage
// var promise = new Promise(function(resolve, reject) {
// 	do a thing, possibly async, then...
// 	if (/* everything turned out fine*/) {
// 		resolve("Stuff worked!");
// 	} else {
// 		reject(Error("It broke"));
// 	}
// });

// Thenable promise
// promise.then(function(result) {
//    console.log(result);
// }, function(err) {
// 	   console.error(err);
// });

// executor function is executed immediately by the Promise implementation, 
// passing resolve and reject functions (the executor is called before the Promise constructor
// even returns the created object).
// Initiates some async work and then, once that completes, calls either the resolve or reject 
// function to resolve the promise or else reject it if an error occured.


// Constructor
// function Promise(executor) {
// 	var resolve,
// 		reject;

// 	var pending = true;
// 	executor(resolve, reject);
// }

// Promise.prototype.resolve = function() {
// 	this.
// }


function Promise(executor) {
	this._PromiseStatus = 'pending';
	this._PromiseValue;

	// Error try catch?
	try {
		executor(this.resolve, this.reject);
	} catch (e) {
		this.reject(e);
	};
	this._pending = true;
	return this;
}

Promise.prototype.resolve = function(value) {
	this._PromiseStatus = 'fulfilled';
	this._PromiseValue = value
	// call corresponding then function
	return this._PromiseValue;
};

Promise.prototype.reject = function(reason) {
	this._PromiseStatus = 'rejected';
};

// or = function(function(onFullfilled, onRejected) {})
Promise.prototype.then = function(onFullfilled, onRejected) {
	if (this._PromiseStatus === 'pending') {

	}

	// if (this._PromiseStatus === '')
};
// function constructor(x, y) {
// 	this.x = x || 0;
// 	this.y = y || 0;
// }

// constructor.prototype.addX = function(val) {
// 	this.x += val;
// };


// var data = new constructor(3, 5);
// data.addX(1);
// console.log(data.x);