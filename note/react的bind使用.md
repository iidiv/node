## react中各种bind方式对比


### F1 (使用Function.prototype.bind())

```js
render(){
    return <Button type="primary" onClick={this.onSearch.bind(this)}>搜索</Button>
}
```
### F2 (ES7函数绑定语法)

```js
render(){
    return <Button type="primary" onClick={::this.onSearch}>搜索</Button> 
} 
```
### F3 (在构造函数中bind this)

```js
constructor(props) {
   	this.onSearch = this.onSearch.bind(this)
}   
```
### F4 (使用箭头函数)

```js
render(){
    return <Button type="primary" onClick={(arg)=>{this.onSearch(arg)}>搜索</Button>
}
```

### Q1 (关于bind传参)

```js
render(){
        return <Button type="primary" onClick={this.onSearch.bind(this,1,2)}>搜索</Button>
}
```
```js
onSearch(){
	alert(agruments[0]); //1
	alert(agruments[1]); //2
	alert(agruments[2]); //event
}
```
### 结论
方案1和方案2 破坏了组件的pure render，每次组件render时，子组件Button的onClick值都是重新赋值所得，会导致Button做一次无谓的render。而且函数绑定语法::属于es7草案中的特性，尚未纳入es标准。使用需要谨慎。bind()方法会创建一个新函数，当这个新函数被调用时，它的this值是传递给bind()的第一个参数, 它的参数是第一个为bind()的其他参数和后面的参数其原本的参数


