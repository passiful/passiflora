/**
 * bifloraApi.js
 */
module.exports = (function(){
	delete(require.cache[require('path').resolve(__filename)]);
	return {
		'api1': function( data, callback, main, socket ){
			callback('result-1');
		} ,
		'api2': function( data, callback, main, socket ){
			callback('result-2');
		}
	};
})();
