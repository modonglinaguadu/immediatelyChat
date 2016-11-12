

//1、加载websocket模块
const ws = require('nodejs-websocket')
console.log('开始建立连接');
//2、创建服务器

var i = 0;
const server = ws.createServer((conn)=>{
	console.log('new connection');
	conn.on('text',(str)=>{
		console.log('----- '+str);
		sendAll(server,str,conn);
	})
	conn.on('close',(code,reason)=>{
		console.log("Connection closed");
	})
	conn.on('error',(code,reason)=>{
		console.log('Connection error')
	})
}).listen(3000);
console.log('建立连接完毕');


function sendAll(server,msg,myself){
	server.connections.forEach((conn)=>{
		if(myself!==conn){
			conn.sendText(msg);
		}
	})
}