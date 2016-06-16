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


	this.onmessage = function(content){
		this.value = content.val;
		$textarea.val( this.value );
	}

	return;
}
