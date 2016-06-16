/**
 * widgets: issuetree.js
 */
module.exports = function( app, $widget ){

	$widget.append( $('<div>')
		.text('issue tree')
	);

	this.onmessage = function(content){
	}

	return;
}
