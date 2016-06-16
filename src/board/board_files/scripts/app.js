window.app = new (function(){
	// app "board"
	var _this = this;
	var $ = require('jquery');
	var Promise = require('es6-promise').Promise;
	var utils79 = require('utils79');
	var it79 = require('iterate79');
	var twig = require('twig');
	var biflora,
		Keypress,
		userInfo = {
			'name': 'new Commer'
		};
	var $timeline,
		$timelineList,
		$timelineForm,
		$field,
		$fieldInner;
	var boardId;

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
				// DOM Setup
				$timeline = $('.board__timeline');
				$timelineList = $('.board__timeline .board__timeline_list');
				$timelineForm = $('.board__timeline .board__timeline_form');
				$field = $('.board__field');
				$fieldInner = $('.board__field .board__field-inner');

				// functions Setup
				_this.fieldContextMenu = new (require('../../board/board_files/scripts/libs/fieldContextMenu.js'))(_this, $fieldInner);
				_this.messageOperator = new (require('../../board/board_files/scripts/libs/messageOperator.js'))(_this, $timelineList, $fieldInner);
				_this.widgets = new (require('../../board/board_files/scripts/libs/widgets.js'))(_this, $timelineList, $fieldInner);

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// init biflora framework
				biflora = _this.biflora = window.biflora
					.createSocket(
						_this,
						io,
						{
							'receiveBroadcast': require('../../board/board_files/scripts/apis/receiveBroadcast.js')
						}
					)
				;
				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				windowResized();
				$(window).resize(function(){
					windowResized();
				});
				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// (biflora 送信テスト)
				biflora.send(
					'ping',
					{
					} ,
					function(rtn){
						console.log(rtn);
						rlv();
					}
				);
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// boardId ルームに参加する
				console.log('join to room: '+boardId);
				biflora.joinRoom(
					boardId,
					1,
					function(rtn){
						console.log(rtn);
						rlv();
					}
				);
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// boardId のこれまでのメッセージを取得する
				console.log('getting messages: '+boardId);
				biflora.send(
					'getMessageList',
					{'boardId': boardId},
					function(rtn){
						console.log(rtn);
						it79.ary(
							rtn.rows,
							function(it1, row1, idx1){
								_this.messageOperator.exec(row1);
								it1.next();
							},
							function(){
								rlv();
							}
						);
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

				Keypress = new window.keypress.Listener();
				_this.Keypress = Keypress;
				Keypress.simple_combo("backspace", function(e) {
					switch(e.target.tagName.toLowerCase()){
						case 'input': case 'textarea':
						return true; break;
					}
					e.preventDefault();
				});
				Keypress.simple_combo("delete", function(e) {
					switch(e.target.tagName.toLowerCase()){
						case 'input': case 'textarea':
						return true; break;
					}
					e.preventDefault();
				});
				Keypress.simple_combo("escape", function(e) {
					switch(e.target.tagName.toLowerCase()){
						case 'input': case 'textarea':
						return true; break;
					}
					e.preventDefault();
				});
				Keypress.simple_combo("enter", function(e) {
					switch(e.target.tagName.toLowerCase()){
						case 'input': case 'textarea':
							// alert('enter');
							var $this = $(e.target);
							var msg = {
								'content': $this.val(),
								'contentType': 'text/markdown'
							};
							_this.sendMessage(
								msg,
								function(rtn){
									console.log('Your message was sent.');
									console.log(rtn);
									$this.val('').focus();
								}
							);
							return true; break;
					}
					e.preventDefault();
				});
				// Keypress.simple_combo(cmdKeyName+" x", function(e) {
				// 	px.message('cmd x');
				// 	e.preventDefault();
				// });
				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// フィールドのイベントセット
				var mkWidget = function(e){
					// console.log(e);
					_this.fieldContextMenu.open(e.offsetX, e.offsetY);
					e.preventDefault();
				};
				$fieldInner
					.bind('dblclick', mkWidget)
					.bind('contextmenu', mkWidget)
					.bind('dragover', function(e){
						e.stopPropagation();
						e.preventDefault();
						// console.log(e);
					})
					.bind('dragleave', function(e){
						e.stopPropagation();
						e.preventDefault();
						// console.log(e);
					})
					.bind('drop', function(e){
						e.stopPropagation();
						e.preventDefault();
						// console.log(e);
						var event = e.originalEvent;
						var method = event.dataTransfer.getData("method");
						switch(method){
							case 'moveWidget':
								var targetWidgetId = event.dataTransfer.getData("widget-id");
								var fromX = event.dataTransfer.getData("offset-x");
								var fromY = event.dataTransfer.getData("offset-y");
								console.log(targetWidgetId, fromX, fromY);
								console.log(e.offsetX, e.offsetY);
								_this.sendMessage(
									{
										'contentType': 'application/x-passiflora-command',
										'content': JSON.stringify({
											'operation': method,
											'targetWidgetId': targetWidgetId,
											'moveToX': e.offsetX,
											'moveToY': e.offsetY
										})
									},
									function(rtn){
										console.log('command moveWidget was sent.');
									}
								);
								break;
						}
					})
				;

				$('body').on('click', function(){
					_this.fieldContextMenu.close();
				});

				rlv();
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				// プロフィールを入力する
				_this.editProfile(function(){
					rlv();
				});
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

	/**
	 * Window Resized
	 */
	function windowResized(callback){
		callback = callback || function(){};

		$timelineList.css({
			'height': $timeline.outerHeight() - $timelineForm.outerHeight()
		});

		callback();
		return;
	}

	/**
	 * プロフィールを編集
	 */
	this.editProfile = function(callback){
		callback = callback || function(){};
		console.log('profile dialog:');
		var $body = $('<form action="javascript:;" method="post">YourName: <input type="text" name="userName" value="{% userName %}" class="form-control" /></form>');
		$body.find('[name=userName]').val( userInfo.name );
		window.main.modal.dialog({
			'title': 'プロフィール',
			'body': $body,
			'buttons': [
				$('<button>')
					.text('OK')
					.addClass('btn-primary')
					.click(function(){
						userInfo.name = $body.find('[name=userName]').val();
						window.main.modal.close();
						callback();
					})
			]
		});
		return;
	}

	/**
	 * メッセージを送信する
	 */
	this.sendMessage = function(msg, callback){
		callback = callback || function(){};
		if(typeof(msg) !== typeof({}) && msg === null){
			callback(false);
			return;
		}
		msg.boardId = boardId;
		msg.owner = userInfo.name;

		biflora.send(
			'message',
			msg,
			function(rtn){
				callback(rtn);
			}
		);
		return;
	}

})();
