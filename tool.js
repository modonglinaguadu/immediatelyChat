var tool = (function(){
	//js获取行内样式  obj是对象  attr是属性
	/*
		因为两个参数都要传值，所以参数不用处理，也可以做个判断，如果两个参数没有全部传入的话，直接return。
		这里和其他兼容问题一样，看浏览器是否支持这个方法。
	*/
		function getStyle(obj,attr){
			if(obj.currentStyle) {
				getStyle = function(obj, attr){
					return Number(parseFloat(obj.currentStyle[attr]).toFixed(5));
				}
				return Number(parseFloat(obj.currentStyle[attr]).toFixed(5));
			} else {
				getStyle = function(obj, attr){
					return Number(parseFloat(getComputedStyle(obj,null)[attr]).toFixed(5));
				}
				return Number(parseFloat(getComputedStyle(obj,null)[attr]).toFixed(5));
			}
		}
	
	
	
	
	//获取cookie
	//使用例子 getCookie("user");
	/*
		思路：先把cookie中的值全部取出来，赋值给一个变量，因为取出来的值是json类型，所以得处理
	*/
	function getCookie(key){
		var str = document.cookie;
		var list = str.split("; ");
		for(var i = 0;i<list.length;i++){
			var subList = list[i].split("=");
			if(subList[0]==key){
				return subList[1];
			}
		}
		return null;
	}
	
	
	
	
	
	//设置cookie
	//使用例子setCookie("user",username.value,10，路径)
	/*
		思路：设置cookie的参数有索引(key)，有索引值(value)，还有cookie保存时间和路径
		首先我们还是先处理一下参数，cookie保存时间和路径是可以不填的，所以我们得默认一下。
		如果参数有时间，那我们还有把时间做一下处理，因为参数输入的是天数，所以我们得把它
		处理成具体的时间，然后输入cookie里面
	*/
	function setCookie(key,value,expires,path){
		expires = expires || -1;	//判断如果没有输入保存天数，那就默认为-1
		var d = null;	//假设默认日期为空
		if(expires!=-1){	//如果保存天数不是为-1
			d = new Date();		//获取现在时间
			d.setDate(d.getDate()+expires);		//把现在时间加上要保存的天数
		}
		document.cookie = key+"="+value+"; "+(d?"expires="+d:"") +"; "+(path?"path="+path:"");//把数据保存入cookie中
	}
	
	
	
	
	
	
	//可拉动窗口
	//使用例子：windowMove(移动对象，鼠标点击对象) 记得，HTML和body要把宽高设置100%
	/*
		思路：第一步还是看一下参数需不需要处理，obj2可以处理，因为如果点击整个页面拉动的话，那就不需要传obj2，所以
		如果没有传obj2，我们需要把它默认成obj。因为是拉动窗口，所以肯定有鼠标点击和松开，还有鼠标移动事件。这里考
		虑到两个窗口，所以得注意下谁的事件，还有获取值时在哪获取。在拉动时，还得注意四个窗口的范围，不能超出
	*/
	
	function windowMove(obj,obj2){
		obj2 = obj2 || obj;	//如果没有传入obj2，那就把它默认成obj
		obj2.onmousedown = function(e){	//给obj创建点击事件，也就是能点击的元素
			e = e||event;
			var disx = e.offsetX;
			var disy = e.offsetY;
			document.onmousemove = function(e){	//给document创建鼠标移动事件
				e = e || event;
				var _left = e.clientX - disx;	//移动元素到可视窗口的距离
				var _top = e.clientY - disy;
				if(_left <= 0){		//处理移动元素不能出可视窗口左边
					obj.style.left = 0;
				}else if(_top <= 0){//处理移动元素不能出可视窗口上边
					obj.style.top = 0;
	
					//处理右边，窗口宽度减去移动元素到左窗口的距离，如果大于移动元素自身宽度，那说明移动元素出去了
				}else if(document.body.offsetWidth - _left <obj.offsetWidth){
					obj.style.left = document.body.offsetWidth - obj.offsetWidth + "px";
					//和右边一个原理
				}else if(document.body.offsetHeight - _top <obj.offsetHeight){
					obj.style.top = document.body.offsetHeight - obj.offsetHeight + "px";
				}else{
					obj.style.left = _left + "px";
					obj.style.top = _top + "px";
				}
			}
		}
		document.onmouseup = function(){
			document.onmousemove = null;
		}
	}
	
	
	
	
	//获得元素绝对位置
	/*思路：当对象存在时，不断的执行循环语句。先把子元素到父元素之间的距离加到_left和_top里，然后obj变成父元素
		    然后求父元素到具有定位属性的父元素的距离，不断执行，直到obj没有父元素，然后输出。
	*/
	function offset(obj){
			var _left = 0;
			var _top = 0;
			while(obj){
				_left += obj.offsetLeft;
				_top += obj.offsetTop;
				obj = obj.offsetParent;
			}
			return {left : _left, top : _top};
		}
	
	
	
	
	//div拉动
	//使用例子：divMove(父对象，移动对象,{x:true,y:true},callback)
	/*
		思路：先对参数进行处理，parentObj和obj不需要处理，但param和callback需要处理，所以我们得先设置他们两个的默认
		值。拉动问题，所以肯定得绑定鼠标点击和松开，鼠标移动等时间。还要考虑到移动对象在父对象中的移动范围，所以得
		用if判断出了范围会怎么样，还有因为这里的方向需要传参，所以我们得判断一些param中的值哪个是true，在做具体运动
		分析。
	*/
	function divMove(parentObj,obj,param,callback){
		param = param||{x:true,y:true};//给xy做默认设定
		param.x = param.x || {x:true};
		param.y = param.y || {y:true};
		obj.callback = callback||function(){};//把func回调函数赋给obj
		
		var mnum = {//移动元素到其父元素的距离的最大值
			maxX:parentObj.offsetWidth - obj.offsetWidth,
			maxY:parentObj.offsetHeight - obj.offsetHeight
		}
		obj.onmousedown = function(e){
			e = e||event;
			var disx = e.offsetX;//要先做处理，因为这里的e是指鼠标点击的位置，所以不能放到移动事件里
			var disy = e.offsetY;
			document.onmousemove = function(e){
				e = e||event;
				if(param.x){//如果x是true，就执行
					var disLeft = e.clientX-offset(parentObj).left-disx;//移动元素到其父元素的距离
					disLeft=(disLeft<0?0:Math.min(disLeft,mnum.maxX));//判断移动元素到其父元素的距离是否超出父元素
					obj.style.left = disLeft+"px";
				}
				if(param.y){//如果y是true，就执行
					var disTop = e.clientY-offset(parentObj).top-disy;//移动元素到其父元素的距离
					disTop=(disTop<0?0:Math.min(disTop,mnum.maxY));
					obj.style.top = disTop+"px";
				}	
				obj.callback();//调用obj的函数
			}
		}
		document.onmouseup = function(){
			document.onmousemove = null;
		}
	}
	
	
	
	
	//缓冲运动的例子
	//使用move(obj,{attr:targetValue},callback)例如：move(box,{width:300,left:200},callback)
	/*
		思路：先判断参数哪些是否存在，是否设默认值。因为是缓冲运动，所以速度肯定是在变小的，这里我们用把剩余路
		径的八分之一作为速度，随着剩余路径的减少，速度也随之减小。因为是运动，肯定有定时器，所以我们先建立一个
		定时器，因为参数json是个对象，所以我们得遍历一遍，每个参数的运动都是同时运行的，因为是同时运行的，所以
		得等最后一个参数运行完后才能关闭计时器。
	*/
	function move(obj,json,callback){
		clearInterval(obj.timer);	//清除定时器，而且是obj的定时器，因为要防止多次触发函数，产生多个定时器。
		obj.timer = setInterval(function(){
			for(var attr in json){	//遍历json中的数据
				var speed = (json[attr] - parseInt(getStyle(obj,attr)))/8;	//把剩余路程的八分之一作为这一刻的速度，剩余路程在减少，速度也就变慢
				//得判断速度的正负，因为可能向上或左运动，速度则为负的。
				if( speed> 0){
					speed=(speed < 1 ? 1 : speed);//当速度为正时，如果速度小于1时，速度就等于1，并运行到终点
				}else{
					speed=(speed > -1 ? -1 : speed);//当速度为负时，如果速度大于于-1时，速度就等于-1，并运行到终点
				}
				//obj的attr值得变化
				obj.style[attr] = parseInt(getStyle(obj,attr)) + speed +"px";//obj.style[attr] 因为attr是参数，只能这样传参。
				//如果attr="width"，那style.[attr]等价于style["width"]或style.width  而style.attr等价于style["attr"]或者(style."attr")这个写法是不正确的，因为attr是个参数，也是个字符串
				
				if(json[attr] == parseInt(getStyle(obj,attr)) ) {//判断obj的attr是否到达targetValue（目的地）。
					delete json[attr];//如果到达，就删除json中当前完成的属性
					if(coun()==0){//如果属性值被清空了，那也就是不需要定时器了，就可以把定时器关了
						clearInterval(obj.timer);
						callback?callback():"";
					}
				}
			}
		},30);
		
		function coun(){
			var count = 0;
			for(var i in json){//遍历json，看里面是否还有元素，如果有，加一
				count++;
			}
			return count;
		}
		
	}
	
	
	//用正弦函数做的
	function move2(obj,json,callback){
		clearInterval(obj.timer);	//清除定时器，而且是obj的定时器，因为要防止多次触发函数，产生多个定时器。
		var deg = 0;
		obj.timer = setInterval(function(){
			if(deg==90){//角度为90时，停止计时器
				clearInterval(obj.timer);
				callback?callback():"";
			}
			for(var attr in json){	//遍历json中的数据
				//Math.sin(deg*Math.PI/180)是等于y，y一直变大，但都小于1，所以用*，单y等于1时，最后的距离一步走完，然后速度就为0，停止运动
				var speed = (json[attr] - parseInt(getStyle(obj,attr)))*Math.sin(deg*Math.PI/180);
				//现在的距离加上速度
				obj.style[attr] = parseInt(getStyle(obj,attr)) + speed+"px";
			}
			deg++;
		},30);
	
	}
	//新增透明度功能
	function move3(obj,json,callback){
		clearInterval(obj.timer);
		obj.callback = callback;
		var deg = 0;
		obj.timer = setInterval(function(){
			deg+=2;
			if(deg>=90){
				callback?obj.callback():"";
				clearInterval(obj.timer);
			}
			for(var attr in json){
				var now = getStyle(obj,attr);
				var end = json[attr];
				var speed = Math.sin(Math.PI/180*deg)*(end - now);
				if(attr = "opacity"){
					obj.style[attr] = (now+speed)/100;
					obj.style[attr] = "filter:alpha(opacity = "+ (now+speed) + ")";
				}else{
					obj.style[attr] = (now+speed) +"px";
				}
			}
			
		},30)
	}
	
	
	
	
	
	
	//定时器的封装
	/*使用 var stop = setTime(function(){
			if(xxx){
				stop()  你想什么时候停止计时器就调用stop()
			}
		},1000,document.getElementById("box"));
	*/
	function setTime(func,interval,target){
		target.fun = func;
		var flag = true;
		setTimeout(function(){
			target.fun();
			if(flag){
				setTimeout(arguments.callee,interval);
			}
		},interval);
		return function(){
			flag = false;
		}
	}
	
	//随机获取一个颜色
	//使用：setcolor()
	function setColor(){
	    var R = Math.round(Math.random()*255).toString(16);
	    var B = Math.round(Math.random()*255).toString(16);
	    var G = Math.round(Math.random()*255).toString(16);
	    return (R.length<2?"0"+R:R)+(G.length<2?"0"+G:G)+(B.length<2?"0"+B:B)
	}
	
	
	
	//获取一个随机数
	//使用：setRandom(min,max)
	function setRandom(min,max){
		return Math.round(Math.random()*(max-min))+min;
	}
	
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
	
	
	//toast
	//使用  var toast = new Toast();     toast.show("谢谢",ckb)
	//第一个参数：toast显示的字符   可传
	//第三个参数: 回调函数	可传
	/*
	function Toast(){
		this.init = function(){
			this.div = document.createElement("div");
		}
		this.style = function(){
			with(this.div.style){
				width = "60px";
				height = "30px";
				backgroundColor = "#333";
				opacity = "1";
				borderRadius = "3px";
				position = "absolute";
				left = "50%";
				top = "50%";
				textAlign = "center";
				lineHeight = "30px";
				color="white";
				fontSize = "15px";
				marginLeft = -30+"px";
				marginTop = -15+"px";
	
			}
		}
		this.dim = function(cbk){
			var self = this;
			this.callback = cbk;
			this.deg = 0;
			this.timer = setInterval(function(){
				self.deg+=5;
				if(self.deg>=90){
					self.callback?self.obj.callback():"";
					clearInterval(self.timer);
				}
				var now = getStyle(self.div,"opacity");
				var speed = Math.sin(Math.PI/180*self.deg)*(-now);
				self.div.style.opacity = now+speed;
				self.div.style.opacity = "filter:alpha(opacity = "+ (now+speed)*100 + ")";
				
			},300)
		}
		this.show = function(str,cbk){
			this.init();
			this.str = str||"未命名";
			document.body.appendChild(this.div);
			this.style();
			this.div.innerHTML = this.str;
			this.dim(cbk);
			return this;	
		}
	
	}
	*/
	
	
	//toast号  单例 
	//使用方法：toast("gogo")
	var toast = (function(){
		var t;
		return function(str){
			if(!t){
				t = document.createElement("div");
				document.body.appendChild(t);
				t.innerHTML = str;
				with(t.style){
					width = "60px";
					height = "30px";
					backgroundColor = "#333";
					opacity = "1";
					borderRadius = "3px";
					position = "absolute";
					left = "50%";
					top = "50%";
					textAlign = "center";
					lineHeight = "30px";
					color="white";
					fontSize = "15px";
					marginLeft = -30+"px";
					marginTop = -15+"px";
				}
				t.show = function(callback){
					clearInterval(t.timer)
					var num = 0;
					t.timer = setInterval(function(){
						t.style.opacity = (num+=0.02);
						if(num>=1){
							clearInterval(t.timer);
							setTimeout(function(){
								callback();
							},1000)
						}
					},30);
					
				}
				t.dim = function(){
					clearInterval(t.timer)
					var num = 1;
					t.timer = setInterval(function(){
						t.style.opacity = (num-=0.02);
						if(num<=0){
							clearInterval(t.timer);
						}
					},30);
				}
			}
			new Promise(t.show).then(t.dim);
		}
	})();
	
	
	
	
	
	//也是单例函数
	/*
	function Toast2(str){
	
		//加这句 判断是否存在这个函数对象------
		if(Toast2.instance){
			return Toast2.instance;
		}
		//-------------------------------------
		this.init = function(){
			this.div = document.createElement("div");
		}
		this.style = function(){
			with(this.div.style){
				width = "60px";
				height = "30px";
				backgroundColor = "#333";
				opacity = "1";
				borderRadius = "3px";
				position = "absolute";
				left = "50%";
				top = "50%";
				textAlign = "center";
				lineHeight = "30px";
				color="white";
				fontSize = "15px";
				marginLeft = -30+"px";
				marginTop = -15+"px";
	
			}
		}
		this.dim = function(cbk){
			var self = this;
			this.callback = cbk;
			this.deg = 0;
			this.timer = setInterval(function(){
				self.deg+=5;
				if(self.deg>=90){
					self.callback?self.obj.callback():"";
					clearInterval(self.timer);
				}
				var now = getStyle(self.div,"opacity");
				var speed = Math.sin(Math.PI/180*self.deg)*(-now);
				self.div.style.opacity = now+speed;
				self.div.style.opacity = "filter:alpha(opacity = "+ (now+speed)*100 + ")";
				
			},300)
		}
		this.show = function(str,cbk){
			this.init();
			this.str = str||"未命名";
			document.body.appendChild(this.div);
			this.style();
			this.div.innerHTML = this.str;
			this.dim(cbk);
			return this;	
		}
	
		//把函数本身存取这个对象中--------
		Toast2.instance = this;
		//------------------------------
	}
	*/
	
	//事件监听 兼容版
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
	
	return{
		getStyle:getStyle,
		getCookie:getCookie,
		setCookie:setCookie,
		windowMove:windowMove,
		offset:offset,
		divMove:divMove,
		move:move,
		move2:move2,
		move3:move3,
		setTime:setTime,
		setColor:setColor,
		setRandom:setRandom,
		toast:toast,
		toArray:toArray,
		addEvent:addEvent,
	}

})();

if(typeof module === "object"&&module&&typeof module.exports ==="object"){
	module.exports = tool;
}else if(typeof define === "function" &&define.amd){
	define([],function(){return tool});
}
