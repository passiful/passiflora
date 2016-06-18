/**
 * widgets: issuetree.js
 */
module.exports = function( app, $widget ){
	var _this = this;
	var $ = require('jquery');
	var mode = null;

	this.issue = '';
	this.answer = '';

	var $widgetBody = $('<div class="issuetree">')
		.append( $('<div class="issuetree__comment-count">') )
	;
	var $detailBody = $('<div class="issuetree">')
		.append( $('<div class="issuetree--issue">').html( app.markdown(this.issue) || 'no-set' ) )
		.append( $('<div class="issuetree--answer">').html( app.markdown(this.answer) || 'no-answer' ) )
		.append( $('<div class="issuetree--discussion-timeline">')
			.append( $('<div class="issuetree--discussion-timeline--timeline">') )
			.append( $('<div class="issuetree--discussion-timeline--form">')
				.append( $('<textarea class="form-control issuetree--discussion-timeline--chat-comment">') )
			)
		)
		.append( $('<div class="issuetree--parent-issue">') )
		.append( $('<div class="issuetree--sub-issues">') )
	;
	var $detailBodyTimeline = $detailBody.find('.issuetree--discussion-timeline--timeline');

	function apply( $textarea, targetType ){
		if(mode != 'edit'){return;}
		mode = null;
		if( _this[targetType] == $textarea.val() ){
			// 変更なし
			$textarea.val('').remove();
			return;
		}

		app.sendMessage(
			{
				'content': JSON.stringify({
					'command': 'update_' + targetType,
					'val': $textarea.val()
				}),
				'contentType': 'application/x-passiflora-widget-message',
				'targetWidget': $widget.attr('data-widget-id')
			},
			function(){
				console.log('issuetree change submited.');
			}
		);
		$textarea.val('').remove();
	}

	var $detailBodyIssue = $detailBody.find('.issuetree--issue')
		.css({
			'position': 'relative',
			'top': 0,
			'left': 0,
			'width': '100%'
		})
	;
	var $detailBodyIssue_textarea = $('<textarea>')
		.css({
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'width': '100%',
			'height': '100%'
		})
	;
	$detailBodyIssue
		.dblclick(function(e){
			mode = 'edit';
			$detailBodyIssue.append( $detailBodyIssue_textarea.val( _this.issue ) );
			app.setBehaviorCharComment(
				$detailBodyIssue_textarea,
				{
					'submit': function(value){
						apply( $detailBodyIssue_textarea, 'issue' );
					}
				}
			);
			$detailBodyIssue_textarea
				.on('change blur', function(e){
					apply( $detailBodyIssue_textarea, 'issue' );
				})
			;
			$detailBodyIssue_textarea.focus();
		})
		.click(function(e){
			e.stopPropagation();
		})
	;

	var $detailBodyAnswer = $detailBody.find('.issuetree--answer')
		.css({
			'position': 'relative',
			'top': 0,
			'left': 0,
			'width': '100%'
		})
	;
	var $detailBodyAnswer_textarea = $('<textarea>')
		.css({
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'width': '100%',
			'height': '100%'
		})
	;
	$detailBodyAnswer
		.dblclick(function(e){
			mode = 'edit';
			$detailBodyAnswer.append( $detailBodyAnswer_textarea.val( _this.answer ) );
			app.setBehaviorCharComment(
				$detailBodyAnswer_textarea,
				{
					'submit': function(value){
						apply( $detailBodyAnswer_textarea, 'answer' );
					}
				}
			);
			$detailBodyAnswer_textarea
				.on('change blur', function(e){
					apply( $detailBodyAnswer_textarea, 'answer' );
				})
			;
			$detailBodyAnswer_textarea.focus();
		})
		.click(function(e){
			e.stopPropagation();
		})
	;

	var $detailBodyParentIssue = $detailBody.find('.issuetree--parent-issue');
	var $detailBodySubIssues = $detailBody.find('.issuetree--sub-issues');

	app.setBehaviorCharComment(
		$detailBody.find('textarea.issuetree--discussion-timeline--chat-comment'),
		{
			'submit': function(value){
				app.sendMessage(
					{
						'content': JSON.stringify({
							'command': 'comment',
							'comment': value
						}),
						'contentType': 'application/x-passiflora-widget-message',
						'targetWidget': _this.id
					},
					function(){
						console.log('issuetree chat-comment submited.');
					}
				);

			}
		}
	);

	$widget
		.append( $widgetBody
			.append( $('<div>')
				.append( $('<a>')
					.text('OPEN')
					.attr({'href':'javascript:;'})
					.click(function(){

						window.main.modal.dialog({
							'title': 'issue',
							'body': $detailBody,
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
							app.adjustTimelineScrolling( $detailBodyTimeline );
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

		switch( message.content.command ){
			case 'comment':
				// コメントの投稿
				userMessage = app.markdown( message.content.comment );

				var totalCommentCount = $detailBodyTimeline.find('>div').size();
				$widgetBody.find('.issuetree__comment-count').text( (totalCommentCount+1) + '件のコメント' );

				// 詳細画面のディスカッションに追加
				$detailBodyTimeline.append( $('<div>')
					.append( $('<div class="issuetree__owner">').text(message.owner) )
					.append( $('<div class="issuetree__content">').html(userMessage) )
				);
				app.adjustTimelineScrolling( $detailBodyTimeline );

				// メインチャットに追加
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
				break;

			case 'update_issue':
				// 問の更新
				_this.issue = message.content.val;
				$detailBodyIssue.html( app.markdown(_this.issue) || 'no-set' );

				// 詳細画面のディスカッションに追加
				$detailBodyTimeline.append( $('<div>')
					.append( $('<div class="issuetree__content">').html(message.owner + ' が、問を "' + _this.issue + '" に変更しました。') )
				);
				app.adjustTimelineScrolling( $detailBodyTimeline );

				// メインチャットに追加
				app.insertTimeline( $messageUnit
					.append( $('<div class="message-unit__owner">').text(message.owner) )
					.append( $('<div class="message-unit__content">').html('問を "' + _this.issue + '" に変更しました。') )
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
				break;

			case 'update_answer':
				// 答の更新
				_this.answer = message.content.val;
				$detailBodyAnswer.html( app.markdown(_this.answer) || 'no-answer' );

				// 詳細画面のディスカッションに追加
				$detailBodyTimeline.append( $('<div>')
					.append( $('<div class="issuetree__content">').html(message.owner + ' が、答を "' + _this.answer + '" に変更しました。') )
				);
				app.adjustTimelineScrolling( $detailBodyTimeline );

				// メインチャットに追加
				app.insertTimeline( $messageUnit
					.append( $('<div class="message-unit__owner">').text(message.owner) )
					.append( $('<div class="message-unit__content">').html('答を "' + _this.answer + '" に変更しました。') )
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
				break;
		}

		return;
	} // onMessage()

	return;
}
