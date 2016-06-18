/**
 * widgets: issuetree.js
 */
module.exports = function( app, $widget ){
	var _this = this;
	var $ = require('jquery');
	this.issue = '';

	this.$widgetBody = $('<div class="issuetree">')
		.append( $('<div class="issuetree__comment-count">') )
	;
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
	this.$detailBodyTimeline = this.$detailBody.find('.issuetree--discussion-timeline--timeline');

	this.$detailBody.find('textarea.issuetree--discussion-timeline--chat-comment').keypress(function(e){
		// console.log(e);
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

						setTimeout(function(){
							app.adjustTimelineScrolling( _this.$detailBodyTimeline );
						}, 1000);
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

		userMessage = app.markdown( message.content.comment );

		var totalCommentCount = this.$detailBodyTimeline.find('>div').size();
		this.$widgetBody.find('.issuetree__comment-count').text( (totalCommentCount+1) + '件のコメント' );

		this.$detailBodyTimeline.append( $('<div>')
			.append( $('<div class="issuetree__owner">').text(message.owner) )
			.append( $('<div class="issuetree__content">').html(userMessage) )
		);
		app.adjustTimelineScrolling( this.$detailBodyTimeline );

		app.insertTimeline( $messageUnit
			.append( $('<div class="message-unit__owner">').text(message.owner) )
			.append( $('<div class="message-unit__content">').html(userMessage) )
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
