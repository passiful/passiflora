$(window).load(function(){
	var twig = require('twig');
	var $form = $('.cont_create_board');
	var $result = $('.result');
	$form.submit(function(){
		var $this = $(this);
		var board_theme = $this.find('input[name=board_theme]').val();
		var result;
		$form.find('button').attr({'disabled':'disabled'});
		// alert(board_theme);
		$.ajax({
			'url': '/apis/create',
			'type': 'POST',
			'data': {
				'board_theme': board_theme
			} ,
			'success': function(data){
				// console.log(data);
				result = data;
			},
			'error': function(err){
				console.log('ERROR: '+err);
			},
			'complete': function(){
				console.info('done', result);
				var html = '';
				var tpl = '';

				if( result.result ){
					// tpl = document.getElementById('template-result-ok').innerHTML;
					tpl = '<p>ディスカッションボードが作成されました。</p>' +
						  '<p><a href="/board/{{ boardId }}/">{{ boardId }}</a></p>';
				}else{
					// tpl = document.getElementById('template-result-ng').innerHTML;
					tpl = '<p>エラーがあります。</p>' +
						//   '{{dump(message)}}' +
						  '<ul>' +
						  '	{% for key, err in message.board_theme %}' +
						  '		<li>{{ err }}</li>' +
						  '	{% else %}' +
						  '		<li><em>no ERROR found</em></li>' +
						  '	{% endfor %}' +
						  '</ul>';
				}
				// console.log(tpl);

				try {
					html = new twig.twig({
						'data': tpl
					}).render(result);
					// console.log(html, result);
				} catch (e) {
					console.log( 'TemplateEngine Rendering ERROR.' );
					html = '<div class="error">TemplateEngine Rendering ERROR.</div>'
				}
				$result.html(html);

				$form.find('button').removeAttr('disabled');
			}
		});
	});
});
