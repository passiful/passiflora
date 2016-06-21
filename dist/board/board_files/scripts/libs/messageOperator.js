(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

		if( !message.content ){
			console.error('content がセットされていないレコードです。', message);
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
						console.log('user Logout.');
						app.userMgr.logout( message.connectionId, function(err, userInfo){
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

},{}]},{},[1])