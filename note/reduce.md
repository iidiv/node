## Array.prototype.reduce

```js
let arr = [1, 2, 3, 4],
	sum = arr.reduce((prev, curr, index, arr) => {
		return prev + curr;
	});
;
console.log(sum);	// 10
```

### `[].reduce` 回调入参: 
1- prev 第一项的值或者是上一次的叠加的结果值(这个值可以手动设置)
2- curr 当前会参与叠加的项
3- index 当前的索引
4- 数组本身

#### 上面例子的扩展-- 第n项之后的和:

```js
let arr = [1, 2, 3, 4],
	sum = arr.reduce((prev, curr, index, arr) => {
		if(index > 2) {
			return prev + curr;
		} else {
			return prev;
		}
	}, 0);
;
```

#### 求成绩和

```js
var result = [
    {
        subject: 'math',
        score: 88
    },
    {
        subject: 'chinese',
        score: 95
    },
    {
        subject: 'english',
        score: 80
    }
];

var sum = result.reduce((prev, curr) => {
	return prev + curr.score;
}, 0);
```

#### 加权成绩和

```js
var result = [
    {
        subject: 'math',
        score: 88
    },
    {
        subject: 'chinese',
        score: 95
    },
    {
        subject: 'english',
        score: 80
    }
];
var dis = {
    math: 0.5,
    chinese: 0.3,
    english: 0.2
};

var qsum = result.reduce(function(prev, cur) {
    return cur.score * dis[cur.subject] + prev;
}, 0);
```

#### 统计字符个数

```js
var arrString = 'sfaskdflaefaf';
arrString.split('').reduce(function(res, cur) {
    res[cur] ? res[cur]++ : res[cur] = 1
    return res;
}, {});
```

#### 字符去重

```js
var arrString = 'sfaskdflaefaf';
arrString.split('').reduce((x => {
	let res = {};
	return (prev, curr) => {
		if(!res[curr]) {
			res[curr] = true;
			return prev + curr;
		}
		return prev;
	};
})(), '');
```

#### 字符串反转:

```js
var str = 'sfaskdflaefaf';
str.split('').reduce((prev, curr) => {
	return curr + prev;
}, '');
```

#### 按一定规则转换数组:

```js
[1, 2].reduce(function(res, cur) { 
    res.push(cur + 1); 
    return res; 
}, []);
```

小结: 一般我们会提供 `prev` 的默认值来获得期望的返回, 这个方法可以在满足一定规则的逻辑下让代码书写的更为优雅, 与之相似的另外一个方法是 `reduceRight`, 该方法倒序遍历数组.