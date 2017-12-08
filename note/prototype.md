## 原型及原型链

### 原型基础概念

```
function Person () {
    this.name = 'John';
}
var person = new Person();
Person.prototype.say = function() {
    console.log('Hello,' + this.name);
};
person.say();//Hello,John

```
上述代码非常简单，Person原型对象定义了公共的say方法，虽然此举在构造实例之后出现，但因为原型方法在调用之前已经声明，当此实例本身没有此say方法时候，会在自身原型上查找到此方法。

### 原型链

```
function Foo() {
    this.value = 42;
}
Foo.prototype = {
    method: function() {}
};

function Bar() {}

// 设置Bar的prototype属性为Foo的实例对象
Bar.prototype = new Foo();
Bar.prototype.foo = 'Hello World';

// 修正Bar.prototype.constructor为Bar本身
Bar.prototype.constructor = Bar;

var test = new Bar() // 创建Bar的一个新实例

// 原型链
test [Bar的实例]
    Bar.prototype [Foo的实例] 
        { foo: 'Hello World' }
        Foo.prototype
            {method: ...};
            Object.prototype
                {toString: ... /* etc. */};
```
上面的例子中，test 对象从 Bar.prototype 继承下来；因此，它能访问 Bar的原型方法,同时Bar.prototypeFoo为Foo的实例对象，能够访问Foo的原型方法 method。它也能够访问Foo 实例属性 value。需要注意的是 new Bar() 不会创造出一个新的 Foo 实例，而是重复使用它原型上的那个实例；因此，所有的 Bar 实例都会共享相同的 value 属性。


### 属性查找 

当查找一个对象的属性时，JavaScript 会向上遍历原型链，直到找到给定名称的属性为止，到查找到达原型链的顶部 - 也就是 Object.prototype - 但是仍然没有找到指定的属性，就会返回 undefined，我们来看一个例子：

```

 function foo() {
     this.add = function (x, y) {
         return x + y;
     }
 }

 foo.prototype.add = function (x, y) {
     return x + y + 10;
 }

 Object.prototype.subtract = function (x, y) {
     return x - y;
 }

 var f = new foo();
 alert(f.add(1, 2)); //结果是3，而不是13
 alert(f.subtract(1, 2)); //结果是-1

```
通过代码运行，我们发现subtract是安装我们所说的向上查找来得到结果的，但是add方式有点小不同，这也是我想强调的，就是属性在查找的时候是先查找自身的属性，如果没有再查找原型，再没有，再往上走，一直插到Object的原型上，所以在某种层面上说，用 for in语句遍历属性的时候，效率也是个问题。

还有一点我们需要注意的是，js中基础构造器的prototype是不可改写的， 不可删除， 不可见的；

```
Object.getOwnPropertyDescriptor(Number, 'prototype')；
// Object {value: Number, writable: false, enumerable: false, configurable: false};
```
### hasOwnProperty函数：

hasOwnProperty是Object.prototype的一个方法，它可是个好东西，他能判断一个对象是否包含自定义属性而不是原型链上的属性，
```
// 修改Object.prototype
Object.prototype.bar = 1; 
var foo = {goo: undefined};

foo.bar; // 1
'bar' in foo; // true

foo.hasOwnProperty('bar'); // false
foo.hasOwnProperty('goo'); // true
```
使用 `hasOwnProperty` 可以给出正确和期望的结果，这在遍历对象的属性时会很有用。

对象在查找属性时， 首先从自身查找， 查不到在原型链上查找， 层层向上一旦查到就返回， 直到查到 `Object.protype` 还查不到就返回undefined。
大家可以体会一下下面的结果， 建议动手画一下js中几种构造器和函数类型的原型链， 彻底理解他们之间的关系。
```
Function.toString === Object.toString                       // true
Function.prototype.toString === Object.toString             // true
Function.prototype.__proto__ === Object.prototype           // ture
Function.prototype.toString === Object.prototype.toString 	// false
```
当检查对象上某个属性是否存在时，hasOwnProperty 比较推荐的方法。同时在使用 for in loop 遍历对象时，推荐总是使用 hasOwnProperty 方法，这将会避免原型对象扩展带来的干扰，我们来看一下例子：

```
// 修改 Object.prototype
Object.prototype.bar = 1;

var foo = {moo: 2};
for(var i in foo) {
    console.log(i); // 输出两个属性：bar 和 moo
}
```
我们没办法改变 `for in` 语句的行为，所以想过滤结果可以使用 `hasOwnProperty` 方法，代码如下：

```
// foo 变量是上例中的
for(var i in foo) {
    if (foo.hasOwnProperty(i)) {
        console.log(i);
    }
}
```
这个版本的代码是唯一正确的写法。由于我们使用了 hasOwnProperty，所以这次只输出 moo。如果不使用 hasOwnProperty，
也可以使用Object.key()来获取目标的属性和方法列表，得到的将是一个数组， 里面的属性是目标对象上的， 不含其原型上和其自身不可枚举的属性， 若要想得到更细致的结果可以使用 `Object.getOwnPropertyNames()` 配合 `hasOwnProperty()` 使用。

总结：推荐使用 hasOwnProperty，不要对代码运行的环境做任何假设，不要假设原生对象是否已经被扩展了。

### 总结

原型极大地丰富了我们的开发代码，但是在平时使用的过程中请一定要注意上述提到的一些注意事项。
1. 对象属性的查找规则， 原型链上属性之间的屏蔽。
2. 深入理解 `hasOwnProperty()`、`for in` 机制、`Object.keys()`。
3. `in` 操作符具有遍历到原型链顶端的特性，还能够从对象和原型链上不可枚举的属性拿到 `true`， 以至于我们 `for in` 遍历的时候要注意原型链上的方法。
4. `Object.getOwnPropertyDescriptor()` 可以帮助我们更细致的了解对象上的属性。
5. 也涉及到了 `Object.defineProperty()` 方法， 可用来非常细致的定义对象上的某个属性， 接受三个参数， 对象（object）， 属性名（string）， 属性描述器（object）， 另外 `Object.defineProperties()` 也是相似的，只是它接受2个参数， 要被定义属性的对象（object）， 属性描述集合props（object）， 该方法可以一次定义多个属性。