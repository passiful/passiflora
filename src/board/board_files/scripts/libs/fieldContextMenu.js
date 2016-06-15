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
			.append( $('<ul>')
				.append( $('<li>')
					.append( $('<a>')
						.text('Stickies')
						.attr({
							'href': 'javascript:;'
						})
						.click(function(e){
							console.log('Stickies');
							e.stopPropagation();
							_this.close();
						})
					)
				)
				.append( $('<li>')
					.append( $('<a>')
						.text('Issue Tree')
						.attr({
							'href': 'javascript:;'
						})
						.click(function(e){
							console.log('Issue Tree');
							e.stopPropagation();
							_this.close();
						})
					)
				)
			)
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
