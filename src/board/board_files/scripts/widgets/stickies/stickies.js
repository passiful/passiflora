/**
 * widgets: stickies.js
 */
module.exports = function( app, $widget ){

	this.value = '';

	var $textarea = $('<textarea>');

	$widget.append( $textarea
		.val(this.value)
		.on('change', function(e){
			var $this = $(this);
			app.sendMessage(
				{
					'content': JSON.stringify({
						'val': $this.val()
					}),
					'contentType': 'application/x-passiflora-widget-message',
					'targetWidget': $widget.attr('data-widget-id')
				},
				function(){
					console.log('stickies change submited.');
				}
			);
		})
	);


	this.onmessage = function(message){
		this.value = message.content.val;
		$textarea.val( this.value );

		var $messageUnit = $('<div class="message-unit">')
			.attr({
				'data-message-id': message.id
			})
		;
		app.insertTimeline( $messageUnit
			.append( $('<div class="message-unit__owner">').text(message.owner) )
			.append( $('<div class="message-unit__content">').text('stickies の内容を '+message.content.val + ' に書き換えました。') )
		);

	}

	return;
}
