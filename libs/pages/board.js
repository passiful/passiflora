/**
 * app/board.js
 */
module.exports = function(conf){
	delete(require.cache[require('path').resolve(__filename)]);
	var fs = require('fs');
	var fsX = require('fs-extra');
	var utils79 = require('utils79');
	var twig = require('twig');
	var ejs = require('ejs');
	var Promise = require('es6-promise').Promise;


	return function(req, res, next){
		// console.log(req);
		// console.log(req.method);
		// console.log(req.body);
		// console.log(req.originalUrl);
		// console.log(req.main);
		// console.log(req.main.board);
		// console.log( JSON.stringify(userInfo) );

		var boardInfo,
			html;

		new Promise(function(rlv, rjc){
			rlv();
			return;
		}).then(function(){
			return new Promise(function(rlv, rjc){
				req.main.board.getBoardInfo( req.params.boardId, function( _boardInfo ){
					if( _boardInfo === false ){
						rjc();
						return;
					}
					boardInfo = _boardInfo;
					rlv();
					return;
				} );

				return;
			})
		}).then(function(){
			return new Promise(function(rlv, rjc){

				var templateSrc = fs.readFileSync(__dirname + '/board_files/template.html.ejs');

				try {
					var data = {
						"conf": conf,
						"req": req,
						'boardId': req.params.boardId,
						'boardInfo': boardInfo
					};
					var template = ejs.compile(templateSrc.toString(), {"filename": __dirname + '/board_files/template.html.ejs'});
					html = template(data);
				} catch (e) {
					console.log( 'TemplateEngine Rendering ERROR.' );
					html = '<div class="error">TemplateEngine Rendering ERROR.</div>';
				}

				rlv();
				return;
			})
		}).then(function(){
			return new Promise(function(rlv, rjc){
				res.status(200);
				res.set('Content-Type', 'text/html')

				res.send(html).end();

				rlv();
				return;
			})
		}).catch(function(){
			console.log('reject;');
			res.status(200);
			res.set('Content-Type', 'text/html')

			res.send('rejected...').end();
		});

		return;
	};


}
