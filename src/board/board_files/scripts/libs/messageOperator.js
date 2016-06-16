/**
 * messageOperator.js
 */
module.exports = function( app, $timelineList, $fieldInner ){
	var _this = this;

	/**
	 * タイムラインメッセージを処理する
	 */
	this.exec = function(message){
		// console.log(message);

		var $messageUnit = $('<div class="message-unit">')
			.attr({
				'data-message-id': message.id
			})
		;

		switch( message.contentType ){
			case 'application/x-passiflora-command':
				message.content = JSON.parse(message.content);
				switch( message.content.operation ){
					case 'createWidget':
						app.widgets.create( message.id, message.content );
						var str = '';
						str += message.owner;
						str += ' が ';
						str += message.content.operation;
						str += ' しました。';
						$timelineList.append( $messageUnit
							.addClass('message-unit--operation')
							.append( $('<div class="message-unit__operation-message">').text(str) )
						);
						break;
					case 'moveWidget':
						app.widgets.move( message.id, message.content );
						break;
				}
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
