## 创建对象

### ECMAScript 定义类或对象
使用预定义对象只是面向对象语言的能力的一部分，它真正强大之处在于能够创建自己专用的类和对象。使用 `Object` 构造函数或者字面量可以用来创建单个对象,但是这种行为有个明显的缺点, 创建多个对象会导致重复代码

### 原始的创建对象方式

```js
let ferrari = new Object();

ferrari.color = 'red';
ferrari.showColor = function() {
    console.log(this.color);
}
```
上面的方法可以创建一个 `ferrali` 对象, 但是如果有多个对象将会有大量的重复代码, 比如 `showColor` 方法, 为了解决这个问题我们使用一种变体: `工厂模式`

### 工厂模式
封装上例的方法:

```js
let createFerrari = function() {
    let ferrari = new Object();

    ferrari.color = 'red';
    ferrari.showColor = function() {
        console.log(this.color);
    }
    return ferrari;
}

let ferrari1 = createFerrari(),
    ferrari2 = createFerrari();
```

我们使用 `createFerrari()` 封装上面的方法从某种程度上减少了代码量, 但创建出的对象属性值完全一样, 可以为函数传参数将其变的灵活一些

```js
let createFerrari = function(color) {
    let ferrari = new Object();

    ferrari.color = color;
    ferrari.showColor = function() {
        console.log(this.color);
    }
    return ferrari;
}

let ferrari1 = createFerrari('red'),
    ferrari2 = createFerrari('blue');
```

上述代码每次创建对象的时候都要重新创建一个 `showColor` 方法, 其实我们希望这些实例能够共享一个方法

```js
ferrari1.showColor === ferrari2.showColor;  // false
```

为此我们可以在工厂函数外面定义方法, 然后引入到工厂函数内部

```js
let showColor = function() {
    console.log(this.color);
};

let createFerrari = function(color) {
    let ferrari = new Object();

    ferrari.color = color;
    ferrari.showColor = showColor;
    return ferrari;
}

let ferrari1 = createFerrari('red'),
    ferrari2 = createFerrari('blue');

ferrari1.showColor === ferrari2.showColor;  // true
```

这段代码解决了创建对象时重复创建方法的问题, 但是创建实例的时候没有 `new`, 而且这个 `showColor()` 不太像是对象的方法, 它被定义到外面去了, `instanceof` 无法检测对象实例, 这些问题导致了 `构造函数` 的出现

### 构造函数

创建构造函数首先要有个名字, 大写字母开头, 并不强制, 这只是一个习惯, 用于区分其他的函数, 某种程度上 `构造函数` 与 `工厂函数` 很类似

```js
let CreateFerrari = function(color) {
    this.color = color;
    this.showColor = function() {
        console.log(this.color);
    }
}
```
在构造函数中并没有显示创建对象, 使用 `this` 关键字, 创建实例的时候使用了 `new` 运算符, 其实在函数调用的时候其内部会创建两个特殊的对象 `this` 和 `arguments`, 在使用 `new` 运算符的时候会创建一个对象, 由 `this` 指向它, 默认情况构造函数会把 `this` return 出来, 如果指出了 return 的值情况将会有所不一样, 若 return 的是基本类型的值将无视这个 return , 还是继续将 `this` return, 如过 return 的是 引用类型的值将把该值返回出来, 另外 `构造函数` 也能在没有 `new` 的情况下调用, 返回值和使用 `new` 的时候不一样, 同样 `构造函数` 也是在内部定义的方法, 那么实例并没有共享该方法

### 原型方式
`javascript` 中的函数都有一个默认的属性 `prototyoe`(Function.prototype出来), `prototype` 可以看作创建对象索依赖的原型

```js
let CreateFerrari = function() {};

CreateFerrari.prototype.color = 'red';
CreateFerrari.prototype.showColor = function() {
    console.log(this.color);
}

let ferrari1 = new CreateFerrari(),
    ferrari2 = new CreateFerrari();
```

