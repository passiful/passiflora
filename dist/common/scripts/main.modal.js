(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * main.modal.js
 */
module.exports = new (function(){
	var _this = this;
	var $dialog;

	/**
	 * ダイアログを表示する
	 */
	this.dialog = function(opt){
		this.close();

		var tpl = '<div class="modal fade">'+"\n"
				+ '  <div class="modal-dialog" role="document">'+"\n"
				+ '    <div class="modal-content">'+"\n"
				+ '      <div class="modal-header">'+"\n"
				+ '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">'+"\n"
				+ '          <span aria-hidden="true">&times;</span>'+"\n"
				+ '        </button>'+"\n"
				+ '        <h4 class="modal-title"></h4>'+"\n"
				+ '      </div>'+"\n"
				+ '      <div class="modal-body"></div>'+"\n"
				+ '      <div class="modal-footer">'+"\n"
				// + '        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+"\n"
				// + '        <button type="button" class="btn btn-primary">Save changes</button>'+"\n"
				+ '      </div>'+"\n"
				+ '    </div><!-- /.modal-content -->'+"\n"
				+ '  </div><!-- /.modal-dialog -->'+"\n"
				+ '</div><!-- /.modal -->';

		opt = opt||{};
		opt.title = opt.title||'command:';
		opt.body = opt.body||$('<div>');
		opt.buttons = opt.buttons||[
			$('<button class="btn btn-primary">').text('OK').click(function(){
				this.close();
			})
		];

		for( var i in opt.buttons ){
			var $btnElm = $(opt.buttons[i]);
			$btnElm.each(function(){
				if(!$(this).hasClass('btn')){
					$(this).addClass('btn').addClass('btn-secondary');
				}
			});
			opt.buttons[i] = $btnElm;
		}

		// var $dialogButtons = $('<div class="modal-footer">').append(opt.buttons);

		$dialog = $(tpl);
		$dialog.find('.modal-title').append(opt.title);
		$dialog.find('.modal-body').append(opt.body);
		$dialog.find('.modal-footer').append(opt.buttons);

		// $dialog = $('<div>')
		// 	.addClass('contents')
		// 	.css({
		// 		'position':'fixed',
		// 		'left':0, 'top':0,
		// 		'width': $(window).width(),
		// 		'height': $(window).height(),
		// 		'overflow':'hidden',
		// 		'z-index':10000
		// 	})
		// 	.append( $('<div>')
		// 		.css({
		// 			'position':'fixed',
		// 			'left':0, 'top':0,
		// 			'width':'100%', 'height':'100%',
		// 			'overflow':'hidden',
		// 			'background':'#000',
		// 			'opacity':0.5
		// 		})
		// 	)
		// 	.append( $('<div>')
		// 		.css({
		// 			'position':'absolute',
		// 			'left':0, 'top':0,
		// 			'padding-top':'4em',
		// 			'overflow':'auto',
		// 			'width':"100%",
		// 			'height':"100%"
		// 		})
		// 		.append( $('<div>')
		// 			.addClass('dialog_box')
		// 			.css({
		// 				'width':'80%',
		// 				'margin':'3em auto'
		// 			})
		// 			.append( $('<h1>')
		// 				.text(opt.title)
		// 			)
		// 			.append( $('<div>')
		// 				.append(opt.body)
		// 			)
		// 			.append( $dialogButtons )
		// 		)
		// 	)
		// ;

		$('body')
			.append($dialog)
		;
		$dialog.modal({
			'backdrop': 'static'
		});
		return $dialog;
	}//dialog()

	/**
	 * ダイアログを閉じる
	 */
	this.close = function(){
		if( $dialog ){
			$dialog.modal('hide');
			setTimeout(function(){
				$dialog.remove();
				$('.modal-backdrop').remove();
			}, 500);
		}
		return $dialog;
	}//close()


	/**
	 * イベントリスナー
	 */
	$(window).on( 'resize', function(e){
		if( typeof($dialog) !== typeof( $('<div>') ) ){return;}
		$dialog
			.css({
				'width': $(window).width(),
				'height': $(window).height()
			})
		;
	} );

})();

},{}]},{},[1])