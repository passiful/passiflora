/**
 * widgets: issuetree.js
 */
module.exports = function( app, $widget ){
	var _this = this;
	var $ = require('jquery');
	this.issue = '';

	this.$widgetBody = $('<div class="issuetree">');
	this.$detailBody = $('<div class="issuetree">')
		.append( $('<div class="issuetree--issue">') )
		.append( $('<div class="issuetree--answer">') )
		.append( $('<div class="issuetree--yourstance">') )
		.append( $('<div class="issuetree--discussion-timeline">')
			.append( $('<div class="issuetree--discussion-timeline--timeline">') )
			.append( $('<div class="issuetree--discussion-timeline--form">')
				.append( $('<textarea class="issuetree--discussion-timeline--chat-comment">') )
			)
		)
		.append( $('<div class="issuetree--parent-issue">') )
		.append( $('<div class="issuetree--sub-issues">') )
	;

	this.$detailBody.find('textarea.issuetree--discussion-timeline--chat-comment').keypress(function(e){
		console.log(e);
		if( e.which == 13 ){
			// alert('enter');
			var $this = $(e.target);
			if( e.shiftKey ){
				// SHIFTキーを押しながらなら、送信せず改行する
				return true;
			}
			if(!$this.val().length){
				// 中身が空っぽなら送信しない
				return false;
			}
			var msg = {
				'content': $this.val(),
				'contentType': 'text/markdown'
			};
			app.sendMessage(
				{
					'content': JSON.stringify({
						'comment': $this.val()
					}),
					'contentType': 'application/x-passiflora-widget-message',
					'targetWidget': _this.id
				},
				function(){
					console.log('issuetree chat-comment submited.');
					$this.val('');
				}
			);
			return false;

		}
	});


	$widget
		.append( _this.$widgetBody
			.text('issue tree')
			.append( $('<div>')
				.append( $('<a>')
					.text('OPEN')
					.attr({'href':'javascript:;'})
					.click(function(){

						window.main.modal.dialog({
							'title': 'issue',
							'body': _this.$detailBody,
							'buttons': [
								$('<button>')
									.text('OK')
									.addClass('btn')
									.addClass('btn-primary')
									.click(function(){
										window.main.modal.close();
									})
							]
						});

					})
				)
			)
		)
	;

	/**
	 * widget への配信メッセージを受信
	 */
	this.onMessage = function(message){
		// console.log(message);
		// var before = this.value;
		// this.value = message.content.val;
		// $widgetBody.html( marked( _this.value ) );

		var $messageUnit = $('<div class="message-unit">')
			.attr({
				'data-message-id': message.id
			})
		;

		userMessage = message.content.comment;

		app.insertTimeline( $messageUnit
			.append( $('<div class="message-unit__owner">').text(message.owner) )
			.append( $('<div class="message-unit__content">').text(userMessage) )
			.append( $('<div class="message-unit__targetWidget">').append( $('<a>')
				.attr({
					'href':'javascript:;',
					'data-widget-id': message.targetWidget
				})
				.text('widget#'+message.targetWidget)
				.click(function(e){
					var widgetId = $(this).attr('data-widget-id');
					window.app.widgetMgr.focus(widgetId);
					return false;
				})
			) )
		);

	}


	return;
}
