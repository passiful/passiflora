(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * widgets.js
 */
module.exports = function( app, $timelineList, $fieldInner ){
	var _this = this;
	var zIndex = 1000;
	var widgetIndex = [];

	/**
	 * ウィジェットを配置する
	 */
	this.create = function(id, content){
		// console.log(id, content);
		var $widget = $('<div class="widget">');

		$fieldInner.append( $widget
			.css({
				'left': content.x,
				'top': content.y,
				'z-index': zIndex ++
			})
			.attr({
				'data-widget-id': id,
				'data-offset-x': content.x,
				'data-offset-y': content.y,
				'draggable': true
			})
			.bind('mousedown', function(e){
				$(this).css({
					'z-index': zIndex ++
				});
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
				// console.log(e);
			})
		);
		// console.log(content);
		widgetIndex[id] = new app.widgetList[content.widgetType].api(app, $widget);
	}

	/**
	 * ウィジェットを移動する
	 */
	this.move = function(id, content){
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

	/**
	 * ウィジェットにフォーカスする
	 */
	this.focus = function(widgetId){
		alert('TODO: 開発中の機能です。 WidgetID '+widgetId+' の座標に自動スクロールし、フォーカスします。');
	}

	/**
	 * ウィジェットのメッセージを受け取る
	 */
	this.receiveWidgetMessage = function(message){
		// console.log(message);
		widgetIndex[message.targetWidget].onmessage(message);
	}

	return;
}

},{}]},{},[1])