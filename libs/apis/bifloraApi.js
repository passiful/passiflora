/**
 * bifloraApi.js
 */
module.exports = (function(){
	// delete(require.cache[require('path').resolve(__filename)]);

	var userList = {};

	return {
		'ping': function( data, callback, main, biflora ){
			callback('ping OK.');
			return;
		} ,
		'message': function( data, callback, main, biflora ){
			// クライアントからのメッセージを受け付ける
			data.microtime = Date.now();

			if(typeof(data.content)===typeof('') && data.contentType == 'text/markdown'){
				var marked = require('marked');
				marked.setOptions({
					renderer: new marked.Renderer(),
					gfm: true,
					tables: true,
					breaks: false,
					pedantic: false,
					sanitize: false,
					smartLists: true,
					smartypants: false
				});
				data.content = marked(data.content);
				data.contentType = 'text/html';
			}


			data.connectionId = biflora.socket.bifloraUserInfo.connectionId;
			// console.log(data);
			main.dbh.insertMessage(data.boardId, data, function(result){
				data.id = result.dataValues.id;

				// console.log(data.content);
				if( data.contentType == 'application/x-passiflora-command' ){
					var tmpContent = JSON.parse(data.content);
					if( tmpContent.operation == 'userLogin' ){
						userList[data.connectionId] = {
							'connectionId': data.connectionId,
							'userInfo': tmpContent.userInfo,
							'boardId': data.boardId
						};
					}
				}
				console.log(userList);


				biflora.send('receiveBroadcast', data, function(){
					console.log('send message');
				});
				biflora.sendToRoom('receiveBroadcast', data, data.boardId, function(){
					console.log('send message to room');
				});
				callback(true);
			});
			return;
		},
		'getMessageList': function( data, callback, main, biflora ){
			main.dbh.getMessageList(data.boardId, {}, function(result){
				callback(result);
			});
			return;
		},
		'disconnect': function( data, callback, main, biflora ){
			console.log( 'User Disconnect.' );

			data.content = JSON.stringify({
				'operation': 'userLogout',
				'userInfo': userList[data.connectionId].userInfo
			});
			data.connectionId = biflora.socket.bifloraUserInfo.connectionId;
			data.contentType = 'application/x-passiflora-command';
			data.targetWidget = null;
			data.owner = null;
			data.microtime = Date.now();
			data.boardId = userList[data.connectionId].boardId;

			console.log(data);

			main.dbh.insertMessage(data.boardId, data, function(result){
				console.log(result);
				biflora.send('receiveBroadcast', data, function(){
					console.log('send LOGOUT message');
				});
				biflora.sendToRoom('receiveBroadcast', data, data.boardId, function(){
					console.log('send LOGOUT message to room');
				});
			});
			return;
		}
	};
})();
