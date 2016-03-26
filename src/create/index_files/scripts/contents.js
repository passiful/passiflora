$(window).load(function(){
	var $form = $('.cont_create_board');
	$form.submit(function(){
		var $this = $(this);
		var board_theme = $this.find('input[name=board_theme]').val();
		var result;
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
			}
		});
	});
});
