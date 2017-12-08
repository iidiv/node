## 继承

在面向对象的语言中, 大多语言都支持两种继承方式: `接口继承` 和 `实现继承`, `接口继承` 只继承方法签名, `实现继承` 才继承实际的方法, `ECMAScript` 值支持 `实现继承`, 今天我们来谈谈实现继承的几种方式

### 原型链

关于原型链的知识我们前面已经介绍过了, 详情请见 [原型链](#/prototype), 在 js 中原型链是实现继承的主要方法, 实现原理是利用原型链让一个引用类型继承另一个引用类型的属性和方法, 在阅读此章节需要对前面的原型有较深的理解, 而且最好能够清晰的描述出 js 中几大引用类型构造器之间的原型链, 现在来看个 Demo

```js
let Car = function(brand) {
	this.brand = brand;
};

Car.prototype.getBrand = function() {
	console.log(this.brand);
};

let Ferrari = function() {
	this.brand = 'ferrari';
}

// 实现继承
Ferrari.prototype = new Car('rover');
let inst = new Ferrari();
inst.getBrand();   //ferrari
console.log(inst instanceof Car);   // true

```

这里需要说明一下, `instanceof` 只要实例的原型链中出现的构造器都会返回 `true`, 使用字面量和使用拓展的形式 `Ferrari.prototype = new Car('rover')` VS `Ferrari.prototype.getBrand = new Car('rover')` 两种方式存在一些差别, 前者是重写了子类的原型, 也就是说子类原型的内存地址已经发生了变化, 这有会导致原来的实例全部丢失与现在的原型的联系, 后者是拓展子类的原型, 并不会导致切断原来的实例与现在的原型的联系, 因为子类的原型还是原来内存中的那个对象, 并不只是原型链继承才会出现这样的差别, 这是 js 语言导致的, `堆内存` 本身就具有这样的特性. 其实原型继承还存在一个缺点, 那就是当原型链里有引用类型的值的时候会出现一些问题, 请看 Demo

```js
let Car = function(brand) {
	this.options = {
		color: 'red'
	};
};

let Ferrari = function() {};

// 实现继承
Ferrari.prototype = new Car();

let ferrari1 = new Ferrari();
ferrari1.options.price = '$100';

let ferrari2 = new Ferrari();
console.log(ferrari2.options.price);   // $100
```

原型链中有引用类型的值时修改该值时会影响到其他实例, 这不是我们希望看到的

### 借用构造函数
实现思路: 在子类里借用父类的构造器来实现, Demo 如下

```js

let Car = function(brand) {
	this.options = {
		color: 'red'
	};
};

let Ferrari = function() {
	Car.call(this);
};

// 实现继承
Ferrari.prototype = new Car();

let ferrari1 = new Ferrari();
ferrari1.options.price = '$100';

let ferrari2 = new Ferrari();
console.log(ferrari2.options.price);   // undefined
```

构造函数继承也存在一些问题, 比如 当继承方法时, 我们希望这些实例全部共享一个方法, 但是借用构造函数这种继承方式, 所有的继承都发生在构造函数内部, 那么每次创建一个实例都会重新创建一个方法(内存地址不同), 这样就导致了代码复用率降低

### 组合继承
实现思路, 使用原型链继承实现原型属性和方法的继承, 借用构造函数实现实例属性的继承

```js
let Car = function(brand) {
	this.options = {
		color: 'red'
	};
};

Car.prototype.getOptions = function() {
	console.log(Object.keys(this.options));
};

// 实现继承
let Ferrari = function() {
	Car.call(this);
};

Ferrari.prototype = new Car();

let ferrari1 = new Ferrari();
ferrari1.options.price = '$100';
ferrari1.getOptions() 	// ['color', 'price']

let ferrari2 = new Ferrari();
ferrari2.getOptions() 	// ['color']
```

这种继承方式避免了原型链继承和借用构造函数的缺点, 融合了它们的优点, 是最常用的继承方式

### 原型式继承

如果只是在两个对象之间实现继承, 我们可以考虑使用该方法

```js
let object = (o) {
	function F() {};
	F.prototype = o;
	return new F();
};
// 本质上 `object` 只是对传入的对象进行了一次浅复制

let ferrari = {
	color: 'red'
};

let myCar = object(ferrari);
console.log(myCar.color); 	// red
```

在 `ES5` 中有一个方法叫 `Object.create()` 实现了相似的行为

### 寄生式继承
这种继承是和原型式继承紧密相关的一种继承方式, 也是运用于对象之间的继承

```js
let copy = function(o) {
	let clone = Object.create(o);
	clone.getColor = function() {
		console.log(this.color);
	};
};

let ferrari = {
	color: 'red'
};

let myCar = copy(ferrari);
myCar.getColor(); 	// red
```

### 寄生组合式继承

前面谈到的 `组合式继承` 已经相当完美, 但是还有一点瑕疵, 就是父函数会有一次没必要的调用

```js
let Car = function(brand) {
	this.options = {
		color: 'red'
	};
};

Car.prototype.getOptions = function() {
	console.log(Object.keys(this.options));
};

// 实现继承
let Ferrari = function() {
	Car.call(this);			// 第2次调用
};

Ferrari.prototype = new Car();	第1次调用

let ferrari1 = new Ferrari();
ferrari1.options.price = '$100';
ferrari1.getOptions() 	// ['color', 'price']
```
我们对其进行一次改造, 减少一次调用, Demo如下

```js
let extendsSuper = function(sub, superFunc) {
	let proto = Object.create(superFunc.prototype);
	proto.constructor = sub;
	sub.prototype = proto;
};

let Car = function(brand) {
	this.options = {
		color: 'red'
	};
};

Car.prototype.getOptions = function() {
	console.log(Object.keys(this.options));
};

// 实现继承
let Ferrari = function() {
	Car.call(this);			
};

extendsSuper(Ferrari, Car);		// 在此减少了调用父函数次数

let ferrari1 = new Ferrari();
ferrari1.options.price = '$100';
ferrari1.getOptions() 	// ['color', 'price']
```

## 小结

1. 在实现两个构造器之间的继承时我们推荐使用 `组合继承` 和 `寄生式组合继承`
2. 在实现两个对象之间的继承我们推荐使用 `原型式继承`(可以使用 `ES5` 的 `Object.create()`) 和 `寄生式继承`