window.main = new (function(){
	window.$ = window.jQuery = require('jquery');

	this.modal = require('./main.modal.js');

})();
