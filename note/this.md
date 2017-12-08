# this 相关讨论


this 作为关键词在 js 中有着相当重要的作用, 我们这次主要讨论一下 this 在不同情况下的指向

## 作为普通函数调用

我们知道, 在函数执行代码之前会初始化自己的作用域, 此时就有两个重要的角色生成, 一个是 `this`,另一个是 'arguments', 我们这次只讨论 `this`, 如果仅仅是函数的调用, 此时的 `this` 是指向 `window` 对象, 在严格模式下 `this` 是 `undefined`

```js
(function() {console.log(this === window);}());	// true;
(function() {'use strict'; console.log(this === undefined);}()); //true
```

## 作为构造函数调用

当我们使用 `new` 操作符去调用一个对象的时候 `this` 指向实例化的对象, 这点比较常见, 此时最好不要去用 return 出一个引用类型的值去替代 `this` 返回

```js
console.log(new (function(a) {this.a = a;})(1));	// {a: 1}
```

## 作为箭头函数调用

这种用法在我们的分享 `函数的拓展` (孙凡云分享)中有讲, 在此不细说, `this` 指向该方法的作用域中的 `this`
```js
( x => (x => console.log(this === window))() )();			// true
( x => (x => console.log(this === window)).bind({})() )();	// true
```
箭头函数无视 `bind` 等类似方法, 使用时要注意这点

## 作为对象的方法调用

在定义对象的时候, 如果某个键的值是 `Function` 类型我们称这样的键是方法, 当对象调用自己的方法时, 该方法内部的 `this` 便指向了对象自己

```js
({
	color: 'red', 
	showColor: function() {console.log(this.color)}
}).showColor();			// red;
```

## apply, call, bind 时

这三种调用方式对 `this` 的影响是一样的, `this` 的具体指向和传入的第一个参数有关, 非严格模式下程序执行的时候会对第一个入参进行一个类型转换, js 尝试将其转换成其对应的包装类型, 如果转化失败 `this` 就指向 `window`
, 严格模式下不进行转换, `this` 指向传入的第一个参数


```js
(function(){
	var foo = function() {
		'use strict';
		console.log(this);	
	};

	(function() {
		foo.call(1);				// 1
		foo.call('hello world');	// hello world
		foo.call(true);				// true
		foo.call(null);				// null
		foo.call(undefined);		// undefined
		foo.call({});				// {}
	}());

	foo = function() {
		console.log(this);	
	};

	(function() {
		foo.call(1);				// 1的包装类型, 即 new Number(1), 下面一样
		foo.call('hello world');	// 'hello world'的包装类型
		foo.call(true);				// true的包装类型
		foo.call(null);				// null无包装类型, window
		foo.call(undefined);		// undefined无包装类型, window
		foo.call({});				// {}
	}());
}());

```

大家验证上面的 Demo 的时候注意里面的分号, 我使用的这种写法里面的分号不能随意省略; 

## bind 后的函数

一旦函数被 `bind` 了, 那么它里面的 `this` 便已 `认主` 了, 无法再次修改

```js
let foo = function() {
	console.log(this);
};

let obj = { a: 1 };

let bar = foo.bind(obj);

let oth = bar.bind({});

bar(), oth();	// {a: 1} 	{a: 1}
```

## 一些其他的场景
下面说的这些场景都能利用上面的知识进行分析, 只是写法有些不一样, 道理还是上面讲的部分

```js
var x = 1;

var obj = {
	x: 100,
	showX: function() {
		console.log(this.x);
	}
};

let showX = obj.showX;

showX();					// 1
(obj.showX)();				// 100
(obj.showX = obj.showX)();	// 1
(x => obj.showX)()(); 		// 1
(x => obj.showX.bind(this))().call(obj); // 1
```

这几种写法虽然不常见, 但是仔细想想弄清楚为什么, 能够帮助我们理解 `this` 的具体指向, 在项目中也能减少使用 let self = this 的次数

## 小结
1. 作为普通函数调用, 分为严格模式和非严格模式
2. 作为构造函数调用, `this` 指向实例
3. 作为箭头函数调用, `this` 指向包裹该方法的作用域中的 `this`, 无视绑定
4. 作为对象的方法调用, 指向调用该方法的对象
5. bind, 区分严格模式和非严格模式, 具体情况见上面






















