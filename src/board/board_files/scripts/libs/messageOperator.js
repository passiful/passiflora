/**
 * messageOperator.js
 */
module.exports = function( app, $timelineList, $fieldInner ){
	var _this = this;

	/**
	 * タイムラインメッセージを処理する
	 */
	this.exec = function(message){
		console.log(message);

		var $messageUnit = $('<div class="message-unit">')
			.attr({
				'data-message-id': message.id
			})
		;

		switch( message.contentType ){
			case 'application/command':
				message.content = JSON.parse(message.content);
				var str = '';
				str += message.owner;
				str += ' が ';
				str += message.content.operation;
				str += ' しました。';
				$timelineList.append( $messageUnit
					.addClass('message-unit--operation')
					.append( $('<div class="message-unit__operation-message">').text(str) )
				);
				this.createWidget( message.content.widgetType, message.content.x, message.content.y );
				break;
			case 'text/html':
				$timelineList.append( $messageUnit
					.append( $('<div class="message-unit__owner">').text(message.owner) )
					.append( $('<div class="message-unit__content">').html(message.content) )
				);
				break;
		}

		var scrTop = $timelineList.scrollTop();
		var oH = $timelineList.outerHeight();
		var iH = $timelineList.get(0).scrollHeight;
		$timelineList.scrollTop(iH-oH);
		// console.log(scrTop, oH, iH);

		return;
	}


	/**
	 * ウィジェットを配置する
	 */
	this.createWidget = function(widgetType, x, y){
		$fieldInner.append( $('<div class="widget">')
			.css({
				'left': x,
				'top': y
			})
			.attr({
				'draggable': true
			})
			.on('dblclick contextmenu', function(e){
				e.stopPropagation();
			})
		);
	}

	return;
}
