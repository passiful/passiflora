/**
 * widgets: issuetree.js
 */
module.exports = function( app, $widget ){

	$widget
		.append( $('<div>')
			.text('issue tree')
		)
		.append( $('<div>')
			.append( $('<a>')
				.text('OPEN')
				.attr({'href':'javascript:;'})
				.click(function(){

					var $body = $('<div>');
					// $body.find('[name=userName]').val( userInfo.name );
					window.main.modal.dialog({
						'title': 'issue',
						'body': $body,
						'buttons': [
							$('<button>')
								.text('OK')
								.addClass('btn')
								.addClass('btn-primary')
								.click(function(){
									// userInfo.name = $body.find('[name=userName]').val();
									window.main.modal.close();
								})
						]
					});

				})
			)
		)
	;

	/**
	 * widget への配信メッセージを受信
	 */
	this.onmessage = function(content){
	}

	return;
}
