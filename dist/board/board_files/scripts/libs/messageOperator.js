(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * node-iterate79
 */
(function(exports){

	/**
	 * 配列の直列処理
	 */
	exports.ary = function(ary, fnc, fncComplete){
		return new (function( ary, fnc, fncComplete ){
			this.idx = -1;
			this.idxs = [];
			for( var i in ary ){
				this.idxs.push(i);
			}
			this.ary = ary||[];
			this.fnc = fnc||function(){};
			this.fncComplete = fncComplete||function(){};

			this.next = function(){
				if( this.idx+1 >= this.idxs.length ){
					this.fncComplete();
					return this;
				}
				this.idx ++;
				this.fnc( this, this.ary[this.idxs[this.idx]], this.idxs[this.idx] );
				return this;
			}
			this.next();
		})(ary, fnc, fncComplete);
	}

	/**
	 * 関数の直列処理
	 */
	exports.fnc = function(aryFuncs){
		var mode = 'explicit';
		var defaultArg = undefined;
		if( arguments.length >= 2 ){
			mode = 'implicit';
			defaultArg = arguments[0];
			aryFuncs = arguments[arguments.length-1];
		}


		function iterator( aryFuncs ){
			aryFuncs = aryFuncs||[];

			var idx = 0;
			var funcs = aryFuncs;
			var isStarted = false;//2重起動防止

			this.start = function(arg){
				if(isStarted){return this;}
				isStarted = true;
				return this.next(arg);
			}

			this.next = function(arg){
				arg = arg||{};
				if(funcs.length <= idx){return this;}
				(funcs[idx++])(this, arg);
				return this;
			};
		}
		var rtn = new iterator(aryFuncs);
		if( mode == 'implicit' ){
			return rtn.start(defaultArg);
		}
		return rtn;
	}


})(exports);

},{}],2:[function(require,module,exports){
/**
 * messageOperator.js
 */
module.exports = function( app, $timelineList, $fieldInner ){
	var _this = this;
	var newestMessageNumber = 0;
	var messageQueue = {};
	var messageQueueLength = 0;
	var it79 = require('iterate79');
	var isQueueProgress = false;

	/**
	 * タイムラインメッセージを処理する
	 */
	function execute(message, callback){
		callback = callback || function(){};

		var $messageUnit = $('<div class="message-unit">')
			.attr({
				'data-message-id': message.id
			})
		;

		if( !message.content ){
			console.error('content がセットされていないレコードです。', message);
			callback();
			return;
		}

		switch( message.contentType ){
			case 'application/x-passiflora-command':
				message.content = JSON.parse(message.content);
				switch( message.content.operation ){
					case 'createWidget':
						app.widgetMgr.create( message.id, message.content );
						var str = '';
						str += message.owner;
						str += ' が ';
						str += message.content.widgetType;
						str += ' を作成しました。';
						app.insertTimeline( $messageUnit
							.addClass('message-unit--operation')
							.append( $('<div class="message-unit__operation-message">').text(str) )
						);
						break;
					case 'moveWidget':
						app.widgetMgr.move( message.id, message.content );
						break;
					case 'userLogin':
						app.userMgr.login( message.connectionId, message.content.userInfo, function(err, userInfo){
							// console.log('user "'+userInfo.name+'" Login.');
							var str = '';
							str += message.content.userInfo.name;
							str += ' がログインしました。';
							app.insertTimeline( $messageUnit
								.addClass('message-unit--operation')
								.append( $('<div class="message-unit__operation-message">').text(str) )
							);
						} );
						break;
					case 'userLogout':
						// message.content = JSON.parse(message.content);
						app.userMgr.logout( message.connectionId, function(err, userInfo){
							if(userInfo === undefined){
								console.error( 'userLogout: userInfo が undefined です。' );
								return;
							}
							// console.log(userInfo);
							// console.log('user "'+userInfo.name+'" Logout.');
							var str = '';
							str += userInfo.name;
							str += ' がログアウトしました。';
							app.insertTimeline( $messageUnit
								.addClass('message-unit--operation')
								.append( $('<div class="message-unit__operation-message">').text(str) )
							);
						} );
						break;
				}
				break;
			case 'application/x-passiflora-widget-message':
				message.content = JSON.parse(message.content);
				app.widgetMgr.receiveWidgetMessage( message );
				break;
			case 'text/html':
				app.insertTimeline( $messageUnit
					.append( $('<div class="message-unit__owner">').text(message.owner) )
					.append( $('<div class="message-unit__content markdown">').html(message.content) )
				);
				break;
		}
		callback();
		return;
	}

	/**
	 * タイムラインメッセージを受け付ける
	 */
	this.exec = function(message, callback){
		if( newestMessageNumber >= message.id ){
			// 既に処理済みのメッセージとみなし、キューに追加しない。
			console.error(message.id + ' は、すでに処理済みのメッセージです。');
			console.error(message);
			callback(); return;
		}
		if( newestMessageNumber[message.id] ){
			// 既に登録済みのメッセージとみなし、キューに追加しない。
			console.error(message.id + ' は、すでにキューに登録済みのメッセージです。');
			console.error(message);
			callback(); return;
		}


		messageQueue[message.id] = message;//メッセージを Queue に追加
		messageQueueLength ++;
		// console.log(message);

		callback = callback || function(){};

		if( isQueueProgress ){
			callback(); return;
		}
		isQueueProgress = true;

		function queueLoop(){
			setTimeout(function(){
				if( !messageQueue[newestMessageNumber+1] ){
					// 次のメッセージがなければストップ
					if( messageQueueLength ){
						// TODO: サーバーに問い合わせ、欠けた情報を取得する必要がある。
						// ここを通る場合、受信に失敗したメッセージがあって連番が抜けている可能性が高い。
						console.error(messageQueueLength + ' 件の未処理のメッセージが残っています。');
						console.error(messageQueue);
						console.error(newestMessageNumber);
					}
					// console.log(messageQueue);
					isQueueProgress = false;
					callback();
					return;
				}
				newestMessageNumber ++;
				// console.log(newestMessageNumber);

				// 次のメッセージを処理
				execute(messageQueue[newestMessageNumber], function(){
					// 処理済みのメッセージを破棄
					messageQueue[newestMessageNumber] = undefined;
					delete( messageQueue[newestMessageNumber] );
					messageQueueLength --;
					queueLoop();//再帰処理
				});
			}, 0);

			return;
		}
		queueLoop();

		return;
	}


	/**
	 * ウィジェットを配置する
	 */
	this.createWidget = function(id, content){
		$fieldInner.append( $('<div class="widget">')
			.css({
				'left': content.x,
				'top': content.y
			})
			.attr({
				'data-widget-id': id,
				'data-offset-x': content.x,
				'data-offset-y': content.y,
				'draggable': true
			})
			.on('dblclick contextmenu', function(e){
				e.stopPropagation();
			})
			.bind('dragstart', function(e){
				e.stopPropagation();
				var event = e.originalEvent;
				var $this = $(this);
				event.dataTransfer.setData("method", 'moveWidget' );
				event.dataTransfer.setData("widget-id", $this.attr('data-widget-id') );
				event.dataTransfer.setData("offset-x", $this.attr('data-offset-x') );
				event.dataTransfer.setData("offset-y", $this.attr('data-offset-y') );
				console.log(e);
			})
		);
	}

	/**
	 * ウィジェットを配置する
	 */
	this.moveWidget = function(id, content){
		$targetWidget = $fieldInner.find('[data-widget-id='+content.targetWidgetId+']');
		$targetWidget
			.css({
				'left': content.moveToX,
				'top': content.moveToY
			})
			.attr({
				'data-offset-x': content.moveToX,
				'data-offset-y': content.moveToY
			})
		;
	}

	return;
}

},{"iterate79":1}]},{},[2])