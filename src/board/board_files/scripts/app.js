window.app = new (function(){
	// app "board"
	var _this = this;
	var Promise = require('es6-promise').Promise;
	var utils79 = require('utils79');
	var it79 = require('iterate79');
	var socket;

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
			// .then(function(){ return new Promise(function(rlv, rjt){
			// 	rlv();
			// }); })
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
