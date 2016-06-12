/**
 * passiflora main.js
 */
var fs = require('fs');
var path = require('path');
var conf = require('./confo.js');
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

app.use( function(req, res, next){
	req.app = new (function(){
		this.dbh = new (require('./dbh.js'))(conf, this);
		this.board = new (require('./board.js'))(conf, this);
	})();
	next();
} );

// middleware - biflora resources
var biflora = require('biflora');
app.use( biflora.clientLibs() );
biflora.setupWebSocket(server, require('./apis/bifloraApi.js'), new (require('./bifloraMain.js'))(conf));

// middleware
app.use( '/apis/create', require( __dirname+'/apis/create.js' )(conf) );
app.get( '/board/:boardId/', require( __dirname+'/pages/board.js' )(conf) );
app.use( express.static( __dirname+'/../dist/' ) );

// {conf.originParsed.port}番ポートでLISTEN状態にする
server.listen( conf.originParsed.port, function(){
	console.log('message: server-standby');
} );
