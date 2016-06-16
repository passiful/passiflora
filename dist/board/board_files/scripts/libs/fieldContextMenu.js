(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * fieldContextMenu.js
 */
module.exports = function( app, $fieldInner ){
	var _this = this;
	var $contextmenu = $('<div class="contextmenu">')
	;

	/**
	 * コンテキストメニューを開く
	 */
	this.open = function(x, y){
		// alert(x, y);
		var $ul = $('<ul>');
		var widgets = {
			'stickies': 'Stickies',
			'issuetree': 'Issue Tree'
		};
		for( var widgetName in widgets ){
			$ul
				.append( $('<li>')
					.append( $('<a>')
						.text(widgets[widgetName])
						.attr({
							'href': 'javascript:;'
						})
						.click(function(e){
							console.log(widgets[widgetName]);
							e.stopPropagation();
							_this.close();
							app.sendMessage(
								{
									'contentType': 'application/x-passiflora-command',
									'content': JSON.stringify({
										'operation':'createWidget',
										'widgetType': widgetName,
										'x': x,
										'y': y
									})
								} ,
								function(rtn){
									console.log(rtn);
								}
							);
						})
					)
				)
			;
		}
		$fieldInner.append( $contextmenu
			.css({
				'position': 'absolute',
				'top': y-5,
				'left': x-5
			})
			.click(function(e){
				e.stopPropagation();
			})
			.dblclick(function(e){
				e.stopPropagation();
			})
			.contextmenu(function(e){
				e.stopPropagation();
			})
			.html('')
			.append( $ul )
		);
	}

	/**
	 * コンテキストメニューを閉じる
	 */
	this.close = function(){
		$contextmenu.remove();
		return;
	}
	return;
}

},{}]},{},[1])