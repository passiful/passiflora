/**
 * passiflora main.js
 */
var fs = require('fs');
var path = require('path');
var conf = require('./confo.js');
console.log(conf);

var sslOption = {
	key: fs.readFileSync(conf.sslOption.key),
	cert: fs.readFileSync(conf.sslOption.cert),
	passphrase: conf.sslOption.passphrase
};

var express = require('express'),
	app = express();
var expressSession = require('express-session') // セッション管理
var Session = expressSession.Session;
var sessionStore = new expressSession.MemoryStore();
var server;
if( conf.originParsed.protocol == 'https' ){
	server = require('https').Server(sslOption, app);
}else{
	server = require('http').Server(app);
}
console.log('port number is '+conf.originParsed.port);


// middleware - session & request
app.use( require('body-parser')() );
app.use( expressSession({
	secret: "passiflora",
    resave: true,
    saveUninitialized: true,
	store: sessionStore,
	cookie: {
		httpOnly: false
	}
}) );

app.use( function(req, res, next){
	req.main = {};
	req.main.board = new (require('./board.js'))(conf, req.main);
	next();
} );

// middleware - biflora resources
var biflora = require('biflora');
app.use( biflora.clientLibs() );
var io = require('socket.io')(server);

// session shareing
io.use( function(socket, next){

	// getting sessionId from cookie
	var sessionId = require('cookie').parse( socket.request.headers.cookie )['connect.sid'];
	sessionId = sessionId.replace(/^s\:([\s\S]+?)\.[\s\S]*$/, '$1');

	// getting session contents
	sessionStore.get( sessionId, function(err, sessionData){
		if( !err ){
			if( !socket.session ){
				// initialize session
				socket.session = new Session({sessionID: sessionId, sessionStore: sessionStore}, sessionData);
			}
		}else{
			console.error('************ FAILED to session handshake.');
		}
		next();
	});
});

biflora.setupWebSocket(
	server,
	require('incense').getBifloraApi() ,
	require('incense').getBifloraMain({
		'dataDir': conf.dataDir ,
		'getUserInfo': function( socket, clientDefaultUserInfo, callback ){
			// provide user info.
			// eg: {'id': 'user_id', 'name': 'User Name'}
			try {
				if( socket.session.userInfo.userId ){
					clientDefaultUserInfo.id = socket.session.userInfo.userId;
				}
				if( socket.session.userInfo.userName ){
					clientDefaultUserInfo.name = socket.session.userInfo.userName;
				}
			} catch (e) {
			}

			callback(clientDefaultUserInfo);
			return;
		}
	}),
	{
		'namespace': '/',
		'socketIo': io
	}
);

// ログイン処理系
app.use( require('./preprocess/userInfo.js')() );

app.use( '/apis/login', require('./apis/login.js')() );
app.use( '/apis/logout', require('./apis/logout.js')() );
app.use( '/logout.html', require('./../src/logout.html.js')() );
app.use( '/apis/getLoginUserInfo', require('./apis/getLoginUserInfo.js')() );

app.use( '/board/*', require('./preprocess/loginCheck.js')() );
app.use( '/apis/*', require('./preprocess/loginCheck.js')() );
app.use( '/create/*', require('./preprocess/loginCheck.js')() );

// middleware
app.use( '/apis/create', require( __dirname+'/apis/create.js' )(conf) );
app.get( '/board/:boardId/', require( __dirname+'/pages/board.js' )(conf) );
app.use( express.static( __dirname+'/../dist/' ) );

// {conf.originParsed.port}番ポートでLISTEN状態にする
server.listen( conf.originParsed.port, function(){
	console.log('message: server-standby');
} );
