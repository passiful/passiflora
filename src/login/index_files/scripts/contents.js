window.contApp = function(){}
$(window).load(function(){
	var twig = require('twig');
	$('form.gotoBoard').submit(function(){
		var $form = $(this);
		var boardId = $form.find('[name=board_id]').val();
		var url = '/board/{{ boardId }}/';
		var href = new twig.twig({
			'data': url
		}).render({
			'boardId': boardId
		});
		// alert(href);
		window.location.href = href;
	});
});
