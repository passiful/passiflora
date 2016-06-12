/**
 * bifloraApi.js
 */
module.exports = (function(){
	delete(require.cache[require('path').resolve(__filename)]);
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

			console.log(data);
			biflora.send('receiveBroadcast', data, function(){
				console.log('send message');
			});
			biflora.sendToRoom('receiveBroadcast', data, data.boardId, function(){
				console.log('send message to room');
			});

			main.dbh.insertMessage(data.boardId, data, function(result){
				callback(data);
			});
			return;
		}
	};
})();
