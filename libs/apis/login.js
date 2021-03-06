/**
 * login.js
 */
module.exports = function(){

	return function(req, res, next){
		// console.log(req);
		// console.log(req.method);
		// console.log(req.body);
		// console.log(req.originalUrl);

		req.userInfo = false;

		if(req.method.toLowerCase() == 'post'){
			var userInfo = false;
			if( typeof(req.body.userId) == typeof('') && typeof(req.body.userName) == typeof('') ){
				userInfo = {
					'userId': req.body.userId,
					'userName': req.body.userName
				}
				req.userInfo = req.session.userInfo = userInfo;
				if( userInfo === false ){
					res.status(403);
					res.send('Forbidden').end();
					return;
				}
				res.status(200);
				res.send('OK').end();
				return;
			}
		}

		if(req.session.userInfo){
			req.userInfo = req.session.userInfo;
		}

		// console.log(req.userInfo);
		var userInfo = req.userInfo;
		if( userInfo === false ){
			res.status(403);
			res.send('Forbidden').end();
			return;
		}
		res.status(200);
		res.send('OK').end();
		return;
	};


}
