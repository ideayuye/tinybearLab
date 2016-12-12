var assert = require('assert');

/*
    函数记忆
*/
Function.prototype.memoized = function(key){
    this._values = this._values || {};
    return this._values[key] !== undefined ? this._values[key] : 
            this._values[key] = this.apply(this,arguments);
}

Function.prototype.memorize = function(){
    var fn = this;
    return function(){
        return fn.memoized(arguments);
    }
}

var isPrime = (function isPrime(num){
    var prime = num != 1;
    for(var i = 2;i<num;i++){
        if(num % i == 0){
            prime = false;
            break;
        }
    }
    return prime;
}).memorize();

assert(isPrime(5),'it is ok');
// assert(isPrime._values[5],"The answer has been cache");


/*
    函数包装
*/
function wrap(object,method,wrapper){
    var fn = object[method];
    return object[method] = function(){
        return wrapper.apply(this,[fn.bind(this)].concat(
            Array.prototype.slice.call(arguments)
        ));
    }
}

/*
prototype 源码 包装readAttribute函数
if(prototype.Browser.Opera){
    wrap(Element.Methods,"readAttribute",function(original,elem,attr){
        return attr == "title" ? 
            elem.title:
            original(elem,attr);
    })
}
*/


/*
    原型
*/
function Ninja(){
    this.swung = true;
}

var ninja = new Ninja();

Ninja.prototype.swingSword = function(){
    return this.swung;
}

assert(ninja.swingSword(),"it is error");


(function(){
    var initializing = false,
        superPattern = /xyz/.test(function(){xyz;})?/\b_super\b/:/.*/;
    
    Object.subClass = function(properties){
        var _super = this.prototype;

        initializing = true;
        var proto = new this();
        initializing = false;

        for(var name in properties){
            proto[name] = typeof properties[name] == "function" &&
                          typeof _super[name] == "function" &&
                          superPattern.test(properties[name])?
                          (function(name,fn){
                            return function(){
                                var tmp = this._super;
                                this._super = _super[name];
                                var ret = fn.apply(this,arguments);
                                this._super = tmp;
                                return ret;
                            }
                          })(name,properties[name]):
                          properties[name];
        }

        function Class(){
            if(!initializing && this.init){
                this.init.apply(this,arguments);
            }
        }

        Class.prototype = proto;
        Class.constructor = Class;
        Class.subClass = arguments.callee;
        return Class;
    }

})()

var Person = Object.subClass({
    init:function(isDancing){
        this.dancing = isDancing;
    },
    dance:function(){
        return this.dancing;
    }
});

var Ninja1 = Person.subClass({
    init:function(){
        this._super(false);
    },
    dance:function(){
        return this._super();
    },
    swingSword:function(){
        return true;
    }
});


var person = new Person(true);
var n1 = new Ninja1();

console.log( person.dance());
console.log( n1.dance());


/*
    即时函数
*/


/*var t = {name:'t'};

t.tx = function(){
    (function(){
        console.log(this);//window
    })();
}

t.tx();*/

console.log('success to end');

