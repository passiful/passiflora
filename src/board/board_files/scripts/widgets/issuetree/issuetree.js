/**
 * widgets: issuetree.js
 */
module.exports = function( app, $widget ){
	var _this = this;
	var $ = require('jquery');
	var mode = null;

	this.issue = '未設定';
	this.answer = '1. 賛成'+"\n"+'2. 反対';
	this.vote = {};

	var $widgetBody = $('<div class="issuetree issuetree--widget">')
		.append( $('<div class="issuetree__issue markdown">').html( app.markdown(this.issue) || 'no-set' ) )
		.append( $('<div class="issuetree__comment-count">') )
	;
	var $detailBody = $('<div class="issuetree">')
		.append( $('<div class="issuetree__block">')
			.append( $('<div class="issuetree__heading">').text( '問' ) )
			.append( $('<div class="issuetree__issue markdown">').html( app.markdown(this.issue) || 'no-set' ) )
		)
		.append( $('<div class="issuetree__block">')
			.append( $('<div class="issuetree__heading">').text( '答' ) )
			.append( $('<div class="issuetree__answer markdown">').html( app.markdown(this.answer) || 'no-answer' ) )
		)
		.append( $('<div class="row">')
			.append( $('<div class="col-md-8">')
				.append( $('<div class="issuetree__block">')
					.append( $('<div class="issuetree__heading">').text( 'ディスカッション' ) )
					.append( $('<div class="issuetree__discussion-timeline">')
						.append( $('<div class="issuetree__discussion-timeline--timeline">') )
						.append( $('<div class="issuetree__discussion-timeline--form">')
							.append( $('<textarea class="form-control issuetree__discussion-timeline--chat-comment">') )
						)
					)
				)
			)
			.append( $('<div class="col-md-4">')
				.append( $('<div class="issuetree__block">')
					.append( $('<div class="issuetree__heading">').text( '親課題' ) )
					.append( $('<div class="issuetree__parent-issue">') )
				)
				.append( $('<div class="issuetree__block">')
					.append( $('<div class="issuetree__heading">').text( '子課題' ) )
					.append( $('<button class="btn btn-default">')
						.text('新しい子課題を作成')
						.click(function(e){
							app.sendMessage(
								{
									'contentType': 'application/x-passiflora-command',
									'content': JSON.stringify({
										'operation':'createWidget',
										'widgetType': _this.widgetType,
										'x': app.$field.scrollLeft() + $widget.offset().left + $widget.outerWidth() + 10,
										'y': app.$field.scrollTop() + $widget.offset().top + 10,
										'parent': _this.id
									})
								} ,
								function(rtn){
									// console.log(rtn);
									app.sendMessage(
										{
											'content': JSON.stringify({
												'command': 'update_relations'
											}),
											'contentType': 'application/x-passiflora-widget-message',
											'targetWidget': _this.id
										},
										function(){
											console.log('issuetree: update relations.');
										}
									);
								}
							);
						})
					)
					.append( $('<div class="issuetree__sub-issues">') )
				)
			)
		)
	;
	var $detailBodyTimeline = $detailBody.find('.issuetree__discussion-timeline--timeline');

	/**
	 * テキストエリアでの編集内容を反映する
	 */
	function applyTextareaEditContent( $textarea, targetType ){
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

	var $detailBodyIssue = $detailBody.find('.issuetree__issue')
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
						applyTextareaEditContent( $detailBodyIssue_textarea, 'issue' );
					}
				}
			);
			$detailBodyIssue_textarea
				.on('change blur', function(e){
					applyTextareaEditContent( $detailBodyIssue_textarea, 'issue' );
				})
			;
			$detailBodyIssue_textarea.focus();
		})
		.click(function(e){
			e.stopPropagation();
		})
	;

	var $detailBodyAnswer = $detailBody.find('.issuetree__answer')
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
						applyTextareaEditContent( $detailBodyAnswer_textarea, 'answer' );
					}
				}
			);
			$detailBodyAnswer_textarea
				.on('change blur', function(e){
					applyTextareaEditContent( $detailBodyAnswer_textarea, 'answer' );
				})
			;
			$detailBodyAnswer_textarea.focus();
		})
		.click(function(e){
			e.stopPropagation();
		})
	;

	var $detailBodyParentIssue = $detailBody.find('.issuetree__parent-issue');
	var $detailBodySubIssues = $detailBody.find('.issuetree__sub-issues');

	app.setBehaviorCharComment(
		$detailBody.find('textarea.issuetree__discussion-timeline--chat-comment'),
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

	/**
	 * 詳細画面を開く
	 */
	function openDetailWindow(){
		window.main.modal.dialog({
			'title': 'issue',
			'body': $detailBody,
			'buttons': [
				$('<button>')
					.text('閉じる')
					.addClass('btn')
					.addClass('btn-default')
					.click(function(){
						window.main.modal.close();
					})
			]
		});

		updateAnswer();
		updateRelations();

		setTimeout(function(){
			app.adjustTimelineScrolling( $detailBodyTimeline );
		}, 200);
	}

	$widget
		.dblclick(function(){
			openDetailWindow();
		})
		.append( $widgetBody
			.append( $('<div>')
				.append( $('<a>')
					.text('OPEN')
					.attr({'href':'javascript:;'})
					.click(function(){
						openDetailWindow();
					})
				)
			)
		)
	;

	/**
	 * 答欄を更新する
	 */
	function updateAnswer(){
		$detailBodyAnswer.html( app.markdown(_this.answer) || 'no-answer' );
		$detailBodyAnswer.find('ol>li').each(function(){
			var $this = $(this);
			var optionValue = $this.html()+'';
			var myAnswer = _this.vote[app.getUserInfo().id];
			$this
				.attr({
					'data-passiflora-vote-option': optionValue
				})
				.css({
					'border': '1px solid #ddd',
					'padding': '0.5em 1em',
					'font-weight': ( optionValue==myAnswer ? 'bold' : 'normal' ),
					'background-color': ( optionValue==myAnswer ? '#f0f0f0' : '#f9f9f9' ),
					'list-style-position': 'inside',
					'cursor': 'pointer'
				})
			;

			if( myAnswer != optionValue ){
				$this.append( $('<div>')
					.css({
						'text-align': 'right'
					})
					.append( $('<button class="btn btn-default">')
						.text('vote')
						.attr({
							'data-passiflora-vote-option': optionValue
						})
						.unbind('click')
						.bind('click', function(e){
							var $this = $(this);
							if( $this.attr('data-passiflora-vote-option') == _this.vote[app.getUserInfo().id] ){
								return false;
							}
							app.sendMessage(
								{
									'content': JSON.stringify({
										'command': 'vote',
										'option': $this.attr('data-passiflora-vote-option')
									}),
									'contentType': 'application/x-passiflora-widget-message',
									'targetWidget': _this.id
								},
								function(){
									console.log('issuetree vote submited.');
								}
							);
							return false;
						})
					)
				);
			}

			var $voteUserList = $('<ul class="issuetree__voteuser">')
			for( var userName in _this.vote ){
				// console.log(optionValue);
				if( _this.vote[userName] == optionValue ){
					var $li = $('<li>');
					$voteUserList.append( $li
						.text(userName)
					);
					// console.log( userName, app.getUserInfo().id );
					if( userName == app.getUserInfo().id ){
						$li.addClass('issuetree__voteuser--me');
					}
				}
			}
			if( $voteUserList.find('>li').size() ){
				$this.append( $voteUserList );
			}
		});
	}

	/**
	 * 親子関係欄を更新する
	 */
	function updateRelations(){
		// var $detailBodyParentIssue = $detailBody.find('.issuetree__parent-issue');
		// var $detailBodySubIssues = $detailBody.find('.issuetree__sub-issues');
		$detailBodyParentIssue.html('---');
		if( _this.parent ){
			$detailBodyParentIssue.html('').append( $('<div>')
				.append( $('<div>').text(app.widgetMgr.get(_this.parent).issue) )
				.append( $('<div>').append( app.widgetMgr.mkLinkToWidget( _this.parent ) ) )
			);
		}

		var children =  app.widgetMgr.getChildren( _this.id );
		$detailBodySubIssues.html('---');
		if( children.length ){
			$detailBodySubIssues.html('');
			var $ul = $('<ul>');
			for( var idx in children ){
				var $li = $('<li>')
					.append( $('<div>').text(children[idx].issue) )
					.append( $('<div>').append( app.widgetMgr.mkLinkToWidget( children[idx].id ) ) )
				;
				$ul.append( $li );
			}
			$detailBodySubIssues.append( $ul );

		}

		return;
	}

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
					.append( $('<div class="issuetree__content markdown">').html(userMessage) )
				);
				app.adjustTimelineScrolling( $detailBodyTimeline );

				// メインチャットに追加
				app.insertTimeline( $messageUnit
					.append( $('<div class="message-unit__owner">').text(message.owner) )
					.append( $('<div class="message-unit__content markdown">').html(userMessage) )
					.append( $('<div class="message-unit__targetWidget">').append( app.widgetMgr.mkLinkToWidget( message.targetWidget ) ) )
				);
				break;

			case 'update_issue':
				// 問の更新
				_this.issue = message.content.val;
				$detailBodyIssue.html( app.markdown(_this.issue) || 'no-set' );
				$widget.find('.issuetree__issue').html( app.markdown(_this.issue) || 'no-set' );

				// 詳細画面のディスカッションに追加
				$detailBodyTimeline.append( $('<div>')
					.append( $('<div class="issuetree__content">').html(message.owner + ' が、問を "' + _this.issue + '" に変更しました。') )
				);
				app.adjustTimelineScrolling( $detailBodyTimeline );

				// メインチャットに追加
				app.insertTimeline( $messageUnit
					.append( $('<div class="message-unit__owner">').text(message.owner) )
					.append( $('<div class="message-unit__content">').html('問を "' + _this.issue + '" に変更しました。') )
					.append( $('<div class="message-unit__targetWidget">').append( app.widgetMgr.mkLinkToWidget( message.targetWidget ) ) )
				);
				break;

			case 'update_answer':
				// 答の更新
				_this.answer = message.content.val;
				updateAnswer();

				// 詳細画面のディスカッションに追加
				$detailBodyTimeline.append( $('<div>')
					.append( $('<div class="issuetree__content">').html(message.owner + ' が、答を "' + _this.answer + '" に変更しました。') )
				);
				app.adjustTimelineScrolling( $detailBodyTimeline );

				// メインチャットに追加
				app.insertTimeline( $messageUnit
					.append( $('<div class="message-unit__owner">').text(message.owner) )
					.append( $('<div class="message-unit__content">').html('答を "' + _this.answer + '" に変更しました。') )
					.append( $('<div class="message-unit__targetWidget">').append( app.widgetMgr.mkLinkToWidget( message.targetWidget ) ) )
				);
				break;

			case 'vote':
				// 投票更新
				_this.vote[message.owner] = message.content.option;
				updateAnswer();

				// 詳細画面のディスカッションに追加
				$detailBodyTimeline.append( $('<div>')
					.append( $('<div class="issuetree__content">').text(message.owner + ' が、 "' + message.content.option + '" に投票しました。') )
				);
				app.adjustTimelineScrolling( $detailBodyTimeline );

				// メインチャットに追加
				app.insertTimeline( $messageUnit
					.append( $('<div class="message-unit__owner">').text(message.owner) )
					.append( $('<div class="message-unit__content">').text(message.owner + ' が、 "' + message.content.option + '" に投票しました。') )
					.append( $('<div class="message-unit__targetWidget">').append( app.widgetMgr.mkLinkToWidget( message.targetWidget ) ) )
				);
				break;

			case 'update_relations':
				// 親子関係の表示を更新する
				updateRelations();
				break;

		}

		return;
	} // onMessage()

	/**
	 * widget へフォーカスした時の反応
	 */
	this.focus = function(){
		openDetailWindow();
	}

	return;
}
