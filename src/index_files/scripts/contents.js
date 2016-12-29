window.contApp = function(){}
$(window).load(function(){
	var twig = require('twig');
	$('form.gotoBoard').submit(function(){
		var $form = $(this);
		var boardId = $form.find('[name=board_id]').val();
		var href = '/board/'+boardId+'/';
		// alert(href);
		window.location.href = href;
	});
});
