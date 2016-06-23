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
			'id': 'new Commer',
			'name': 'new Commer'
		};
	var $timeline,
		$timelineList,
		$timelineForm,
		$field,
		$fieldRelations,
		$fieldInner;
	var boardId;

	/**
	 * 初期化
	 */
	this.init = function(callback){
		callback = callback || function(){};

		this.widgetsMaxZIndex = 1000;

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
				$fieldRelations = $('.board__field .board__field-relations');
				$fieldInner = $('.board__field .board__field-inner');

				_this.$field = $field;
				_this.$fieldInner = $fieldInner;
				$fieldRelations.append( $('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 10000 10000">') );

				// functions Setup
				_this.fieldContextMenu = new (require('../../board/board_files/scripts/libs/fieldContextMenu.js'))(_this, $fieldInner);
				_this.messageOperator = new (require('../../board/board_files/scripts/libs/messageOperator.js'))(_this, $timelineList, $fieldInner);
				_this.widgetMgr = new (require('../../board/board_files/scripts/libs/widgetMgr.js'))(_this, $timelineList, $field, $fieldInner);
				_this.widgetBase = require('../../board/board_files/scripts/libs/widgetBase.js');
				_this.userMgr = new (require('../../board/board_files/scripts/libs/userMgr.js'))(_this, $timelineList, $field, $fieldInner);

				_this.widgetList = {
					'stickies': {
						'name': 'Stickies',
						'api': require('../../board/board_files/scripts/widgets/stickies/stickies.js')
					},
					'issuetree': {
						'name': 'Issue Tree',
						'api': require('../../board/board_files/scripts/widgets/issuetree/issuetree.js')
					}
				};


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
					{} ,
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
				app.setBehaviorCharComment(
					$timelineForm.find('textarea.board__main-chat-comment'),
					{
						'submit': function(value){
							var msg = {
								'content': value,
								'contentType': 'text/markdown'
							};
							_this.sendMessage(
								msg,
								function(rtn){
									console.log('Your message was sent.');
								}
							);

						}
					}
				);
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
								var fromOffsetX = event.dataTransfer.getData("offset-x");
								var fromOffsetY = event.dataTransfer.getData("offset-y");
								// console.log(targetWidgetId, fromX, fromY);
								// console.log(e.offsetX, e.offsetY);
								// console.log(e);
								var toX = $field.offset().left + $field.scrollLeft() + e.pageX - fromOffsetX;
								if( toX < 0 ){ toX = 0; }
								var toY = $field.offset().top + $field.scrollTop() + e.pageY - fromOffsetY;
								if( toY < 0 ){ toY = 0; }
								_this.sendMessage(
									{
										'contentType': 'application/x-passiflora-command',
										'content': JSON.stringify({
											'operation': method,
											'targetWidgetId': targetWidgetId,
											'moveToX': toX,
											'moveToY': toY
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

		_this.updateRelations();

		callback();
		return;
	}

	/**
	 * チャットコメントフォームを作成
	 */
	this.setBehaviorCharComment = function($textarea, callbacks){
		callbacks = callbacks || {};
		callbacks.submit = callbacks.submit || function(){};
		$textarea = $($textarea);
		$textarea.keypress(function(e){
			// console.log(e);
			if( e.which == 13 ){
				// alert('enter');
				var $this = $(e.target);
				if( e.shiftKey ){
					// SHIFTキーを押しながらなら、送信せず改行する
					return true;
				}
				if(!$this.val().length){
					// 中身が空っぽなら送信しない
					return false;
				}
				var fixedValue = $this.val();
				callbacks.submit( fixedValue );
				$this.val('').focus();
				return false;
			}
			return;
		});
		return $textarea;
	} // setBehaviorCharComment()

	/**
	 * メインタイムラインにメッセージを表示する
	 */
	this.insertTimeline = function( $messageUnit ){
		$timelineList.append( $messageUnit );

		this.adjustTimelineScrolling($timelineList);

		return;
	}

	/**
	 * タイムラインのスクロール位置をあわせる
	 */
	this.adjustTimelineScrolling = function( $timeline ){
		var scrTop = $timeline.scrollTop();
		var oH = $timeline.outerHeight();
		var iH = $timeline.get(0).scrollHeight;
		$timeline.scrollTop(iH-oH);
		// console.log(scrTop, oH, iH);

		return;
	}

	/**
	 * Markdown 変換する
	 */
	this.markdown = function(md){
		// md = md.replace(/(\r\n|\r|\n)/g, '<br />');

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
		var html = marked(md);
		var $div = $('<div>').html(html);
		$div.find('a').attr({'target': '_blank'});
		return $div.html();
	}

	/**
	 * ログインユーザー情報を取得
	 */
	this.getUserInfo = function(){
		return userInfo;
	}

	/**
	 * プロフィールを編集
	 */
	this.editProfile = function(callback){
		callback = callback || function(){};
		console.log('profile dialog:');
		var $body = $('<form action="javascript:;" method="post">YourName: <input type="text" name="userName" value="{% userName %}" class="form-control" /></form>');
		$body.find('[name=userName]').val( userInfo.id );
		window.main.modal.dialog({
			'title': 'プロフィール',
			'body': $body,
			'buttons': [
				$('<button>')
					.text('OK')
					.addClass('btn')
					.addClass('btn-primary')
					.click(function(){
						var name = JSON.parse(JSON.stringify($body.find('[name=userName]').val()));
						userInfo.id = name;
						userInfo.name = name;
						_this.sendMessage(
							{
								'content': JSON.stringify({
									'userInfo': userInfo,
									'operation': 'userLogin'
								}),
								'contentType': 'application/x-passiflora-command'
							},
							function(rtn){
								window.main.modal.close();
							}
						);
						callback();
					})
			]
		});
		setTimeout(function(){
			$body.find('input').get(0).focus();
		}, 1000);
		return;
	}

	/**
	 * 親子関係の表現を更新する
	 */
	this.updateRelations = function( callback ){
		callback = callback || function(){};
		// <path stroke="black" stroke-width="2" fill="none" d="M120,170 180,170 150,230z" />

		function getCenterOfGravity($elm){
			var toX = $field.offset().left + $field.scrollLeft() + $elm.offset().left + $elm.outerWidth()/2;
			if( toX < 0 ){ toX = 0; }
			var toY = $field.offset().top + $field.scrollTop() + $elm.offset().top + $elm.outerHeight()/2;
			if( toY < 0 ){ toY = 0; }
			return {'x':toX, 'y':toY};
		}

		var $svg = $fieldRelations.find('>svg');
		$svg.html('');
		var widgets = this.widgetMgr.getAll();
		for( var idx in widgets ){
			if( !widgets[idx].parent ){ continue; }
			var d = '';
			var me = getCenterOfGravity(widgets[idx].$);
			var parent = getCenterOfGravity(_this.widgetMgr.get(widgets[idx].parent).$);
			$svg.get(0).innerHTML += '<path stroke="#333" stroke-width="3" fill="none" d="M'+me.x+','+me.y+' L'+parent.x+','+parent.y+'" style="opacity: 0.2;" />';
		}

		callback();
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
		msg.owner = userInfo.id;

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
