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
			if(typeof(data.content)===typeof('')){
				data.content = marked(data.content);
			}

			console.log(data);
			callback(data);
			return;
		}
	};
})();
