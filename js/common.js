
function randomInt(min, max) {
	return Math.round(Math.random()*(max-min)) + min;
}

//随机颜色
function randomColor(){
	var R = Math.round( Math.random()*255 ).toString(16);
	var G = Math.round( Math.random()*255 ).toString(16);
	var B = Math.round( Math.random()*255 ).toString(16);
	return (R.length<2?"0"+R:R) + (G.length<2?"0"+G:G)+ (B.length<2?"0"+B:B);
}

//获取样式
function getStyle(obj, attr) {
	if(obj.currentStyle) {
		getStyle = function(obj, attr){
			return Number(parseFloat(obj.currentStyle[attr]).toFixed(5));
		}
		return Number(parseFloat(obj.currentStyle[attr]).toFixed(5));
	} else {
		getStyle = function(obj, attr){
			console.log(obj, getComputedStyle(obj,null)["width"]);
			return Number(parseFloat(getComputedStyle(obj,null)[attr]).toFixed(5));
		}
		return Number(parseFloat(getComputedStyle(obj,null)[attr]).toFixed(5));
	}
}

//获取子节点（元素、文本、属性）
//异常处理机制
function getChildren(ele, nodeType){
	if(!ele || !nodeType){
		console.log("%c参数个数不正确，或顺序错误！","color:red");
		return;
	}
	if(!ele.childNodes) console.log("%c传入的参数非DOM元素或无法获取子节点！","color:red");
	var obj = {
		"element" : 1,
		"text" : 3,
		"attribute" : 2
	}
	if(typeof nodeType === "number"){
		//抛出一个消息，告诉我的上级，这里发生了什么错误，请求处理
		throw new Error("参数类型错误，只能传入string类型，不能传入number类型")
	} else {
		if( !(nodeType in obj)) {
			console.log("%c文本参数错误!","color:red");
		}
	}
	var list = ele.childNodes;
	var arr = [];
	for(var i=0; i<list.length; i++) {
		if(list[i].nodeType == obj[nodeType]) arr.push(list[i]);
	}
	return arr;
}

//获取一个元素在页面的绝对位置
function offset(obj) {
	var _left = 0, _top = 0;
	while(obj) {
		_left += obj.offsetLeft;
		_top += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return {left:_left, top: _top};
}

//事件监听
var addEvent = (function(){
	if(window.attachEvent) {
		return function(obj, eventType, func){
			obj.attachEvent("on"+eventType, func);
		}
	} else {
		return function(obj, eventType, func,  isCapture) {
			obj.addEventListener(eventType, func, isCapture||false);
		}
	}
})();

//getElementsByClassName
(function(){
	try{
		if(window.VBArray) {
			document.getElementsByClassName = function(classname){
				  var arr = []; 
				  var all = document.getElementsByTagName("*");
				  for(var i=0; i<all.length; i++){
					   if(all[i].className.indexOf(classname) != -1){
							arr.push(all[i]); 
					   }
				  }
				  return arr;
			} 
		}
	} catch(e) {
		
	}
})();

//伪数组转换数组
function toArray(obj) {
	if(obj && obj.length) {
		var arr = [];
		for(var i=0; i<obj.length; i++){
			arr.push(obj[i]);	
		}
		return arr;
	}
}

function t(){
	t();
}

//定时器封装
function autoTimer(func, interval, target) {
	target.exec = func;
	var flag = true;
	setTimeout(function(){
		target.exec();
		if( flag ) {
			setTimeout(arguments.callee, interval);
		}
	},interval);
	return function() {
		flag = false;
	}
}


