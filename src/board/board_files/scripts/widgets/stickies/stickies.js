/**
 * widgets: stickies.js
 */
module.exports = function( app, $widget ){

	this.value = '';

	$widget.append( $('<textarea>')
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
				}
			);
		})
	);



	return;
}
