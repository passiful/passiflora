window.app = new (function(){
	var _this = this;
	var $ = require('jquery');
	var Promise = require('es6-promise').Promise;
	var boardId,
		userInfo = {'id': '', 'name': ''};

	/**
	 * 初期化
	 */
	this.init = function(callback){
		callback = callback || function(){};

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				// BoardID を取得
				var pathname = window.location.pathname;
				pathname.match(new RegExp('\\/board\\/([0-9a-zA-Z]+)\\/'));
				boardId = RegExp.$1;

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				window.incense = new Incense();
				incense.init(
					{
						'elmBoard': $('.board__field').get(0),
						'elmTimeline': $('.board__timeline').get(0),
						'boardId': boardId,
						'userInfo': userInfo
					},
					function(){
						console.log('incense standby.');
						rlv();
					}
				);
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				callback();
			}); })
		;

		return;
	}

})();
