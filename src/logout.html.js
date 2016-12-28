/**
 * logout.html.js
 */
module.exports = function(conf){
	var fs = require('fs');
	var ejs = require('ejs');

	return function(req, res, next){

		req.userInfo = undefined;
		req.session.destroy(function(err) {
			var templateSrc = fs.readFileSync(__dirname + '/logout_files/templates.ignore/index.html.ejs');
			var html = '';

			try {
				var data = {
					"conf": conf,
					"req": req
				};
				var template = ejs.compile(templateSrc.toString(), {"filename": __dirname + '/logout_files/templates.ignore/index.html.ejs'});
				html = template(data);
			} catch (e) {
				console.log( 'TemplateEngine Rendering ERROR.' );
				html = '<div class="error">TemplateEngine Rendering ERROR.</div>';
			}

			res.set('Content-Type', 'text/html');
			res.status(200);
			res.send(html).end();
		})

		return;
	};


}
