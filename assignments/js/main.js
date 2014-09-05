// 3.1: Constructor object
function Person(name){
	this.name = name;
	this.speak = function(){
		console.log(name + " Says: 'Sup bro..'.");
	};
}

var Bob = new Person("Bob");
Bob.speak();


// 3.2: Prototype
Person.prototype.walk = function(){
	console.log(this.name + " is walking.");
};

Person.prototype.eat = function(){
	console.log(this.name + " is eating.");
};

Bob.walk();
Bob.eat();


// 3.3: Object Literal
var Pino = {
	name: "Pino",
	speak: function(){
		console.log("What. The. Fuck. Do you want from me?");
	},
	walk: function(){
		console.log(this.name + " is walking.");
	},
	eat: function(){
		console.log(this.name + " is eating.");
	}

};

console.log(Pino.name + " Answers:");
Pino.speak();
Pino.walk();
Pino.eat();


// 4.1: Local Scope
var f = function(){
	var iterator;
	var min;
	var max;
};

// 4.2: Global Scope
var iterator;
var min;
var max;

// 4.3: Closure
function init() {
  var name = "Closure example."; // Name is a local variable created by init.
  function logName() { // logName() is the inner function, a closure.
    console.log(name); // logName() uses a variable declared in the parent function.    
  }
  logName();
}

init();


