/**
 * loginCheck.js
 */
module.exports = function(){
	var fs = require('fs');

	return function(req, res, next){
		// console.log(req);
		// console.log(req.method);
		// console.log(req.body);
		// console.log(req.originalUrl);
		var userInfo = req.userInfo;
		// console.log( JSON.stringify(userInfo) );


		if( !userInfo ){
			res.status(403);
			res.set('Content-Type', 'text/html');
			var html = fs.readFileSync( __dirname + '/loginCheck_files/template.html' );
			res
				.send(html)
				.end()
			;
			return;
		}

		next();
		return;
	};


}