这段代码把方法和属性定义在构造器的 `prototype` 上, 被 `new` 出来的实例都有一个指针 `__proto__` 指向构造器的 `prototype`, 前面的问题到这里得到了一定程度的解决, 但是原型模式又暴露了新的问题, 比如构造器没有参数, 必须在对象创建后才能改变属性的默认值, 属性指向引用类型的值时将会造成问题

```js
let CreateFerrari = function() {};

CreateFerrari.prototype.options = {
    speed: '330km/h',
    color: 'red'
};
CreateFerrari.prototype.showColor = function() {
    console.log(this.color);
}

let ferrari1 = new CreateFerrari(),
    ferrari2 = new CreateFerrari();

ferrari1.options.price = '$3000';
console.log(ferrari2.options.price);    // $3000
```

### 混合构造函数和原型

这种方式可像用其他程序设计语言一样创建对象。这种概念非常简单，即用构造函数定义对象的所有非共享属性，用原型方式定义对象的共享属性, 这有可保证共享属性只被创建一次, 实例可以拥有自己的属性

```js
let CreateFerrari = function(options) {
    this.options = options;
};

CreateFerrari.prototype.showColor = function() {
    console.log(this.color);
};
```

这种方式是比较完美的创建对象的方式, 是目前 `ECMAScript` 中使用非常广泛的一种方式, 仍有更好些的解决方案

### 动态原型方式
动态原型方法的基本想法与混合的构造函数和原型的方式相同，即在构造函数内定义非函数属性，而函数属性则利用原型属性定义, 区别是在给对象赋方法的位置

```js
let CreateFerrari = function(options) {
    this.options = options;
    if(typeof this.showColor !== 'function') {
        CreateFerrari.prototype.showColor = function() {
            console.log(this.color);
        }
    }
};
```

保证了 `showColor()` 只被添加一次

## 其他一些另类的方式
当上述方式无法满足需求的时候可以考虑如下方案

### 寄生构造函数方式
这种方式通常是在不能应用前一种方式时的变通方法。它的目的是创建假构造函数，只返回另一种对象的新实例。
```js
let CreateFerrari = function() {
    let tmp = new Object();
        tmp.color = 'red';
        tmp.showColor = function() {
            console.log(this.color);
        }
    return tmp;
};

let ferrari = new CreateFerrari();
```
与经典构造函数不同，这种方式使用 `new` 运算符，使它看起来像真正的构造函数, 其实是使用了 `new` 运算符来调用了工厂模式, 这种模式可以在特殊的情况下用来为对象创建构造函数, 考虑如下demo

```js
let OtherArray = function() {
    let arr = new Array();
    arr.push(...arguments);
    arr.toMinusString = function() {
        return this.join('-');
    }
    return arr;
};

let arr = new OtherArray(1, 2, 3);
arr.toMinusString();    //1-2-3;
```

该方式返回的对象和构造器的原型之间没有任何联系, 也不能使用 `instanceof` 来检测类型, 也可以通过 es6 的 `class` 和 `extends` 实现, 详情请见 [更多信息](#/class)


### 稳妥构造函数
稳妥对象是指没有公共属性, 而且其方法也不引用 `this` 的对象, 可以在不能使用 `this` 和 `new` 的环境下使用, demo 如下:

```js
let Ferrari = function(color) {
    let obj = new Object();
    // 这里还能设置一些私有属性和私有方法
    obj.showColor = function() {
        console.log(color);
    }
    return obj;
}
let ferrari = new Ferrari('red');
    ferrari.showColor();    // red
```
在这段代码中 ferrari 变量中保存了一个稳妥对象, 除了调用 showColor 之外再也没有办法访问到 color 变量;

## 小结
- `混合构造函数和原型` 方法适合大多数创建对象的情况, 比较推荐使用
- `动态原型方式` 把所有信息封装在构造函数, 仅在必要的情况下初始化原型, 保持了同时使用构造函数和原型的优点
