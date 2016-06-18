(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * main.modal.js
 */
module.exports = new (function(){
	var _this = this;
	var tpl = '<div class="modal fade" tabindex="-1" role="dialog">'+"\n"
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
	var $dialog;

	/**
	 * ダイアログを表示する
	 */
	this.dialog = function(opt){
		this.close(function(){

			$dialog = $(tpl);
			$('body')
				.append($dialog)
			;

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

			$dialog.find('.modal-title').append(opt.title);
			$dialog.find('.modal-body').append(opt.body);
			$dialog.find('.modal-footer').append(opt.buttons);
			$dialog.find('.modal-header button.close').click(function(e){
				_this.close();
			});

			$dialog.modal({
				// 'backdrop': 'static'
			});

		});
		return $dialog;
	}//dialog()

	/**
	 * ダイアログを閉じる
	 */
	this.close = function(callback){
		callback = callback || function(){};
		if($dialog){
			$dialog.modal('hide');
			setTimeout(function(){
				$dialog.remove();
				$dialog = undefined;
				delete($dialog);
				$('.modal-backdrop').remove();
				callback();
			}, 500);
			return $dialog;

		}
		callback();
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