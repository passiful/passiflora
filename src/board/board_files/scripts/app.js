window.app = new (function(){
	// app "board"
	var _this = this;
	var Promise = require('es6-promise').Promise;
	var utils79 = require('utils79');
	var it79 = require('iterate79');
	var socket,
		_Keypress;

	/**
	 * 初期化
	 */
	this.init = function(callback){
		callback = callback || function(){};

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				// init biflora framework
				socket = _this.socket = window.biflora
					.createSocket(
						new (function(){

						})(),
						io,
						{
							'showSocketTest': function( data, callback, main, socket ){
								console.log(data);
								// alert(data.message);
								console.log(callback);
								callback(data);
								return;
							}
						}
					)
				;
				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// (biflora 送信テスト)
				socket.send(
					'api1',
					{
					} ,
					function(rtn){
						console.log(rtn);
						rlv();
					}
				);
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// キーボードイベントセット
				var cmdKeyName = (function(ua){
					// console.log(ua);
					var idxOf = ua.indexOf( 'Mac OS X' );
					if( idxOf >= 0 ){
						return 'cmd';
					}
					return 'ctrl';
				})(window.navigator.userAgent);
				// console.log(cmdKeyName);

				_Keypress = new window.keypress.Listener();
				_this.Keypress = _Keypress;
				_Keypress.simple_combo("backspace", function(e) {
					switch(e.target.tagName.toLowerCase()){
						case 'input': case 'textarea':
						return true; break;
					}
					e.preventDefault();
				});
				_Keypress.simple_combo("delete", function(e) {
					switch(e.target.tagName.toLowerCase()){
						case 'input': case 'textarea':
						return true; break;
					}
					e.preventDefault();
				});
				_Keypress.simple_combo("escape", function(e) {
					switch(e.target.tagName.toLowerCase()){
						case 'input': case 'textarea':
						return true; break;
					}
					e.preventDefault();
				});
				_Keypress.simple_combo("enter", function(e) {
					switch(e.target.tagName.toLowerCase()){
						case 'input': case 'textarea':
						return true; break;
					}
					e.preventDefault();
					alert('enter');
				});
				// _Keypress.simple_combo(cmdKeyName+" x", function(e) {
				// 	px.message('cmd x');
				// 	e.preventDefault();
				// });
				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// 返却
				console.log('standby.');
				callback(rtn);
				rlv();
			}); })
		;

		return;
	}

})();
