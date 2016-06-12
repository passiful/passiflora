/**
 * bifloraApi - receiveBroadcast.js
 */
module.exports = function( data, callback, main, socket ){
	// console.log(data);
	// console.log(callback);
	main.addMessageToTimeline(data);
	callback(true);
	return;
}
