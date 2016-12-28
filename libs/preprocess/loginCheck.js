/**
 * loginCheck.js
 */
module.exports = function(conf){
	var fs = require('fs');
	var ejs = require('ejs');

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

			var templateSrc = fs.readFileSync(__dirname + '/loginCheck_files/template.html.ejs');
			var html = '';

			try {
				var data = {
					"conf": conf,
					"req": req
				};
				var template = ejs.compile(templateSrc.toString(), {"filename": __dirname + '/loginCheck_files/template.html.ejs'});
				html = template(data);
			} catch (e) {
				console.log( 'TemplateEngine Rendering ERROR.' );
				html = '<div class="error">TemplateEngine Rendering ERROR.</div>';
			}

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
