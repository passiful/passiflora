/**
 * create.js
 */
module.exports = function(conf){
	delete(require.cache[require('path').resolve(__filename)]);
	var fs = require('fs');
	var fsX = require('fs-extra');

	return function(req, res, next){
		// console.log(req);
		// console.log(req.method);
		// console.log(req.body);
		// console.log(req.originalUrl);
		// console.log( JSON.stringify(userInfo) );

		res.status(200);

		var result = true;

		res.set('Content-Type', 'text/json')
		res.send(JSON.stringify(result)).end();
		return;
	};


}
