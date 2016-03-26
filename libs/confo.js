/**
 * confo.js
 * config optimizer
 */
(function(module){
	delete(require.cache[require('path').resolve(__filename)]);
	var path = require('path');
	var conf = require('config');
	var urlParse = require('url-parse');
	conf.originParsed = new urlParse(conf.origin);
	conf.originParsed.protocol = conf.originParsed.protocol.replace(':','');
	if(!conf.originParsed.port){
		conf.originParsed.port = (conf.originParsed.protocol=='https' ? 443 : 80);
	}
	conf.dataDir = path.resolve(conf.dataDir)+'/';

	module.exports = conf;
})(module);
