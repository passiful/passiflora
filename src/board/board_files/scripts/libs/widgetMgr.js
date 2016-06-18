/**
 * widgets.js
 */
module.exports = function( app, $timelineList, $fieldInner ){
	var _this = this;
	var _ = require('underscore');
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
				'z-index': app.widgetsMaxZIndex ++
			})
			.attr({
				'data-widget-id': id,
				'data-offset-x': content.x,
				'data-offset-y': content.y,
				'draggable': true
			})
			.bind('mousedown', function(e){
				$(this).css({
					'z-index': app.widgetsMaxZIndex ++
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
		widgetIndex[id] = _.defaults( new app.widgetList[content.widgetType].api(app, $widget), app.widgetBase );
		widgetIndex[id].id = id;
		widgetIndex[id].widgetType = content.widgetType;
		return;
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
		widgetIndex[message.targetWidget].onMessage(message);
	}

	return;
}
