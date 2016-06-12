/**
 * bifloraApi.js
 */
module.exports = (function(){
	delete(require.cache[require('path').resolve(__filename)]);
	return {
		'api1': function( data, callback, main, socket ){
			callback('result-1');
		} ,
		'message': function( data, callback, main, socket ){
			data.time = Date.now();
			console.log(data);
			callback(data);
			return;
		}
	};
})();
