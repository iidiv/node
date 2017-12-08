## Class

### prototype
`prototype` 依然存在, 类的所有方法都定义在了类的 `prototype` 属性上。

```js
class Demo {
	constructor() {
		//
	}

	toString() {}

	toValue() {}
}
// 等同于

Demo.prototype = {
	constructor: Demo,
	toString() {},
	toValue() {}
}

```

注意在类的方法之间不要加 `,` 号， 否则报语法错误，在类的实例上调用方法还是调用原型上的方法。

在类内部定义的方法都是不可枚举的， 这点应该引起注意；

```js
class Demo {
	constructor() {
		//
	}

	toString() {}

	toValue() {}
}
Object.keys(Demo.prototype) 	// []
Object.getOwnPropertyNames(Demo.prototype) 	// ['constructor', 'toString', 'toValue']
```
类名的属性可以采用动态属性：
```js
class Demo {
	constructor() {}
	[someProp]() {}
}
```
注意上面的例子中的 `[]` 不可替换成 `()`， 否则报语法错误；

### constructor方法
`constructor` 方法是类的默认方法，通过 `new` 命令生成对象实例时自动调用该方法。一个类必须要有 `constructor` 方法， 未显示定义， js会默认添加一个 `constructor`
, 该方法默认返回实例对象（`this`），这点与 `es5` 的构造器表现一样， 也可以指定返回别的对象， 但是指定返回 基本类型 的值会阻止不了返回 `this`;


### 实例对象
生成实例的方法与 `es5` 的写法一致， 要使用 `new`, 如果没有 `new` 调用 `class` 会报错
类的所有实例共享一个原型对象
```js
let demo1 = new Demo();
let demo2 = new Demo();

demo1.__proto__ === demo2.__proto__ 	// true
```

### name属性

本质上 `class` 只是 `es5` 的构造函数的一层包装， 很多函数具备的特性它也有， `name` 属性也不例外；

### class表达式

```js
const Demo = class some {
	getClassName() {
		return some.name;
	}
}

let demo = new Demo();
demo.getClassName() 	// some
some.name 				// 报错
```
跟在表达式后面的名字(如some)，只能在类的作用域能引用， 其他位置引用不到， 尽管在全局环境下定义也拿不到， 这样做的一个应用场景是替代 `arguments.callee`, 因为在严格模式下
`arguments.callee` 是不能被使用的， `es6` 已经把整个语言升级到了严格模式，我们可以用表达式右边的 `name` 来取代 `arguments.callee`； 这个地方和 `es5` 完全一致;

### 不存在变量提升

```js
new Demo(); 	// 报引用错误；
class Demo() {};
```

### 严格模式

类和模块内部默认已经是严格模式；

### class继承

** 基本用法 **
通过 `extends` 实现继承, 这点比 `es5` 实现继承要清晰和方便;
```js
class Demo extends Array {}
```
类的内部用 `super` 代指父类, 子类没有自己的 `this` 对象, 而是继承了父类的 `this` 对象, 然后对其加工, 如果不调用 `super`, 子类就拿不到 `this` 对象


** 原生构造函数的继承 **

由于 `class` 是先拿到父级的 `this`, 这点和 `es5` 不一样, 子类能拿到原生构造器内部的属性, 所以能够完整继承原生构造器

```js
class Demo extends Array {
	constructor(...args) {
		super(...args);
	}
	push(num) {
		super.push(num);
		return this;
	}
}
let arr = new Demo(1, 2);
arr.push(3); 	// [1, 2, 3]
```


## 小结

- `class` 继承机制和 `es5` 不同, 在子类的 `constructor` 中要首先拿到父类 `super` 的 `this`, 而 `es5` 的是先创建 `this`;
- `class` 的继承相对于 `es5` 的继承实现起来比较简单清晰, 能够继承 `js` 原生构造器;
- `class` 内部定义的的方法均是不可见的;