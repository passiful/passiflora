/**
 * logout.html.js
 */
module.exports = function(){
	var fs = require('fs');
	var ejs = require('ejs');

	return function(req, res, next){

		req.userInfo = undefined;
		req.session.destroy(function(err) {
			var templateSrc = fs.readFileSync(__dirname + '/logout_files/templates.ignore/index.html');
			var html = '';

			try {
				var data = {
					"req": req
				};
				var template = ejs.compile(templateSrc.toString(), {"filename": __dirname + '/index.html'});
				html = template(data);
			} catch (e) {
				console.log( 'TemplateEngine Rendering ERROR.' );
				html = '<div class="error">TemplateEngine Rendering ERROR.</div>'
			}

			res.set('Content-Type', 'text/html')
			res.status(200);
			res.send(html).end();
		})

		return;
	};


}
