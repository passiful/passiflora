(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * messageOperator.js
 */
module.exports = function( app, $timelineList, $fieldInner ){
	var _this = this;

	$fieldInner
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
			console.log(e);
		})
	;

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
			.bind('dragstart', function(e){
				e.stopPropagation();
				var event = e.originalEvent;
				event.dataTransfer.setData("method", 'moveWidget' );
				console.log(e);
			})
		);
	}

	return;
}

},{}]},{},[1])