/**
 * widgets: stickies.js
 */
module.exports = function( app, $widget ){
	var _this = this;

	this.value = 'new Stickies';

	var $stickies = $('<div>')
		.css({
			'font-size': 13,
			'min-width': 80,
			'min-height': 80,
			'max-width': 180,
			'max-height': 180,
			'width': '100%',
			'height': '100%',
			'overflow': 'auto',
			'padding': '0.5em',
			'background': '#ffff98'
		})
	;
	var $textarea = $('<textarea>')
		.css({
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'width': '100%',
			'height': '100%'
		})
	;
	var mode = null;

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

	$widget.append( $stickies
		.html( marked( _this.value ) )
	);

	$widget
		.dblclick(function(e){
			mode = 'edit';
			$widget.append( $textarea.val( _this.value ) );
			$textarea.focus();
		})
		.click(function(e){
			e.stopPropagation();
		})
	;

	function apply(){
		if(mode != 'edit'){return;}
		mode = null;
		if( _this.value == $textarea.val() ){
			// 変更なし
			$textarea.val('').remove();
			$stickies.html( marked(_this.value) );
			return;
		}

		app.sendMessage(
			{
				'content': JSON.stringify({
					'val': $textarea.val()
				}),
				'contentType': 'application/x-passiflora-widget-message',
				'targetWidget': $widget.attr('data-widget-id')
			},
			function(){
				console.log('stickies change submited.');
				$textarea.val('').remove();
				$stickies.html( marked(_this.value) );
			}
		);
	}

	$textarea
		.on('change blur', function(e){
			apply();
		})
	;
	$('body')
		.on('click', function(e){
			apply();
		})
	;


	/**
	 * widget への配信メッセージを受信
	 */
	this.onMessage = function(message){
		// console.log(message);
		var before = this.value;
		this.value = message.content.val;
		$stickies.html( marked( _this.value ) );

		var $messageUnit = $('<div class="message-unit">')
			.attr({
				'data-message-id': message.id
			})
		;

		var userMessage = 'stickies の内容を "'+before+'" から "'+message.content.val + '" に書き換えました。';
		if( !before.length && message.content.val.length ){
			userMessage = 'stickies に内容 "'+message.content.val + '" をセットしました。';
		}else if( before.length && !message.content.val.length ){
			userMessage = 'stickies の内容 "'+before + '" を削除しました。';
		}
		app.insertTimeline( $messageUnit
			.append( $('<div class="message-unit__owner">').text(message.owner) )
			.append( $('<div class="message-unit__content">').text(userMessage) )
			.append( $('<div class="message-unit__targetWidget">').append( $('<a>')
				.attr({
					'href':'javascript:;',
					'data-widget-id': message.targetWidget
				})
				.text('widget#'+message.targetWidget)
				.click(function(e){
					var widgetId = $(this).attr('data-widget-id');
					window.app.widgetMgr.focus(widgetId);
					return false;
				})
			) )
		);

	}

	return;
}