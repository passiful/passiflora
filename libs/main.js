/**
 * passiflora main.js
 */
var fs = require('fs');
var path = require('path');
var conf = require('config');
var urlParse = require('url-parse');
conf.originParsed = new urlParse(conf.origin);
conf.originParsed.protocol = conf.originParsed.protocol.replace(':','');
if(!conf.originParsed.port){
	conf.originParsed.port = (conf.originParsed.protocol=='https' ? 443 : 80);
}
console.log(conf);

var sslOption = {
	key: fs.readFileSync(conf.sslOption.key),
	cert: fs.readFileSync(conf.sslOption.cert)
};

var express = require('express'),
	app = express();
var session = require('express-session');
var server;
if( conf.originParsed.protocol == 'https' ){
	server = require('https').Server(sslOption, app);
}else{
	server = require('http').Server(app);
}
console.log('port number is '+conf.originParsed.port);


// middleware - session & request
app.use( require('body-parser')() );
var mdlWareSession = session({
	secret: "pickles2webtool",
	cookie: {
		httpOnly: false
	}
});
app.use( mdlWareSession );

// middleware - frontend documents
app.use( express.static( __dirname+'/../dist/' ) );

// {$_port}番ポートでLISTEN状態にする
server.listen( conf.originParsed.port, function(){
	console.log('message: server-standby');
} );
